import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

const TOAST_CONFIG: Record<ToastType, { bg: string; icon: string; iconColor: string }> = {
  success: { bg: '#E8F5E9', icon: 'checkmark-circle', iconColor: '#4CAF50' },
  error:   { bg: '#FFEBEE', icon: 'alert-circle',     iconColor: '#F44336' },
  info:    { bg: '#EEF0FF', icon: 'information-circle', iconColor: '#6C63FF' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });
  const translateY = useRef(new Animated.Value(-120)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setToast({ visible: true, message, type });

    // Slide in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();

    // Auto dismiss after 3s
    timeoutRef.current = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setToast(prev => ({ ...prev, visible: false })));
    }, 3000);
  }, []);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setToast(prev => ({ ...prev, visible: false })));
  }, []);

  const config = TOAST_CONFIG[toast.type];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            s.container,
            { backgroundColor: config.bg, top: insets.top + 10, transform: [{ translateY }] },
          ]}
        >
          <TouchableOpacity style={s.inner} onPress={dismiss} activeOpacity={0.9}>
            <Ionicons name={config.icon as any} size={22} color={config.iconColor} />
            <Text style={[s.message, { color: config.iconColor }]} numberOfLines={2}>
              {toast.message}
            </Text>
            <Ionicons name="close" size={18} color={config.iconColor} style={{ opacity: 0.6 }} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 16,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
