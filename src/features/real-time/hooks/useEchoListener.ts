import { useEffect, useState } from 'react';
import { echo } from '@/lib/echo';

export interface EchoEventLog {
  id: string;
  channel: string;
  event: string;
  payload: any;
  timestamp: string;
}

export type ChannelType = 'public' | 'private' | 'presence';

export const useEchoListener = (
  channelName: string,
  eventName: string,
  type: ChannelType = 'public'
) => {
  const [logs, setLogs] = useState<EchoEventLog[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!channelName || !eventName) return;

    let channelObj: any;

    if (type === 'private') {
      channelObj = echo.private(channelName);
    } else if (type === 'presence') {
      channelObj = echo.join(channelName);
    } else {
      channelObj = echo.channel(channelName);
    }

    setIsConnected(true);

    const handleEvent = (data: any) => {
      const newLog: EchoEventLog = {
        id: Math.random().toString(36).substring(2, 9),
        channel: channelName,
        event: eventName,
        payload: data,
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep last 50 events
    };

    channelObj.listen(eventName, handleEvent);

    return () => {
      channelObj.stopListening(eventName, handleEvent);
      if (type === 'private') {
        echo.leave(`private-${channelName}`);
      } else if (type === 'presence') {
        echo.leave(`presence-${channelName}`);
      } else {
        echo.leave(channelName);
      }
      setIsConnected(false);
    };
  }, [channelName, eventName, type]);

  const clearLogs = () => setLogs([]);

  return { logs, isConnected, clearLogs };
};
