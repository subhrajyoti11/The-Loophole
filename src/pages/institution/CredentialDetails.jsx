import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Award, AlertOctagon, Printer, QrCode as QrIcon, ExternalLink, Code, Layers, FileCheck2 } from 'lucide-react';
import { useCredentials } from '../../context/CredentialContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CredentialPreview from '../../components/credential/CredentialPreview';
import StatusBadge from '../../components/common/StatusBadge';
import HashDisplay from '../../components/verification/HashDisplay';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { truncateHash } from '../../utils/generateHash';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function CredentialDetails() {
  const { id } = useParams();
  const { credentials, blockchain, revokeCredential } = useCredentials();
  const { institution } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [isRevoking, setIsRevoking] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const credential = credentials.find(
    (c) => c.id.toLowerCase() === id?.toLowerCase() || c.studentId.toLowerCase() === id?.toLowerCase()
  );

  const onChainBlock = blockchain.find((b) => b.credentialId === credential?.id);

  if (!credential) {
    return (
      <div className="p-12 text-center space-y-4 bg-canvas-panel rounded-3xl border border-slate-800 shadow-tactile">
        <h2 className="text-xl font-bold text-white tracking-tight">Credential Not Found</h2>
        <p className="text-xs text-slate-400">The requested credential ID does not exist on the current ledger.</p>
        <Link to="/institution/credentials">
          <Button variant="secondary" size="sm">Back to Credentials</Button>
        </Link>
      </div>
    );
  }

  const handleRevokeSubmit = async (e) => {
    e.preventDefault();
    if (!revokeReason.trim()) return;
    setIsRevoking(true);
    try {
      await revokeCredential(credential.id, revokeReason, institution);
      setShowRevokeModal(false);
      addToast('Credential successfully marked as REVOKED and sealed on-chain!', 'success');
    } catch (err) {
      addToast('Failed to revoke: ' + err.message, 'error');
    } finally {
      setIsRevoking(false);
    }
  };

  const isRevoked = credential.status === CREDENTIAL_STATUS.REVOKED;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Back and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <Link
            to="/institution/credentials"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Issued Credentials</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{credential.studentName}</h1>
            <StatusBadge status={credential.status} size="md" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={Code}
            onClick={() => setShowRawJson(true)}
          >
            Raw JSON
          </Button>

          {!isRevoked && (
            <Button
              size="sm"
              variant="danger"
              icon={AlertOctagon}
              onClick={() => setShowRevokeModal(true)}
            >
              Revoke Credential
            </Button>
          )}

          <Link to={`/tamper-demo?id=${credential.id}`}>
            <Button size="sm" variant="warning">
              Tamper Test
            </Button>
          </Link>
        </div>
      </div>

      {/* Revocation notice if revoked */}
      {isRevoked && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1 shadow-tactile">
          <p className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            This credential has been officially REVOKED
          </p>
          <p className="text-xs text-amber-200/90">{credential.revocationReason}</p>
          {credential.revokedAt && (
            <p className="text-[10px] text-amber-400/70 font-mono">
              Revocation Block Timestamp: {new Date(credential.revokedAt).toUTCString()}
            </p>
          )}
        </div>
      )}

      {/* Certificate Frame Preview */}
      <CredentialPreview credential={credential} showActions={true} />

      {/* On-Chain Cryptographic Receipt */}
      <div className="p-6 rounded-2xl bg-canvas-panel border border-slate-800 space-y-4 shadow-tactile">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary-400" />
            On-Chain Block Metadata
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">PoA Consensus Verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-[10px] block">BLOCK HEIGHT</span>
              <span className="text-slate-200 font-bold">Block #{onChainBlock?.index ?? 1}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">BLOCK HEADER HASH</span>
              <span className="text-indigo-300 break-all">{onChainBlock?.hash || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">PREVIOUS BLOCK HASH (CHAIN POINTER)</span>
              <span className="text-slate-400 break-all">{onChainBlock?.previousHash || 'N/A'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-[10px] block">IMMUTABLE PAYLOAD HASH</span>
              <span className="text-emerald-400 font-bold break-all">{credential.hash}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">ISSUER ED25519 SIGNATURE</span>
              <span className="text-slate-300 break-all">{credential.issuerSignature}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">TIMESTAMP RECORDED</span>
              <span className="text-slate-300">{new Date(credential.createdAt).toUTCString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revoke Modal */}
      <Modal
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        title="Revoke Academic Credential"
        subtitle="This action will append an immutable revocation block to the blockchain ledger"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleRevokeSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300">
            ⚠️ Revoking a credential permanently flags it as INVALID on all public QR and hash verification checks.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Revocation Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="e.g. Fabrication of prerequisite transfer credits or academic disciplinary committee finding..."
              className="w-full px-3.5 py-2.5 rounded-xl tactile-input text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowRevokeModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isRevoking}
            >
              Confirm & Mint Revocation Block
            </Button>
          </div>
        </form>
      </Modal>

      {/* Raw JSON Modal */}
      <Modal
        isOpen={showRawJson}
        onClose={() => setShowRawJson(false)}
        title="Raw Canonical JSON Payload"
        subtitle="Exact object payload hashed for cryptographic proof"
        maxWidth="max-w-xl"
      >
        <div className="bg-canvas-subtle p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
          <pre>{JSON.stringify(credential, null, 2)}</pre>
        </div>
      </Modal>

    </div>
  );
}

