import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const configs = {
    [CREDENTIAL_STATUS.VALID]: {
      label: 'VERIFIED & AUTHENTIC',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400 shadow-emerald-500/50',
      icon: CheckCircle2,
    },
    [CREDENTIAL_STATUS.TAMPERED]: {
      label: 'TAMPER DETECTED',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400 shadow-rose-500/50',
      icon: XCircle,
    },
    [CREDENTIAL_STATUS.REVOKED]: {
      label: 'REVOKED',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400 shadow-amber-500/50',
      icon: AlertTriangle,
    },
    [CREDENTIAL_STATUS.PENDING]: {
      label: 'PENDING MINING',
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400 shadow-blue-500/50',
      icon: Clock,
    },
  };

  const config = configs[status] || configs[CREDENTIAL_STATUS.VALID];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-3 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm font-mono uppercase tracking-wider backdrop-blur-md ${config.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shadow-sm animate-pulse`} />
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
}
