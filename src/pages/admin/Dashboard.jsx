import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Building2,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Server,
} from 'lucide-react';
import { useCredentials } from '../../context/CredentialContext';
import Button from '../../components/common/Button';
import { truncateHash } from '../../utils/generateHash';

export default function AdminDashboard() {
  const { blockchain, institutions, credentials, verificationLogs, chainHealth, checkBlockchainIntegrity } = useCredentials();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleRunIntegrityCheck = () => {
    setIsScanning(true);
    setTimeout(() => {
      const result = checkBlockchainIntegrity();
      setScanResult(result);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
              SUPER AUTHORITY NODE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Consensus: Proof of Authority (PoA) / SHA-256
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Blockchain Consensus & Ledger Administration
          </h1>
          <p className="text-xs text-slate-300">
            Node: <span className="font-mono text-indigo-300">node-auth-01.edutrust.gov.in</span> • Status: <span className="text-emerald-400 font-bold">SYNCHRONIZED (100% HEALTHY)</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Activity}
            isLoading={isScanning}
            onClick={handleRunIntegrityCheck}
          >
            Audit Chain Integrity
          </Button>
        </div>
      </div>

      {/* Audit Banner Result if Run */}
      {scanResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between animate-in fade-in duration-200 ${
            scanResult.isValid
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {scanResult.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>
              {scanResult.isValid
                ? `✓ Cryptographic Audit Passed: All ${blockchain.length} blocks verified with 0 broken pointers or hash mismatches.`
                : `✖ Audit Failure: ${scanResult.error}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setScanResult(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Block Height</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">#{blockchain.length}</p>
          <span className="text-[11px] text-emerald-400 font-mono">Genesis to Present</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Accredited Nodes</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-blue-400">{institutions.length}</p>
          <span className="text-[11px] text-slate-400 font-mono">100% Verified Issuers</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Minted Credentials</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-400">{credentials.length}</p>
          <span className="text-[11px] text-slate-400 font-mono">Immutable Hash Records</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Total Queries</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-amber-300">{verificationLogs.length}</p>
          <span className="text-[11px] text-slate-400 font-mono">Public Verifications</span>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Blockchain Explorer */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all group">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              Visual Blockchain Explorer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect each individual block from Genesis Block #0 onwards. Inspect previous hash pointers, merkle roots, proof nonces, and raw payloads.
            </p>
          </div>

          <Link to="/admin/ledger">
            <Button variant="secondary" size="sm" icon={ArrowRight} className="w-full">
              Open Visual Block Explorer
            </Button>
          </Link>
        </div>

        {/* Card 2: Institution Registry */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              Accredited Institutions Directory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage participating universities, IITs, NITs, and State Boards. View public keys, accreditation numbers, and active issuance statistics.
            </p>
          </div>

          <Link to="/admin/institutions">
            <Button variant="secondary" size="sm" icon={ArrowRight} className="w-full">
              View Institutions Registry
            </Button>
          </Link>
        </div>

      </div>

      {/* Latest Blocks Peek */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            Latest Blocks Added to Chain
          </h3>

          <Link to="/admin/ledger" className="text-xs text-indigo-400 hover:text-indigo-300 font-mono">
            View All Blocks →
          </Link>
        </div>

        <div className="space-y-2">
          {blockchain.slice(-4).reverse().map((block) => (
            <div
              key={block.index}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                  Block #{block.index}
                </span>
                <span className="text-slate-300 font-sans font-semibold">
                  {block.transactionType} ({block.credentialId})
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>Hash: <span className="text-blue-400 select-all">{truncateHash(block.hash, 6, 6)}</span></span>
                <span>Prev: <span className="text-slate-500 select-all">{truncateHash(block.previousHash, 6, 6)}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
