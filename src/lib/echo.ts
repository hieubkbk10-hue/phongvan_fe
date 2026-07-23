import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

(window as any).Pusher = Pusher;

const isSecure = env.SOKETI_SCHEME === 'https';

export const echo = new Echo({
  broadcaster: 'pusher',
  key: env.SOKETI_APP_KEY,
  wsHost: env.SOKETI_HOST,
  wsPort: Number(env.SOKETI_PORT),
  wssPort: Number(env.SOKETI_PORT),
  forceTLS: isSecure,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  cluster: env.SOKETI_CLUSTER,
  authEndpoint: `${env.API_URL}/broadcasting/auth`,
  authorizer: (channel: any) => {
    return {
      authorize: (socketId: string, callback: (error: any, data?: any) => void) => {
        const token = useAuthStore.getState().token;
        fetch(`${env.API_URL}/broadcasting/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((response) => response.json())
          .then((data) => callback(null, data))
          .catch((error) => callback(error));
      },
    };
  },
});
