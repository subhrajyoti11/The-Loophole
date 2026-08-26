import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function StatusBadge({ status, size = 'md', showIcon = true, className = '' }) {
  const configs = {
    [CREDENTIAL_STATUS.VALID]: {
      label: 'Cryptographically Verified',
      shortLabel: 'Valid',
      bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/10',
      dot: 'bg-emerald-400',
      ring: 'bg-emerald-400/30',
      icon: CheckCircle2,
    },
    [CREDENTIAL_STATUS.TAMPERED]: {
      label: 'Fraud / Tamper Detected',
      shortLabel: 'Tampered',
      bg: 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/10',
      dot: 'bg-rose-400',
      ring: 'bg-rose-400/30',
      icon: XCircle,
    },
    [CREDENTIAL_STATUS.REVOKED]: {
      label: 'Degree Revoked on Chain',
      shortLabel: 'Revoked',
      bg: 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10',
      dot: 'bg-amber-400',
      ring: 'bg-amber-400/30',
      icon: AlertTriangle,
    },
    [CREDENTIAL_STATUS.PENDING]: {
      label: 'Pending Block Minting',
      shortLabel: 'Pending',
      bg: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-500/10',
      dot: 'bg-indigo-400',
      ring: 'bg-indigo-400/30',
      icon: Clock,
    },
  };

  const config = configs[status] || configs[CREDENTIAL_STATUS.VALID];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-2 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-mono tracking-tight select-none ${config.bg} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.ring}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{size === 'sm' ? config.shortLabel : config.label}</span>
    </span>
  );
}

