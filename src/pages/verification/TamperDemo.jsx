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
  Activity,
  Terminal
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

  // Compute character differences for Avalanche Effect
  const originalHash = originalCred.hash || '';
  const currentHash = computedTamperedHash || '';
  let diffCount = 0;
  for (let i = 0; i < Math.max(originalHash.length, currentHash.length); i++) {
    if (originalHash[i] !== currentHash[i]) {
      diffCount++;
    }
  }
  const mutationPercentage = originalHash.length > 0 ? Math.round((diffCount / originalHash.length) * 100) : 0;

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
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Cryptographic Laboratory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SHA-256 Avalanche Effect & Tamper Detection
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Experience mathematical immutability in real time. Mutating even a single bit or character triggers catastrophic hash divergence, instantly flagged by the blockchain node.
        </p>
      </div>

      {/* Select Credential Bar */}
      <div className="p-4 rounded-2xl bg-canvas-panel border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-tactile">
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <span className="font-semibold text-slate-400 uppercase font-mono text-[10px]">Test Subject:</span>
          <select
            value={selectedCredId}
            onChange={(e) => setSelectedCredId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-canvas-subtle border border-slate-700/80 text-slate-100 text-xs font-mono font-semibold focus:outline-none cursor-pointer"
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
            Revert to Original State
          </Button>
        </div>
      </div>

      {/* Live Verdict Banner with Avalanche Effect Gauge */}
      <div
        className={`p-6 rounded-3xl border transition-all duration-300 shadow-tactile ${
          isTampered
            ? 'bg-canvas-panel border-rose-500/50'
            : 'bg-canvas-panel border-emerald-500/40'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform ${
                isTampered
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isTampered ? <XCircle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={isTampered ? CREDENTIAL_STATUS.TAMPERED : CREDENTIAL_STATUS.VALID}
                  size="md"
                />
                <span className="text-xs font-mono text-slate-400">
                  PoA Ledger Block #{onChainBlock?.index ?? 1}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {isTampered
                  ? 'FORGERY DETECTED — Cryptographic Signature Broken'
                  : 'VALID & AUTHENTIC — Hash Matches Sealed Block Header'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isTampered
                  ? 'Academic payload fields have been modified after block seal. Digest cannot be verified against issuer public key.'
                  : 'Canonical payload hash perfectly reconciles with on-chain cryptographic state.'}
              </p>
            </div>
          </div>

          {/* Avalanche Effect Metric Badge */}
          <div className="flex items-center gap-4 bg-canvas-subtle p-3 rounded-2xl border border-slate-800 font-mono text-xs w-full lg:w-auto justify-between lg:justify-start">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Hash Mutation Rate</span>
              <span className={`text-base font-bold ${isTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isTampered ? `${mutationPercentage}% Divergence` : '0% (Exact Match)'}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Mismatched Chars</span>
              <span className={`text-base font-bold ${isTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                {diffCount} / 64 Hex
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Original Immutable Ledger Truth */}
        <div className="p-6 rounded-3xl bg-canvas-panel border border-emerald-500/30 space-y-4 shadow-tactile">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase font-mono text-slate-100">Original On-Chain Record</h3>
                <p className="text-[10px] font-mono text-emerald-400">Sealed in Block #{onChainBlock?.index ?? 1}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-canvas-subtle px-2 py-0.5 rounded border border-slate-800">
              IMMUTABLE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-canvas-subtle border border-slate-800 space-y-2">
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">Student Full Name:</span>
                <span className="font-semibold text-slate-100">{originalCred.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">University Roll Number:</span>
                <span className="font-mono text-primary-300 font-semibold">{originalCred.studentId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">Conferred Degree:</span>
                <span className="font-semibold text-slate-200">{originalCred.degree}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">Branch / Specialization:</span>
                <span className="text-slate-300">{originalCred.major}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono uppercase">Cumulative GPA:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{originalCred.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px] font-mono uppercase">Issuing Node:</span>
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
          className={`p-6 rounded-3xl bg-canvas-panel border transition-all space-y-4 shadow-tactile ${
            isTampered ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isTampered ? 'bg-rose-500/20 text-rose-400' : 'bg-primary-500/20 text-primary-400'
                }`}
              >
                {isTampered ? <Unlock className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase font-mono text-slate-100">Live Modifiable Fields</h3>
                <p className="text-[10px] text-slate-400 font-mono">Edit any field below to watch the SHA-256 cascade</p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isTampered
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-canvas-subtle text-slate-400 border border-slate-800'
              }`}
            >
              {isTampered ? 'MUTATED STATE' : 'UNTOUCHED'}
            </span>
          </div>

          {/* Quick Hack Preset Shortcuts */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[11px] font-mono text-slate-500 py-1">Quick Tamper:</span>
            <button
              type="button"
              onClick={() => simulateQuickHack('cgpa')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] font-mono transition-colors cursor-pointer"
            >
              📈 Fake CGPA to 9.98
            </button>
            <button
              type="button"
              onClick={() => simulateQuickHack('name')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] font-mono transition-colors cursor-pointer"
            >
              👤 Alter Name
            </button>
            <button
              type="button"
              onClick={() => simulateQuickHack('degree')}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-mono transition-colors cursor-pointer"
            >
              🎓 Upgrade to Ph.D
            </button>
          </div>

          {/* Editable Form Inputs */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] uppercase font-mono font-medium text-slate-400 mb-1">
                Student Name:
              </label>
              <input
                type="text"
                value={tamperedCred.studentName}
                onChange={(e) => handleFieldChange('studentName', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs text-slate-100 tactile-input font-medium focus:outline-none transition-all ${
                  tamperedCred.studentName !== originalCred.studentName
                    ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                    : ''
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-mono font-medium text-slate-400 mb-1">
                  Student ID / Roll No:
                </label>
                <input
                  type="text"
                  value={tamperedCred.studentId}
                  onChange={(e) => handleFieldChange('studentId', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-slate-100 tactile-input focus:outline-none transition-all ${
                    tamperedCred.studentId !== originalCred.studentId
                      ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                      : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-medium text-slate-400 mb-1">
                  CGPA / Marks:
                </label>
                <input
                  type="text"
                  value={tamperedCred.cgpa}
                  onChange={(e) => handleFieldChange('cgpa', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-100 tactile-input focus:outline-none transition-all ${
                    tamperedCred.cgpa !== originalCred.cgpa
                      ? 'border-rose-500 text-rose-300 bg-rose-950/30'
                      : 'text-emerald-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono font-medium text-slate-400 mb-1">
                Degree Awarded:
              </label>
              <input
                type="text"
                value={tamperedCred.degree}
                onChange={(e) => handleFieldChange('degree', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs text-slate-100 tactile-input focus:outline-none transition-all ${
                  tamperedCred.degree !== originalCred.degree
                    ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                    : ''
                }`}
              />
            </div>

            {/* Recalculated Hash Output with Highlighted Diff */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-primary-400" />
                Live SHA-256 Digest of Modified Record
              </span>
              <div
                className={`p-3 rounded-xl font-mono text-xs border break-all transition-all ${
                  isTampered
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-tactile'
                    : 'bg-canvas-subtle border-slate-800 text-emerald-400'
                }`}
              >
                {computedTamperedHash}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Cryptographic Bit Diff Inspector */}
      <div className="p-6 rounded-3xl bg-canvas-panel border border-slate-800 space-y-4 shadow-tactile">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary-400" />
          Hex Character Hash Comparison Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-canvas-subtle border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">BLOCKCHAIN LEDGER TRUTH (BLOCK #{onChainBlock?.index ?? 1})</span>
            <span className="text-emerald-400 font-bold select-all">{originalCred.hash}</span>
          </div>

          <div className="p-4 rounded-xl bg-canvas-subtle border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">RECALCULATED PRESENTED HASH</span>
            <span className={isTampered ? 'text-rose-400 font-bold select-all' : 'text-emerald-400 font-bold select-all'}>
              {computedTamperedHash}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-canvas-subtle border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5 font-mono text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-primary-400" />
            Cryptographic Guarantee (SHA-256 Preimage Resistance):
          </p>
          <p className="text-slate-400 text-xs">
            Because SHA-256 enforces the <em>Avalanche Effect</em>, modifying even one single character flips ~50% of the output bits across the entire 256-bit string. Because the true hash is sealed inside the immutable block header signed by {originalCred.institutionName}, any fraudulent modification produces a catastrophic hash mismatch that no attacker can forge without finding an astronomically impossible SHA-256 collision ($2^{256}$ operations).
          </p>
        </div>
      </div>

    </div>
  );
}

