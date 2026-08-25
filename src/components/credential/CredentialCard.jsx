import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, QrCode as QrIcon, Eye, ShieldCheck, AlertTriangle, ExternalLink, Hash, Calendar, GraduationCap } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import HashDisplay from '../verification/HashDisplay';
import QRCode from '../verification/QRCode';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { truncateHash } from '../../utils/generateHash';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function CredentialCard({
  credential,
  onRevoke,
  showInstitution = true,
}) {
  const [showQRModal, setShowQRModal] = useState(false);

  if (!credential) return null;

  const isRevoked = credential.status === CREDENTIAL_STATUS.REVOKED;
  const verificationUrl = `${window.location.origin}/verify/${credential.hash || credential.id}`;

  return (
    <>
      <div
        className={`rounded-2xl glass-panel p-5 border transition-all duration-200 hover:shadow-xl hover:border-slate-700 flex flex-col justify-between ${
          isRevoked
            ? 'border-amber-500/30 bg-amber-950/10'
            : 'border-slate-800 hover:border-blue-500/40'
        }`}
      >
        <div>
          {/* Card Header: Status & ID */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                {credential.id}
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-0.5 hover:text-blue-300 transition-colors">
                {credential.studentName}
              </h3>
            </div>
            <StatusBadge status={credential.status} size="sm" />
          </div>

          {/* Academic Info */}
          <div className="mt-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold text-slate-200 truncate">{credential.degree}</span>
            </div>

            {credential.major && (
              <p className="text-[11px] text-slate-400 pl-6 truncate">
                Major: <span className="text-slate-300">{credential.major}</span>
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Roll No:</span>
                <span className="font-mono text-slate-200 font-semibold">{credential.studentId}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-slate-400">CGPA:</span>
                <span className="text-emerald-400 font-bold">{credential.cgpa}</span>
              </div>
            </div>

            {showInstitution && (
              <p className="text-[11px] text-slate-400 truncate pt-1 border-t border-slate-800/60">
                🏛️ {credential.institutionName}
              </p>
            )}
          </div>

          {/* Hash snippet */}
          <div className="mt-4">
            <HashDisplay
              hash={credential.hash}
              label="On-Chain Hash"
              truncate={true}
              className="scale-95 origin-left"
            />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              title="View & Download QR Code"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <QrIcon className="w-4 h-4 text-blue-400" />
            </button>
            <Link
              to={`/tamper-demo?id=${credential.id}`}
              title="Test Tampering on this certificate"
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] font-medium transition-colors"
            >
              Tamper Test
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/verify/${credential.hash || credential.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify</span>
            </Link>
            <Link
              to={`/institution/credentials/${credential.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Verifiable Digital QR Code"
        subtitle={`Instant cryptographic lookup for ${credential.studentName} (${credential.id})`}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <QRCode value={verificationUrl} size={220} showDownload={true} />

          <div className="w-full text-left bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
            <div className="text-slate-400 truncate">
              <span className="text-slate-500">Target URL: </span>
              <span className="text-blue-400">{verificationUrl}</span>
            </div>
            <div className="text-slate-400 truncate">
              <span className="text-slate-500">Payload Hash: </span>
              <span className="text-emerald-400">{truncateHash(credential.hash, 8, 8)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
