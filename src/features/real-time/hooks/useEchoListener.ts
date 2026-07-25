import { useEffect, useState } from 'react';
import { echo } from '@/lib/echo';
import type { EchoEventLog, ChannelType } from '@/types';

// LOGIC: Custom hook lắng nghe sự kiện WebSocket Realtime Soketi không sử dụng `any`
export const useEchoListener = (
  channelName: string,
  eventName: string,
  type: ChannelType = 'public'
) => {
  const [logs, setLogs] = useState<EchoEventLog[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!channelName || !eventName) return;

    // LOGIC: Lắng nghe channel public, private hoặc presence dựa trên cấu hình
    const channelObj =
      type === 'private'
        ? echo.private(channelName)
        : type === 'presence'
          ? echo.join(channelName)
          : echo.channel(channelName);

    setIsConnected(true);

    const handleEvent = (data: unknown) => {
      const newLog: EchoEventLog = {
        id: Math.random().toString(36).substring(2, 9),
        channel: channelName,
        event: eventName,
        payload: data,
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
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
