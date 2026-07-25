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

  useEffect(() => {
    if (!channel || !events || events.length === 0) return;

    let chObj: any;
    if (isPrivate) {
      chObj = echo.private(channel);
    } else {
      chObj = echo.channel(channel);
    }

    const listeners: { [event: string]: (data: any) => void } = {};

    events.forEach((evt) => {
      const handler = (data: any) => {
        if (onEventRef.current) {
          onEventRef.current(evt, data);
        }
      };
      listeners[evt] = handler;
      chObj.listen(evt, handler);
    });

    return () => {
      events.forEach((evt) => {
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
  }, [channel, JSON.stringify(events), isPrivate]);
};
