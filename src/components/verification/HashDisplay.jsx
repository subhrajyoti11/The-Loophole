import React, { useState } from 'react';
import { Copy, Check, Hash, ExternalLink } from 'lucide-react';
import { truncateHash } from '../../utils/generateHash';

export default function HashDisplay({
  hash,
  label = 'SHA-256 Digest',
  truncate = false,
  copyable = true,
  className = '',
  highlight = false,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hash) return null;

  const displayText = truncate ? truncateHash(hash, 10, 10) : hash;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-[11px] font-mono font-medium text-slate-400 flex items-center gap-1.5">
          <Hash className="w-3 h-3 text-blue-400" />
          {label}
        </span>
      )}
      <div
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl font-mono text-xs border transition-all ${
          highlight
            ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-sm shadow-blue-500/10'
            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
        }`}
      >
        <span className="truncate select-all tracking-wider text-[11px]">{displayText}</span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy cryptographic hash"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
