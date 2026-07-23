import React, { useState } from 'react';
import { Wifi, Radio, Trash2, CheckCircle2, Server, Terminal } from 'lucide-react';
import { useEchoListener } from '../hooks/useEchoListener';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SoketiStatusCard: React.FC = () => {
  const [channel, setChannel] = useState<string>('notifications');
  const [event, setEvent] = useState<string>('.UserNotified');

  const { logs, isConnected, clearLogs } = useEchoListener(channel, event, 'public');

  const soketiHost = import.meta.env.VITE_SOKETI_HOST || '127.0.0.1';
  const soketiPort = import.meta.env.VITE_SOKETI_PORT || '6001';

  return (
    <Card className="w-full space-y-5 border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Soketi Realtime Channel
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active
              </span>
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              VPS Host: <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">{soketiHost}:{soketiPort}</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearLogs} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 font-medium mb-1">Channel Name</label>
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-medium mb-1">Event Name</label>
          <input
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1 text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Live Soketi Payload Log Stream ({logs.length})
          </span>
          <span className="text-slate-500">Listening on public channel</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <div className="py-6 text-center text-slate-600 italic">
              No websocket broadcasts received yet on "<span className="text-slate-400">{channel}</span>". Dispatch an event from Laravel to test live stream.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 border-b border-slate-800/60 pb-1">
                  <span className="text-indigo-400 font-bold">{log.event}</span>
                  <span>{log.timestamp}</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(log.payload, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
