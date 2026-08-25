import React, { useState } from 'react';
import {
  Layers,
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  Cpu,
  Hash,
  Activity,
  ArrowDown,
  Code,
} from 'lucide-react';
import { useCredentials } from '../../context/CredentialContext';
import Button from '../../components/common/Button';
import HashDisplay from '../../components/verification/HashDisplay';
import Modal from '../../components/common/Modal';
import { truncateHash } from '../../utils/generateHash';
import { verifyEntireBlockchain } from '../../utils/verification';

export default function BlockchainLedger() {
  const { blockchain, chainHealth, checkBlockchainIntegrity } = useCredentials();
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const res = verifyEntireBlockchain(blockchain);
      setAuditResult(res);
      setIsAuditing(false);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Blockchain Ledger & Block Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic SHA-256 hash-chain with Proof of Authority consensus • {blockchain.length} Blocks Minted
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            icon={Activity}
            isLoading={isAuditing}
            onClick={handleAudit}
          >
            Verify Full Chain Cryptography
          </Button>
        </div>
      </div>

      {/* Audit Result Banner */}
      {auditResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between animate-in fade-in ${
            auditResult.isValid
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {auditResult.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            )}
            <div>
              <p className="font-bold">
                {auditResult.isValid
                  ? '✓ Blockchain Integrity 100% Cryptographically Intact'
                  : '✖ Blockchain Tamper Detected!'}
              </p>
              <p className="text-[11px] text-slate-400">
                {auditResult.isValid
                  ? `All ${blockchain.length} blocks verified. Every previousHash pointer matches and all SHA-256 header hashes are deterministic.`
                  : auditResult.error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAuditResult(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Visual Block Chain View */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Sequential Block Sequence (Genesis → Latest)
        </h3>

        <div className="relative space-y-6">
          {blockchain.map((block, idx) => {
            const isGenesis = block.index === 0;
            const isRevocation = block.transactionType === 'REVOKE_CREDENTIAL';

            return (
              <div key={block.index} className="flex flex-col items-center">
                
                {/* Block Card */}
                <div
                  className={`w-full p-5 sm:p-6 rounded-3xl glass-panel border transition-all duration-200 hover:border-indigo-500/50 space-y-4 ${
                    isGenesis
                      ? 'border-blue-500/30 bg-blue-950/10'
                      : isRevocation
                      ? 'border-amber-500/30 bg-amber-950/10'
                      : 'border-slate-800 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Block Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                          isGenesis
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : isRevocation
                            ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        #{block.index}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100 uppercase font-mono">
                            {block.transactionType}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                              isGenesis
                                ? 'bg-blue-500/20 text-blue-300'
                                : isRevocation
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {block.status || 'CONFIRMED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Target: <span className="text-slate-200 font-semibold">{block.credentialId}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(block.timestamp).toUTCString()}</span>
                    </div>
                  </div>

                  {/* Cryptographic Hashes Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-2">
                      <HashDisplay
                        hash={block.hash}
                        label="Block Header Hash (SHA-256)"
                        truncate={true}
                        highlight={true}
                      />
                      <HashDisplay
                        hash={block.previousHash}
                        label="Previous Block Hash Link (Pointer)"
                        truncate={true}
                      />
                    </div>

                    <div className="space-y-2">
                      <HashDisplay
                        hash={block.dataHash || block.merkleRoot}
                        label="Payload Merkle Root / Data Hash"
                        truncate={true}
                      />
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                        <span className="text-slate-500">Validator & Nonce:</span>
                        <span className="text-slate-300">
                          {block.validatorNode || 'node-auth-01'} • <span className="text-amber-400">Nonce: {block.nonce}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Inspect button */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Issuer Node: {block.issuerId}
                    </span>

                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Code}
                      onClick={() => setSelectedBlock(block)}
                    >
                      Inspect Raw Block
                    </Button>
                  </div>
                </div>

                {/* Chain Link Pointer Arrow */}
                {idx < blockchain.length - 1 && (
                  <div className="flex flex-col items-center py-2 text-indigo-400">
                    <div className="w-0.5 h-4 bg-indigo-500/50" />
                    <div className="p-1 rounded-full bg-slate-900 border border-indigo-500/40">
                      <LinkIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="w-0.5 h-4 bg-indigo-500/50" />
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Block Inspector Modal */}
      {selectedBlock && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBlock(null)}
          title={`Block #${selectedBlock.index} Inspector`}
          subtitle={`Type: ${selectedBlock.transactionType} • Hash: ${truncateHash(selectedBlock.hash, 8, 8)}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 overflow-x-auto max-h-96">
              <pre>{JSON.stringify(selectedBlock, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setSelectedBlock(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
