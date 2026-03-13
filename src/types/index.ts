export type UserRole = 'client' | 'psychiatrist' | 'admin';

export type AuthMode = 'anonymous' | 'google' | 'email';

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  role: UserRole;
  isAnonymous: boolean;
  alias?: string;
  createdAt: string;
}

export interface Psychiatrist {
  id: string;
  userId: string;
  fullName: string;
  licenseNumber: string;
  licenseImageUrl: string;
  specialization: string;
  experience: number;
  bio: string;
  isApproved: boolean;
  isOnline: boolean;
  rating: number;
  totalSessions: number;
  createdAt: string;
}

export interface Session {
  id: string;
  clientId: string;
  psychiatristId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  type: 'chat' | 'video';
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}