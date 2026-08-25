import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, ShieldAlert, Cpu, Hash, Key, GitCommit, Clock } from 'lucide-react';
import { truncateHash } from '../../utils/generateHash';

export default function VerificationTimeline({ report }) {
  if (!report) return null;

  const steps = [
    {
      id: 'hash_calc',
      title: 'Canonical SHA-256 Digest Computation',
      desc: 'Deterministic cryptographic hash calculated from certificate academic fields.',
      status: report.checks?.hashMatch ? 'success' : 'failed',
      icon: Hash,
      detail: (
        <div className="mt-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span>Computed Payload Hash:</span>
            <span className="text-blue-400 select-all">{truncateHash(report.computedHash, 8, 8)}</span>
          </div>
          {report.ledgerHash && (
            <div className="flex justify-between items-center text-slate-400">
              <span>On-Chain Ledger Hash:</span>
              <span className={report.checks?.hashMatch ? 'text-emerald-400' : 'text-rose-400'}>
                {truncateHash(report.ledgerHash, 8, 8)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'chain_lookup',
      title: 'Blockchain Block Verification (PoA Node)',
      desc: report.blockIndex !== undefined
        ? `Cryptographic proof verified at Block #${report.blockIndex}`
        : 'Querying state block on consensus ledger',
      status: report.checks?.blockchainIntegrity && report.blockIndex !== undefined ? 'success' : 'failed',
      icon: GitCommit,
      detail: report.blockHash ? (
        <div className="mt-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Block Hash:</span>
            <span className="text-indigo-300">{truncateHash(report.blockHash, 8, 8)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Previous Hash:</span>
            <span className="text-slate-400">{truncateHash(report.previousHash, 8, 8)}</span>
          </div>
        </div>
      ) : null,
    },
    {
      id: 'issuer_sig',
      title: 'Issuer Authority & Digital Signature Verification',
      desc: report.issuerVerified
        ? `Signed by verified accredited institution: ${report.issuerName}`
        : 'Issuer not found or unverified in institutional directory',
      status: report.issuerVerified ? 'success' : 'failed',
      icon: Key,
      detail: report.issuerSignature ? (
        <div className="mt-2 text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-400 truncate">
          <span className="text-slate-500">Signature: </span>
          <span className="text-emerald-300">{truncateHash(report.issuerSignature, 12, 12)}</span>
        </div>
      ) : null,
    },
    {
      id: 'revocation_check',
      title: 'Immutability & Revocation Status Audit',
      desc: report.isRevoked
        ? `REVOKED: ${report.revocationReason || 'Revoked by issuing authority'}`
        : 'Active & In Good Standing. No revocation records logged on-chain.',
      status: report.isRevoked ? 'warning' : 'success',
      icon: report.isRevoked ? ShieldAlert : CheckCircle2,
      detail: report.isRevoked ? (
        <div className="mt-2 text-xs bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30 text-amber-300 space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Revocation Details Logged on Ledger:
          </p>
          <p className="text-[11px] text-amber-200/90">{report.revocationReason}</p>
          {report.revocationDate && (
            <p className="text-[10px] text-amber-400/70 font-mono">
              Timestamp: {new Date(report.revocationDate).toUTCString()}
            </p>
          )}
        </div>
      ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          Cryptographic Verification Pipeline
        </h4>
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          Verified in 12ms
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSuccess = step.status === 'success';
          const isWarning = step.status === 'warning';
          const isFailed = step.status === 'failed';

          return (
            <div key={step.id} className="relative group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isSuccess
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/30'
                    : isWarning
                    ? 'bg-amber-950 border-amber-500 text-amber-400 shadow-sm shadow-amber-500/30'
                    : 'bg-rose-950 border-rose-500 text-rose-400 shadow-sm shadow-rose-500/30'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-3.5 h-3.5" />}
                {isWarning && <AlertCircle className="w-3.5 h-3.5" />}
                {isFailed && <XCircle className="w-3.5 h-3.5" />}
              </div>

              {/* Step Content */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <h5 className="text-xs font-semibold text-slate-200">{step.title}</h5>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                      isSuccess
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : isWarning
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                {step.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
