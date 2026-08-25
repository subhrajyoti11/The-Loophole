import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle2, Search, ArrowRight, AlertTriangle, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCredentials } from '../../context/CredentialContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function RevokeCredential() {
  const { institution } = useAuth();
  const { credentials, revokeCredential } = useCredentials();

  const [selectedCred, setSelectedCred] = useState(null);
  const [reason, setReason] = useState('');
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  // Active credentials eligible for revocation
  const activeCredentials = credentials.filter(
    (c) => (!institution || c.institutionId === institution.id) && c.status === CREDENTIAL_STATUS.VALID
  );

  const filtered = activeCredentials.filter((c) =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.studentId.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = async (e) => {
    e.preventDefault();
    if (!selectedCred || !reason.trim()) return;

    setIsProcessing(true);
    try {
      const result = await revokeCredential(selectedCred.id, reason, institution);
      setSuccessNotice(`Successfully revoked ${selectedCred.studentName}'s credential. Block #${result.block.index} minted.`);
      setSelectedCred(null);
      setReason('');
    } catch (err) {
      alert('Revocation failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const commonReasons = [
    'Academic misconduct & plagiarism disciplinary finding',
    'Discovered falsified prerequisite high school / diploma transcript',
    'Administrative / clerical error during marksheet generation',
    'Degree conferred without requisite minimum attendance requirements',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-6 h-6 text-amber-400" />
          Revoke / Suspend Academic Credentials
        </h1>
        <p className="text-xs text-slate-400">
          Execute an on-chain cryptographic revocation. This permanently flags the degree as invalid across all QR and hash verification checks.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Info Card explaining Revocation Blockchain Architecture */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          How Immutability & Revocation Work in Blockchain
        </h3>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          In a true blockchain, past blocks cannot be erased or deleted. Instead, the institution signs a <span className="font-mono text-amber-300">REVOKE_CREDENTIAL</span> transaction that is appended as a brand new block. When public verifiers query the hash, the verification engine detects the latest revocation block and displays the official revocation notice.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, ID, or certificate number to revoke..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* List of Active Credentials */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Eligible Active Credentials ({filtered.length})
        </h3>

        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl glass-panel border border-slate-800 text-xs text-slate-400">
            No active credentials match the query.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((cred) => (
              <div
                key={cred.id}
                className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">{cred.studentName}</span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {cred.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {cred.degree} • CGPA: <span className="text-emerald-400 font-mono font-bold">{cred.cgpa}</span>
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">ID: {cred.id}</p>
                </div>

                <Button
                  size="sm"
                  variant="danger"
                  icon={AlertOctagon}
                  onClick={() => setSelectedCred(cred)}
                >
                  Revoke Degree
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoke Modal */}
      {selectedCred && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCred(null)}
          title={`Revoke Credential: ${selectedCred.studentName}`}
          subtitle={`Certificate ID: ${selectedCred.id}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleRevoke} className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
              ⚠️ Are you sure? Once minted to the ledger, this revocation is permanent and mathematically non-repudiable.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Pre-Set Reason:
              </label>
              <div className="space-y-1.5">
                {commonReasons.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReason(r)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    • {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Revocation Reason <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter detailed reason / disciplinary committee case number..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCred(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                isLoading={isProcessing}
              >
                Confirm & Mint Revocation Block
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
