import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  Award,
  Zap,
  Lock,
  QrCode as QrIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  School,
  Building2,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import Button from '../components/common/Button';
import { useCredentials } from '../context/CredentialContext';
import { truncateHash } from '../utils/generateHash';

export default function Landing() {
  const { credentials, blockchain, networkStats, institutions } = useCredentials();

  const sampleQuickVerifies = credentials.slice(0, 3);

  return (
    <div className="space-y-20 py-6">
      
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-6 sm:pt-12">
        {/* Floating gradient glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Hackathon PS Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>PS-03 | Smart India Hackathon • Blockchain & Cybersecurity</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Tamper-Proof Academic Credentials on a{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Permissioned Hash-Ledger
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Eliminate fake degrees and costly manual background verification. Universities issue cryptographically signed, immutable digital credentials that employers can validate in milliseconds via QR code or hash.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/verify">
            <Button size="lg" variant="primary" icon={Search} className="px-8 shadow-xl">
              Public Verify Portal
            </Button>
          </Link>

          <Link to="/tamper-demo">
            <Button size="lg" variant="warning" icon={Sparkles} className="px-7">
              Live Tamper Test Demo
            </Button>
          </Link>

          <Link to="/institution/dashboard">
            <Button size="lg" variant="secondary" icon={School} className="px-6">
              Institution Portal
            </Button>
          </Link>
        </div>

        {/* Quick verifiable credential pills */}
        <div className="pt-8 text-xs text-slate-400">
          <p className="font-mono text-[11px] uppercase tracking-wider mb-3">Try One-Click Test Verification:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {sampleQuickVerifies.map((c) => (
              <Link
                key={c.id}
                to={`/verify/${c.hash}`}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-blue-300 font-mono text-xs transition-all flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-slate-200">{c.studentName}</span>
                <span className="text-slate-500 text-[10px]">({c.degree.split(' ')[0]})</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE NETWORK TELEMETRY STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Ledger Blocks</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white mt-2">
            #{blockchain.length}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono mt-1">100% Chain Integrity</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Issued Credentials</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white mt-2">
            {credentials.length}
          </p>
          <span className="text-[11px] text-indigo-300 font-mono mt-1">SHA-256 Digitally Signed</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Verified Institutions</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white mt-2">
            {institutions.length}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono mt-1">Accredited Nodes</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Verification Speed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-amber-300 mt-2">
            &lt; 15ms
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1">Zero Backend Lag</span>
        </div>
      </section>

      {/* HOW IT WORKS / ARCHITECTURE */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            End-to-End Cryptographic Verification Architecture
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Single-node proof-of-concept hash chain proving mathematical immutability and instant fraud detection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-100">Institutional Issuance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              University registrar inputs student academic records. The system computes a canonical SHA-256 payload hash and signs it with the institution's private key.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-100">Block Minting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A new block is stamped with the `previousHash` of the chain, timestamp, and nonce. Once appended, the block is mathematically immutable.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-100">Verifiable QR Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The graduate receives a high-security PDF certificate embedded with a QR code and cryptographic ledger stamp ready for sharing on resumes.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              4
            </div>
            <h3 className="text-base font-bold text-slate-100">Instant Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recruiters scan the QR code or paste the hash. The portal re-calculates the SHA-256 hash and verifies block continuity in &lt;15ms.
            </p>
          </div>

        </div>
      </section>

      {/* WHY BLOCKCHAIN COMPARISON */}
      <section className="max-w-6xl mx-auto p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Traditional Verification vs VeriChain Solution
          </h2>
          <p className="text-xs text-slate-400">
            Why permissioned hash-chaining solves India's academic credential fraud crisis.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase font-mono">
                <th className="py-3 px-4">Verification Feature</th>
                <th className="py-3 px-4 text-rose-400">Manual / Legacy Verification</th>
                <th className="py-3 px-4 text-emerald-400">VeriChain Blockchain Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-100">Turnaround Time</td>
                <td className="py-3.5 px-4 text-rose-300/80">2 to 4 Weeks (Postal/Email backlog)</td>
                <td className="py-3.5 px-4 text-emerald-300 font-semibold">Instant (&lt; 15 Milliseconds)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-100">Tamper Resistance</td>
                <td className="py-3.5 px-4 text-rose-300/80">Vulnerable to Photoshop & fake seal stamps</td>
                <td className="py-3.5 px-4 text-emerald-300 font-semibold">Mathematically impossible to forge (SHA-256)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-100">Revocation Handling</td>
                <td className="py-3.5 px-4 text-rose-300/80">No central registry; revoked degrees still circulate</td>
                <td className="py-3.5 px-4 text-emerald-300 font-semibold">On-chain revocation block with transparent audit trail</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-100">Cost per Verification</td>
                <td className="py-3.5 px-4 text-rose-300/80">₹500 - ₹2,500 per background check</td>
                <td className="py-3.5 px-4 text-emerald-300 font-semibold">₹0.00 (Zero Public Verification Fee)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="text-center p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Experience the Tamper-Proof Difference
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Try our interactive live simulator where you can tweak certificate grades and watch the blockchain immediately catch the fraud.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link to="/tamper-demo">
            <Button size="lg" variant="warning" icon={Sparkles}>
              Open Live Tamper Demo
            </Button>
          </Link>
          <Link to="/admin/ledger">
            <Button size="lg" variant="secondary" icon={Layers}>
              Explore Blockchain Ledger
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
