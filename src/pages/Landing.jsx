import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  Award,
  Zap,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  School,
  Building2,
  Cpu,
  Key,
  Database,
  QrCode as QrIcon,
  ChevronRight,
  Terminal,
  FileCheck
} from 'lucide-react';
import Button from '../components/common/Button';
import { useCredentials } from '../context/CredentialContext';
import { truncateHash } from '../utils/generateHash';
import HashDisplay from '../components/verification/HashDisplay';

export default function Landing() {
  const { credentials, blockchain, institutions } = useCredentials();
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');
  const [activeTab, setActiveTab] = useState('demo');

  const sampleQuickVerifies = credentials.slice(0, 4);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    navigate(`/verify/${encodeURIComponent(quickInput.trim())}`);
  };

  return (
    <div className="space-y-24 py-4 sm:py-8">
      
      {/* HERO SECTION WITH INTERACTIVE VERIFICATION CONSOLE */}
      <section className="relative max-w-6xl mx-auto space-y-8 pt-4 sm:pt-8">
        
        {/* Top Product Tagline */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-tight">Enterprise Cryptographic Ledger • PoA Consensus Active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Mathematical Trust for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-200 to-cyan-300">
              Academic Credentials
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Eliminate document forgery, degree mills, and slow background verification. Universities issue cryptographically signed, immutable digital credentials that employers verify in under 15ms.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/verify">
              <Button size="lg" variant="primary" icon={Search} className="px-6">
                Launch Public Scanner
              </Button>
            </Link>
            <Link to="/tamper-demo">
              <Button size="lg" variant="warning" icon={Sparkles} className="px-6">
                Live Tamper Playground
              </Button>
            </Link>
            <Link to="/institution/dashboard">
              <Button size="lg" variant="secondary" icon={School} className="px-5">
                University Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* HERO INTERACTIVE CONSOLE BOX */}
        <div className="relative max-w-3xl mx-auto rounded-2xl bg-canvas-panel border border-slate-700/80 shadow-2xl p-4 sm:p-6 space-y-4">
          
          {/* Console Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Terminal className="w-4 h-4 text-primary-400" />
              <span className="font-bold">Instant Credential Validator</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PoA Consensus Ready</span>
            </div>
          </div>

          {/* Quick Input Bar */}
          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter Certificate ID, SHA-256 Digest, or Roll No..."
                className="w-full pl-3.5 pr-4 py-2.5 rounded-xl tactile-input text-xs font-mono text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <Button
              type="submit"
              size="md"
              variant="primary"
              icon={Search}
              className="px-5"
            >
              Verify
            </Button>
          </form>

          {/* Quick Sample Test Records */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Or Click a Pre-Seeded Ledger Record to Test:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleQuickVerifies.map((c) => (
                <Link
                  key={c.id}
                  to={`/verify/${c.id}`}
                  className="p-2.5 rounded-xl bg-canvas-subtle hover:bg-canvas-raised border border-slate-800 hover:border-primary-500/50 transition-all flex items-center justify-between group shadow-tactile"
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-xs text-slate-100 group-hover:text-primary-300 transition-colors truncate">
                        {c.studentName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">({c.degree.split(' ')[0]})</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 truncate">
                      {c.id} • CGPA: {c.cgpa}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* LIVE CONSENSUS NETWORK TELEMETRY HUD */}
      <section className="max-w-6xl mx-auto">
        <div className="p-1 rounded-3xl bg-slate-800/40 border border-slate-800 shadow-tactile">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3">
            
            <div className="p-4 rounded-2xl bg-canvas-panel border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="uppercase">Ledger Height</span>
                <Layers className="w-4 h-4 text-primary-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">
                #{blockchain.length} Blocks
              </p>
              <span className="text-[10px] text-emerald-400 font-mono mt-1">100% Deterministic Continuity</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-panel border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="uppercase">Minted Credentials</span>
                <Award className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">
                {credentials.length} Records
              </p>
              <span className="text-[10px] text-primary-300 font-mono mt-1">Ed25519 Cryptographically Signed</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-panel border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="uppercase">Accredited Nodes</span>
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">
                {institutions.length} Universities
              </p>
              <span className="text-[10px] text-emerald-400 font-mono mt-1">Public Key Infrastructure</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-panel border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="uppercase">Query Latency</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 mt-2">
                &lt; 12ms
              </p>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Instant Hash Verification</span>
            </div>

          </div>
        </div>
      </section>

      {/* END-TO-END CRYPTOGRAPHIC PIPELINE */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 font-mono text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Security Flow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Permissioned Hash-Ledgers Prevent Credential Fraud
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A single mathematical proof chain connecting the university registrar directly to corporate recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-canvas-panel border border-slate-800 space-y-3 shadow-tactile relative">
            <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-300 font-bold font-mono text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-100">Canonical Hashing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Academic records (student name, roll no, CGPA, degree) are serialized into a standardized canonical payload and digested with SHA-256.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-canvas-panel border border-slate-800 space-y-3 shadow-tactile relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-mono text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-100">Digital Signing & Minting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The university signs the digest with its private key. A new block is stamped with the `previousHash` pointer and appended to the ledger.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-canvas-panel border border-slate-800 space-y-3 shadow-tactile relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold font-mono text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-100">Verifiable QR Certificate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Graduates receive an authenticated certificate with embedded Guilloche security borders and an instant cryptographic QR lookup stamp.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-canvas-panel border border-slate-800 space-y-3 shadow-tactile relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold font-mono text-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-100">Instant Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Employers scan the QR or paste the hash. The engine recalculates the payload digest and validates block continuity with mathematical certainty.
            </p>
          </div>

        </div>
      </section>

      {/* TECHNICAL COMPARISON MATRIX */}
      <section className="max-w-6xl mx-auto p-6 sm:p-8 rounded-3xl bg-canvas-panel border border-slate-800 space-y-6 shadow-tactile">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Comparison: Legacy Paper Verification vs VeriChain
          </h2>
          <p className="text-xs text-slate-400">
            Why cryptographic hash chaining resolves India's educational fraud problem.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Evaluation Criteria</th>
                <th className="py-3 px-4 text-rose-400">Manual / Legacy Verification</th>
                <th className="py-3 px-4 text-emerald-400">VeriChain Blockchain Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 text-[11px]">
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-100">Verification Turnaround</td>
                <td className="py-3.5 px-4 text-rose-300/80">14 to 30 Days (Postal / Email delays)</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">Instant (&lt; 12 Milliseconds)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-100">Tamper & Forgery Resistance</td>
                <td className="py-3.5 px-4 text-rose-300/80">Vulnerable to Photoshop & fake seal stamps</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">Mathematically Impossible (SHA-256 Avalanche)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-100">Revocation Management</td>
                <td className="py-3.5 px-4 text-rose-300/80">Revoked degrees remain in circulation</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">On-Chain Revocation Blocks with audit trail</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-100">Cost per Verification</td>
                <td className="py-3.5 px-4 text-rose-300/80">₹500 - ₹2,500 per background check</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">₹0.00 (Zero Public Verification Cost)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="text-center p-8 sm:p-12 rounded-3xl bg-canvas-panel border border-primary-500/30 max-w-4xl mx-auto space-y-4 shadow-tactile">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Test Fraud Detection in Real-Time
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Explore our interactive cryptographic playground. Tweak candidate marks, altered names, or signatures and watch the hash chain immediately reject the forgery.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link to="/tamper-demo">
            <Button size="lg" variant="warning" icon={Sparkles}>
              Open Tamper Playground
            </Button>
          </Link>
          <Link to="/admin/ledger">
            <Button size="lg" variant="secondary" icon={Layers}>
              Explore Block Explorer
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

