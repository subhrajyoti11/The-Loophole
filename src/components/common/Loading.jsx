import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Loading({ message = 'Verifying cryptographic blocks...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        <div className="w-10 h-10 rounded-xl border-2 border-indigo-500/20 border-b-indigo-500 animate-spin-slow absolute" />
        <ShieldCheck className="w-6 h-6 text-blue-400 absolute animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-slate-200 font-medium text-sm tracking-wide">{message}</p>
        <p className="text-slate-500 text-xs mt-1 font-mono">Querying PoA Ledger Node...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
