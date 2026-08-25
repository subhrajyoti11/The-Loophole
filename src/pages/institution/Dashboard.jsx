import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  PlusCircle,
  AlertOctagon,
  FileCheck2,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Key,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCredentials } from '../../context/CredentialContext';
import CredentialCard from '../../components/credential/CredentialCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { truncateHash } from '../../utils/generateHash';

export default function InstitutionDashboard() {
  const { institution, user } = useAuth();
  const { credentials, blockchain, verificationLogs, networkStats } = useCredentials();

  // Filter credentials for this institution
  const instCredentials = credentials.filter(
    (c) => !institution || c.institutionId === institution.id
  );

  const activeCount = instCredentials.filter((c) => c.status === 'VALID').length;
  const revokedCount = instCredentials.filter((c) => c.status === 'REVOKED').length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
              {institution?.code || 'NITR-IN'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Accreditation: {institution?.accreditationNo || 'NIRF-2025-ENG-016'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {institution?.name || 'National Institute of Technology Rourkela'}
          </h1>
          <p className="text-xs text-slate-300">
            Authorized Registrar: <span className="font-semibold text-slate-100">{user?.name || 'Prof. Rohan K. Sen'}</span> • PoA Validator Node Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/institution/issue">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Issue New Credential
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Total Issued</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{instCredentials.length}</p>
          <span className="text-[11px] text-emerald-400 font-mono">100% on Blockchain</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Active Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-400">{activeCount}</p>
          <span className="text-[11px] text-slate-400 font-mono">Valid & In Good Standing</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Revoked Degrees</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-amber-400">{revokedCount}</p>
          <span className="text-[11px] text-amber-300/80 font-mono">Revocation Blocks Logged</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Global Block Height</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-indigo-300">#{blockchain.length}</p>
          <span className="text-[11px] text-emerald-400 font-mono">Synchronized with PoA</span>
        </div>

      </div>

      {/* Institution Cryptographic Identity Info Card */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Institutional Ed25519 Public Key
            </h4>
            <p className="text-[11px] font-mono text-emerald-400 select-all truncate max-w-xl">
              {institution?.publicKey || '04a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SIGNING KEY VALIDATED</span>
        </div>
      </div>

      {/* Recent Issued Credentials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recently Issued Credentials</h2>
            <p className="text-xs text-slate-400">Digitally signed and mined onto the ledger</p>
          </div>

          <Link
            to="/institution/credentials"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View all ({instCredentials.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instCredentials.slice(0, 3).map((cred) => (
            <CredentialCard key={cred.id} credential={cred} showInstitution={false} />
          ))}
        </div>
      </div>

      {/* Recent Verification Logs Preview */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              Recent Third-Party Verification Queries
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time audit log of recruiters & background check firms</p>
          </div>

          <Link
            to="/institution/logs"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Verifier / Agency</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {verificationLogs.slice(0, 4).map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60">
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-100">
                    {log.studentName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {log.verifier}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        log.result === 'VALID'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-blue-400">
                    {truncateHash(log.hashQueried, 6, 6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
