import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Hash,
  AlertTriangle,
  Layers,
  ArrowRight,
  Edit3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Cpu,
  Lock,
  Unlock,
} from 'lucide-react';
import { useCredentials } from '../../context/CredentialContext';
import { generateCredentialHash, truncateHash } from '../../utils/generateHash';
import Button from '../../components/common/Button';
import HashDisplay from '../../components/verification/HashDisplay';
import StatusBadge from '../../components/common/StatusBadge';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function TamperDemo() {
  const [searchParams] = useSearchParams();
  const { credentials, blockchain } = useCredentials();

  const [selectedCredId, setSelectedCredId] = useState(
    searchParams.get('id') || credentials[0]?.id || 'CRD-2025-IITB-1001'
  );

  const [originalCred, setOriginalCred] = useState(null);
  const [tamperedCred, setTamperedCred] = useState(null);
  const [computedTamperedHash, setComputedTamperedHash] = useState('');

  // When selected credential changes, sync both original and editable clone
  useEffect(() => {
    const found = credentials.find((c) => c.id === selectedCredId) || credentials[0];
    if (found) {
      setOriginalCred({ ...found });
      setTamperedCred({ ...found });
    }
  }, [selectedCredId, credentials]);

  // Recalculate hash of tampered credential dynamically
  useEffect(() => {
    if (tamperedCred) {
      const newHash = generateCredentialHash(tamperedCred);
      setComputedTamperedHash(newHash);
    }
  }, [tamperedCred]);

  if (!originalCred || !tamperedCred) return null;

  const isTampered = computedTamperedHash !== originalCred.hash;

  const handleFieldChange = (field, value) => {
    setTamperedCred((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetToOriginal = () => {
    setTamperedCred({ ...originalCred });
  };

  const simulateQuickHack = (type) => {
    if (type === 'cgpa') {
      handleFieldChange('cgpa', '9.98');
    } else if (type === 'name') {
      handleFieldChange('studentName', `${originalCred.studentName} (Forged)`);
    } else if (type === 'degree') {
      handleFieldChange('degree', 'Doctor of Philosophy (Ph.D) in Artificial Intelligence');
    }
  };

  // Find block in blockchain
  const onChainBlock = blockchain.find((b) => b.credentialId === originalCred.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Hackathon Demo | Live Tamper Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Real-Time Cryptographic Tamper Detection
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          See how SHA-256 hash chaining guarantees academic integrity. Even changing a single character or digit immediately breaks mathematical hash consistency and is rejected by the blockchain.
        </p>
      </div>

      {/* Select Credential Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="font-semibold text-slate-400 uppercase font-mono">Select Test Credential:</span>
          <select
            value={selectedCredId}
            onChange={(e) => setSelectedCredId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono font-semibold focus:outline-none"
          >
            {credentials.map((c) => (
              <option key={c.id} value={c.id}>
                {c.studentName} — {c.id} (CGPA: {c.cgpa})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={RotateCcw}
            onClick={resetToOriginal}
            disabled={!isTampered}
          >
            Reset to Original Truth
          </Button>
        </div>
      </div>

      {/* Live Verdict Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-2xl transition-all duration-300 ${
          isTampered
            ? 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/40 border-rose-500/50 shadow-rose-500/10'
            : 'bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-950/30 border-emerald-500/40 shadow-emerald-500/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform ${
                isTampered
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isTampered ? <XCircle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={isTampered ? CREDENTIAL_STATUS.TAMPERED : CREDENTIAL_STATUS.VALID}
                  size="md"
                />
                <span className="text-xs font-mono text-slate-400">
                  PoA Block #{onChainBlock?.index ?? 1}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {isTampered
                  ? 'FRAUD DETECTED — Cryptographic Hash Mismatch!'
                  : 'VALID & AUTHENTIC — Hash Matches Blockchain Ledger Perfectly'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isTampered
                  ? 'The academic record presented was modified after issuance. The calculated hash diverged from the immutable on-chain record.'
                  : 'Every academic parameter matches the immutable state stored on the blockchain block.'}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Ledger Status</span>
            <span
              className={`font-mono text-sm font-bold ${
                isTampered ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isTampered ? '❌ REJECTED ON VERIFY' : '✅ 100% MATHEMATICALLY VERIFIED'}
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Original Immutable Ledger Truth */}
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Original On-Chain Record</h3>
                <p className="text-[10px] font-mono text-emerald-400">Sealed in Block #{onChainBlock?.index ?? 1}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              IMMUTABLE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] block">Student Name:</span>
                <span className="font-semibold text-slate-100">{originalCred.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Roll No / Student ID:</span>
                <span className="font-mono text-blue-400 font-semibold">{originalCred.studentId}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Degree Awarded:</span>
                <span className="font-semibold text-slate-200">{originalCred.degree}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Branch / Major:</span>
                <span className="text-slate-300">{originalCred.major}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                <span className="text-slate-400 text-[11px]">Cumulative GPA:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{originalCred.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Issuing University:</span>
                <span className="text-slate-300 font-medium">{originalCred.institutionName}</span>
              </div>
            </div>

            {/* Original Ledger Hash */}
            <div className="pt-2">
              <HashDisplay
                hash={originalCred.hash}
                label="Immutable On-Chain Hash (Stored in Block Header)"
                truncate={false}
                highlight={true}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Live Tampering Simulator */}
        <div
          className={`p-6 rounded-3xl glass-panel border transition-all space-y-4 ${
            isTampered ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isTampered ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {isTampered ? <Unlock className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Live Modifiable Fields</h3>
                <p className="text-[10px] text-slate-400">Edit any field below to trigger real-time hash divergence</p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isTampered
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isTampered ? 'TAMPERED STATE' : 'UNTOUCHED'}
            </span>
          </div>

          {/* Quick Hack Preset Shortcuts */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[11px] text-slate-400 py-1">Quick Tamper Tests:</span>
            <button
              type="button"
              onClick={() => simulateQuickHack('cgpa')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] transition-colors"
            >
              📈 Fake CGPA to 9.98
            </button>
            <button
              type="button"
              onClick={() => simulateQuickHack('name')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] transition-colors"
            >
              👤 Change Name
            </button>
            <button
              type="button"
              onClick={() => simulateQuickHack('degree')}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] transition-colors"
            >
              🎓 Upgrade to Ph.D
            </button>
          </div>

          {/* Editable Form Inputs */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Student Name:
              </label>
              <input
                type="text"
                value={tamperedCred.studentName}
                onChange={(e) => handleFieldChange('studentName', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs text-slate-100 glass-input font-medium focus:outline-none transition-all ${
                  tamperedCred.studentName !== originalCred.studentName
                    ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                    : ''
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Student ID:
                </label>
                <input
                  type="text"
                  value={tamperedCred.studentId}
                  onChange={(e) => handleFieldChange('studentId', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-slate-100 glass-input focus:outline-none transition-all ${
                    tamperedCred.studentId !== originalCred.studentId
                      ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                      : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  CGPA / Marks:
                </label>
                <input
                  type="text"
                  value={tamperedCred.cgpa}
                  onChange={(e) => handleFieldChange('cgpa', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-100 glass-input focus:outline-none transition-all ${
                    tamperedCred.cgpa !== originalCred.cgpa
                      ? 'border-rose-500 text-rose-300 bg-rose-950/30'
                      : 'text-emerald-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Degree Title:
              </label>
              <input
                type="text"
                value={tamperedCred.degree}
                onChange={(e) => handleFieldChange('degree', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs text-slate-100 glass-input focus:outline-none transition-all ${
                  tamperedCred.degree !== originalCred.degree
                    ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                    : ''
                }`}
              />
            </div>

            {/* Recalculated Hash Output */}
            <div className="pt-2">
              <span className="text-[11px] font-mono font-medium text-slate-400 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Live Recalculated SHA-256 Hash
              </span>
              <div
                className={`p-3 rounded-xl font-mono text-xs border break-all transition-all ${
                  isTampered
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-500/20'
                    : 'bg-slate-900/90 border-slate-800 text-emerald-400'
                }`}
              >
                {computedTamperedHash}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Cryptographic Hash Comparison & Explanation Box */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-400" />
          Mathematical Hash Diff Inspection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">BLOCKCHAIN LEDGER HASH (BLOCK #{onChainBlock?.index ?? 1})</span>
            <span className="text-emerald-400 font-bold select-all">{originalCred.hash}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">RECALCULATED PRESENTED HASH</span>
            <span className={isTampered ? 'text-rose-400 font-bold select-all' : 'text-emerald-400 font-bold select-all'}>
              {computedTamperedHash}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-200 mb-1">
            💡 Why this matters for the SIH Jury & Recruiters:
          </p>
          <p className="text-slate-400 text-[11px]">
            Because SHA-256 produces an avalanche effect, changing even 1 bit of data alters more than 50% of the entire output string. Since the original hash was cryptographically minted into a permanent block header signed by {originalCred.institutionName}, an attacker cannot forge credentials without computing an impossible reverse preimage collision.
          </p>
        </div>
      </div>

    </div>
  );
}
