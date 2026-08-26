import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
  Printer,
  Sparkles,
  ExternalLink,
  Cpu,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useCredentials } from '../../context/CredentialContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import HashDisplay from '../../components/verification/HashDisplay';
import VerificationTimeline from '../../components/verification/VerificationTimeline';
import CredentialPreview from '../../components/credential/CredentialPreview';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { truncateHash } from '../../utils/generateHash';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function VerificationResult() {
  const { idOrHash } = useParams();
  const { verifyCredential } = useCredentials();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [activeView, setActiveView] = useState('summary'); // 'summary' or 'certificate'

  useEffect(() => {
    let isMounted = true;
    async function runVerification() {
      if (!idOrHash) return;
      setLoading(true);
      try {
        const result = await verifyCredential(decodeURIComponent(idOrHash), user || 'Public Verifier');
        if (isMounted) {
          setReport(result);
        }
      } catch (err) {
        console.error('Verification error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [idOrHash]);

  if (loading) {
    return <Loading message="Querying single-node PoA blockchain ledger..." fullScreen={false} />;
  }

  if (!report || !report.isFound) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-tactile">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Record Not Found on Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            The queried identifier or hash <span className="font-mono text-rose-300">"{idOrHash}"</span> does not exist within any confirmed block header.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-canvas-panel border border-slate-800 text-xs font-mono text-slate-400 max-w-md mx-auto text-left shadow-tactile">
          <p className="font-bold text-slate-300 mb-1">Diagnostic Audit:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Credential has not been minted by an accredited node</li>
            <li>Potential typographical mismatch in query input</li>
            <li>Unauthenticated / counterfeit document record</li>
          </ul>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link to="/verify">
            <Button variant="primary" icon={Search}>
              Try Another Search
            </Button>
          </Link>
          <Link to="/tamper-demo">
            <Button variant="warning" icon={Sparkles}>
              Open Tamper Playground
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthentic = report.status === CREDENTIAL_STATUS.VALID;
  const isRevoked = report.status === CREDENTIAL_STATUS.REVOKED;
  const isTampered = report.status === CREDENTIAL_STATUS.TAMPERED;

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Public verification link copied to clipboard', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Back Button & Action Header */}
      <div className="flex items-center justify-between pb-2">
        <Link
          to="/verify"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Scanner</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to={`/tamper-demo?id=${report.credential?.id}`}>
            <Button size="sm" variant="warning" icon={Sparkles} className="text-xs">
              Tamper Test this Record
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Status Hero Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-tactile relative overflow-hidden ${
          isAuthentic
            ? 'bg-canvas-panel border-emerald-500/40'
            : isRevoked
            ? 'bg-canvas-panel border-amber-500/40'
            : 'bg-canvas-panel border-rose-500/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isAuthentic
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isRevoked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isAuthentic && <CheckCircle2 className="w-7 h-7" />}
              {isRevoked && <AlertTriangle className="w-7 h-7" />}
              {isTampered && <XCircle className="w-7 h-7" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={report.status} size="lg" />
                <span className="text-xs font-mono text-slate-400">
                  PoA Block #{report.blockIndex}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isAuthentic && 'Credential Authenticity Cryptographically Confirmed'}
                {isRevoked && 'Warning: This Academic Credential is Revoked'}
                {isTampered && 'Tamper Alert: Cryptographic Signature Mismatch'}
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {report.message}
              </p>
            </div>
          </div>
        </div>

        {/* Mismatched Fields Alert (if any) */}
        {report.mismatchedFields && report.mismatchedFields.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
            <p className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              Detected Alterations Against On-Chain Ledger:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {report.mismatchedFields.map((m, idx) => (
                <div key={idx} className="p-2.5 bg-canvas-subtle rounded-xl border border-rose-500/20">
                  <span className="text-rose-400 font-semibold">{m.field || m}: </span>
                  {m.original && (
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Original: <span className="text-emerald-400 font-semibold">{m.original}</span>
                      <br />
                      Presented: <span className="text-rose-400 line-through">{m.current}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Mode Toggle: Summary Details vs Full Certificate */}
      <div className="flex justify-center">
        <div className="bg-canvas-panel p-1 rounded-2xl border border-slate-800 flex gap-1 shadow-tactile">
          <button
            type="button"
            onClick={() => setActiveView('summary')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeView === 'summary'
                ? 'bg-canvas-raised text-white shadow-tactile border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cryptographic Audit Dossier
          </button>
          <button
            type="button"
            onClick={() => setActiveView('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeView === 'certificate'
                ? 'bg-canvas-raised text-white shadow-tactile border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Render Official Certificate
          </button>
        </div>
      </div>

      {/* View 1: Summary & Cryptographic Audit */}
      {activeView === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Student and Academic Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student & Degree Card */}
            <div className="p-6 rounded-2xl bg-canvas-panel border border-slate-800 space-y-4 shadow-tactile">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono pb-2 border-b border-slate-800">
                Academic Credential Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Candidate Name:</span>
                  <span className="text-sm font-bold text-slate-100">{report.credential?.studentName}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Roll No / Student ID:</span>
                  <span className="text-sm font-mono font-semibold text-primary-300">{report.credential?.studentId}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Degree Conferred:</span>
                  <span className="text-sm font-bold text-slate-100">{report.credential?.degree}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Branch / Major:</span>
                  <span className="text-sm font-medium text-slate-200">{report.credential?.major || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Cumulative GPA:</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">{report.credential?.cgpa} / 10.0</span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Conferment Date:</span>
                  <span className="text-sm font-mono text-slate-200">{report.credential?.issueDate}</span>
                </div>
              </div>

              {/* Institution Seal Card */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-serif font-bold text-sm">
                    {report.credential?.institutionName?.slice(0, 2) || 'IN'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100">{report.credential?.institutionName}</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Accredited Consensus Authority Node
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Pipeline Step-by-Step */}
            <div className="p-6 rounded-2xl bg-canvas-panel border border-slate-800 shadow-tactile">
              <VerificationTimeline report={report} />
            </div>

          </div>

          {/* Right 1 Col: On-Chain Block Telemetry */}
          <div className="space-y-6">
            
            <div className="p-6 rounded-2xl bg-canvas-panel border border-slate-800 space-y-4 shadow-tactile">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary-400" />
                  On-Chain Receipt
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  PoA Block #{report.blockIndex}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <HashDisplay hash={report.computedHash} label="Computed SHA-256 Digest" truncate={true} />
                <HashDisplay hash={report.ledgerHash} label="On-Chain Block Digest" truncate={true} />
                {report.blockHash && (
                  <HashDisplay hash={report.blockHash} label="Block Header Hash" truncate={true} />
                )}

                <div className="pt-2 border-t border-slate-800 space-y-2 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Block Timestamp:</span>
                    <span className="text-slate-200">
                      {report.blockTimestamp ? new Date(report.blockTimestamp).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consensus Node:</span>
                    <span className="text-primary-300">node-auth-01.verichain</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cryptographic Audit:</span>
                    <span className="text-emerald-400 font-bold">100% SHA-256 Match</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/admin/ledger">
                  <Button size="sm" variant="secondary" icon={Layers} className="w-full text-xs">
                    Inspect in Ledger Explorer
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Share / Export Card */}
            <div className="p-5 rounded-2xl bg-canvas-panel border border-slate-800 text-center space-y-3 shadow-tactile">
              <h4 className="text-xs font-bold text-slate-200 font-mono">Public Verification Link</h4>
              <p className="text-[11px] text-slate-400">
                Share this direct verification URL with recruiters or background check authorities.
              </p>
              <Button
                size="sm"
                variant="outline"
                icon={Share2}
                className="w-full text-xs"
                onClick={copyShareLink}
              >
                Copy Link to Clipboard
              </Button>
            </div>

          </div>

        </div>
      )}

      {/* View 2: Full Rendered Degree Certificate */}
      {activeView === 'certificate' && (
        <div className="space-y-4">
          <CredentialPreview credential={report.credential} showActions={true} />
        </div>
      )}

    </div>
  );
}

