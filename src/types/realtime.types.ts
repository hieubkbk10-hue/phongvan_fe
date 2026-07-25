export interface EchoEventLog {
  id: string;
  channel: string;
  event: string;
  payload: unknown;
  timestamp: string;
}

export type ChannelType = 'public' | 'private' | 'presence';

export interface UseRealtimeSyncOptions {
  channel: string;
  events: string[];
  isPrivate?: boolean;
  onEvent?: (eventName: string, payload: unknown) => void;
}
