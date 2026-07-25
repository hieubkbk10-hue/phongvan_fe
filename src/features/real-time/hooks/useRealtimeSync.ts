import { useEffect, useRef } from 'react';
import { echo } from '@/lib/echo';
import type { UseRealtimeSyncOptions } from '@/types';

// LOGIC: Đồng bộ hóa dữ liệu Realtime WebSocket giữa Backend và React Client không sử dụng `any`
export const useRealtimeSync = ({
  channel,
  events,
  isPrivate = false,
  onEvent,
}: UseRealtimeSyncOptions) => {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const serializedEvents = JSON.stringify(events);

  useEffect(() => {
    const parsedEvents: string[] = JSON.parse(serializedEvents);
    if (!channel || !parsedEvents || parsedEvents.length === 0) return;

    const chObj = isPrivate ? echo.private(channel) : echo.channel(channel);
    const listeners: Record<string, (data: unknown) => void> = {};

    parsedEvents.forEach((evt) => {
      const handler = (data: unknown) => {
        if (onEventRef.current) {
          onEventRef.current(evt, data);
        }
      };
      listeners[evt] = handler;
      chObj.listen(evt, handler);
    });

    return () => {
      parsedEvents.forEach((evt) => {
        if (listeners[evt]) {
          chObj.stopListening(evt, listeners[evt]);
        }
      });
      if (isPrivate) {
        echo.leave(`private-${channel}`);
      } else {
        echo.leave(channel);
      }
    };
  }, [channel, serializedEvents, isPrivate]);
};
