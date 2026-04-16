import { useEffect, useRef, useState, useCallback } from 'react';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import { supabase } from '@/config/supabase';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

type SignalPayload =
  | { type: 'offer'; sdp: string; from: string }
  | { type: 'answer'; sdp: string; from: string }
  | { type: 'ice-candidate'; candidate: any; from: string }
  | { type: 'hang-up'; from: string };

export function useWebRTC(sessionId: string, userId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const pc = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const makingOffer = useRef(false);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);
  const cleanedUp = useRef(false);

  const channelName = `video-call-${sessionId}`;

  // Send signaling message via Supabase Realtime
  const sendSignal = useCallback(
    (payload: SignalPayload) => {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'signal',
        payload,
      });
    },
    [],
  );

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const peerConnection: any = new RTCPeerConnection(ICE_SERVERS);

    peerConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        sendSignal({
          type: 'ice-candidate',
          candidate: event.candidate.toJSON(),
          from: userId,
        });
      }
    };

    peerConnection.ontrack = (event: any) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      setConnected(state === 'connected');
    };

    return peerConnection;
  }, [sendSignal, userId]);

  // Handle incoming signaling messages
  const handleSignal = useCallback(
    async (payload: SignalPayload) => {
      if (payload.from === userId) return; // Ignore own messages

      const peerConnection = pc.current;
      if (!peerConnection) return;

      if (payload.type === 'offer') {
        // Received an offer — set remote description and create answer
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription({ type: 'offer', sdp: payload.sdp }),
        );

        // Flush pending ICE candidates
        for (const candidate of pendingCandidates.current) {
          await peerConnection.addIceCandidate(candidate);
        }
        pendingCandidates.current = [];

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        sendSignal({
          type: 'answer',
          sdp: answer.sdp!,
          from: userId,
        });
      } else if (payload.type === 'answer') {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp: payload.sdp }),
        );

        // Flush pending ICE candidates
        for (const candidate of pendingCandidates.current) {
          await peerConnection.addIceCandidate(candidate);
        }
        pendingCandidates.current = [];
      } else if (payload.type === 'ice-candidate') {
        const candidate = new RTCIceCandidate(payload.candidate);
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(candidate);
        } else {
          pendingCandidates.current.push(candidate);
        }
      } else if (payload.type === 'hang-up') {
        // Remote peer hung up
        setRemoteStream(null);
        setConnected(false);
      }
    },
    [userId, sendSignal],
  );

  // Initialize everything
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Get local media stream
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: 'user', width: 640, height: 480 },
        });

        if (!mounted) {
          stream.getTracks().forEach((t: any) => t.stop());
          return;
        }
        setLocalStream(stream as unknown as MediaStream);

        // Create peer connection and add tracks
        const peerConnection = createPeerConnection();
        pc.current = peerConnection;

        (stream as unknown as MediaStream).getTracks().forEach((track: any) => {
          peerConnection.addTrack(track, stream as unknown as MediaStream);
        });

        // Subscribe to Supabase Realtime channel for signaling
        const channel = supabase.channel(channelName, {
          config: { broadcast: { self: false } },
        });

        channel
          .on('broadcast', { event: 'signal' }, ({ payload }) => {
            handleSignal(payload as SignalPayload);
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED' && mounted) {
              // Small delay to let both sides subscribe, then create offer
              // The "polite peer" pattern: both sides try to create offers,
              // but the one who receives an offer while making one will back off
              setTimeout(async () => {
                if (!mounted || !pc.current) return;
                try {
                  makingOffer.current = true;
                  const offer = await pc.current.createOffer({});
                  if (!mounted || !pc.current) return;
                  await pc.current.setLocalDescription(offer);
                  sendSignal({
                    type: 'offer',
                    sdp: offer.sdp!,
                    from: userId,
                  });
                } catch (err) {
                  console.warn('Error creating offer:', err);
                } finally {
                  makingOffer.current = false;
                }
              }, 1000);
            }
          });

        channelRef.current = channel;
      } catch (err) {
        console.error('WebRTC init error:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (cleanedUp.current) return;
    cleanedUp.current = true;

    sendSignal({ type: 'hang-up', from: userId });

    if (localStream) {
      localStream.getTracks().forEach((track: any) => track.stop());
    }
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [localStream, sendSignal, userId]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  }, [localStream]);

  const switchCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0] as any;
      if (videoTrack && videoTrack._switchCamera) {
        videoTrack._switchCamera();
        setIsFrontCamera((prev) => !prev);
      }
    }
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    connected,
    isMuted,
    isCameraOff,
    isFrontCamera,
    toggleMute,
    toggleCamera,
    switchCamera,
    cleanup,
  };
}
