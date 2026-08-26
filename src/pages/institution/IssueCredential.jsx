import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Award, ArrowLeft, CheckCircle2, Layers, QrCode as QrIcon, ExternalLink, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCredentials } from '../../context/CredentialContext';
import { useToast } from '../../context/ToastContext';
import CredentialForm from '../../components/credential/CredentialForm';
import Modal from '../../components/common/Modal';
import QRCode from '../../components/verification/QRCode';
import Button from '../../components/common/Button';
import { truncateHash } from '../../utils/generateHash';

export default function IssueCredential() {
  const { institution } = useAuth();
  const { issueCredential } = useCredentials();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const activeInst = institution || {
        id: 'inst-nitr-001',
        name: 'National Institute of Technology Rourkela',
        code: 'NITR-IN',
        publicKey: '04a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
      };

      const result = await issueCredential(formData, activeInst);
      setMintResult(result);
      setShowSuccessModal(true);
      addToast(`Block #${result.block.index} successfully minted to ledger!`, 'success');
    } catch (err) {
      addToast('Error issuing credential: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const verificationUrl = mintResult
    ? `${window.location.origin}/verify/${mintResult.credential.hash}`
    : '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <Link
            to="/institution/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Issue Tamper-Proof Academic Credential
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill in student details. The system generates a deterministic SHA-256 hash and appends a new block to the permissioned chain.
          </p>
        </div>
      </div>

      {/* Credential Issuance Form */}
      <CredentialForm
        onSubmit={handleFormSubmit}
        issuerInstitution={institution}
        isLoading={isLoading}
      />

      {/* Success Minting Modal */}
      {mintResult && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/institution/credentials');
          }}
          title="🎉 Credential Successfully Minted to Blockchain!"
          subtitle={`Block #${mintResult.block.index} permanently appended to ledger`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-tactile">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {mintResult.credential.studentName}
              </h3>
              <p className="text-xs text-primary-300 font-mono font-semibold">
                Certificate ID: {mintResult.credential.id}
              </p>
              <p className="text-xs text-slate-300">
                {mintResult.credential.degree} (CGPA: {mintResult.credential.cgpa})
              </p>
            </div>

            {/* QR Code Container */}
            <div className="py-2 flex justify-center">
              <div className="p-3 bg-white rounded-2xl border border-slate-700 shadow-md">
                <QRCode
                  value={verificationUrl}
                  size={150}
                  showDownload={true}
                />
              </div>
            </div>

            {/* Block Receipt */}
            <div className="p-3 bg-canvas-subtle rounded-xl border border-slate-800 text-left text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Block Number:</span>
                <span className="text-emerald-400 font-bold">#{mintResult.block.index}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Block Hash:</span>
                <span className="text-indigo-300 select-all">{truncateHash(mintResult.block.hash, 8, 8)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Previous Hash:</span>
                <span className="text-slate-400 select-all">{truncateHash(mintResult.block.previousHash, 8, 8)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mining Proof (Nonce):</span>
                <span className="text-amber-400">{mintResult.block.nonce}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="primary"
                className="flex-1 text-xs"
                icon={ExternalLink}
                onClick={() => {
                  window.open(`/verify/${mintResult.credential.hash}`, '_blank');
                }}
              >
                Open Public Verification
              </Button>

              <Button
                variant="secondary"
                className="flex-1 text-xs"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(`/institution/credentials/${mintResult.credential.id}`);
                }}
              >
                View Credential Details
              </Button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}

