import React, { useState } from 'react';
import { Copy, Check, Hash } from 'lucide-react';
import { truncateHash } from '../../utils/generateHash';
import { useToast } from '../../context/ToastContext';

export default function HashDisplay({
  hash,
  label = 'SHA-256 Digest',
  truncate = false,
  copyable = true,
  className = '',
  highlight = false,
}) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    addToast('Cryptographic hash copied to clipboard', 'success', 2000);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hash) return null;

  const displayText = truncate ? truncateHash(hash, 10, 10) : hash;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-[10px] font-mono uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1.5">
          <Hash className="w-3 h-3 text-primary-400" />
          {label}
        </span>
      )}
      <div
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl font-mono text-xs border transition-all ${
          highlight
            ? 'bg-primary-950/40 border-primary-500/50 text-primary-300 shadow-sm shadow-primary-500/10'
            : 'bg-canvas-subtle border-slate-800 text-slate-300 hover:border-slate-700'
        }`}
      >
        <span className="truncate select-all tracking-wider text-[11px] font-mono">{displayText}</span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy cryptographic hash"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

