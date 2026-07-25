import { useEffect, useRef } from 'react';
import { echo } from '@/lib/echo';

export interface UseRealtimeSyncOptions {
  channel: string;
  events: string[];
  isPrivate?: boolean;
  onEvent?: (eventName: string, payload: any) => void;
}

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

    let chObj: any;
    if (isPrivate) {
      chObj = echo.private(channel);
    } else {
      chObj = echo.channel(channel);
    }

    const listeners: { [event: string]: (data: any) => void } = {};

    parsedEvents.forEach((evt) => {
      const handler = (data: any) => {
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
