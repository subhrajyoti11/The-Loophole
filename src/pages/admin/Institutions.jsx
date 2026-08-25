import React, { useState } from 'react';
import { Building2, Key, CheckCircle2, Search, ExternalLink, ShieldCheck, Mail, MapPin, Award } from 'lucide-react';
import { useCredentials } from '../../context/CredentialContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { truncateHash } from '../../utils/generateHash';

export default function Institutions() {
  const { institutions } = useCredentials();
  const [search, setSearch] = useState('');
  const [selectedInst, setSelectedInst] = useState(null);

  const filtered = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            Accredited Institutions & Public Key Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified university nodes authorized to sign and mint academic degree blocks onto the consensus chain
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search institution name, university code, or state..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Institution Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((inst) => (
          <div
            key={inst.id}
            className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold font-serif text-lg">
                    {inst.shortName?.slice(0, 2) || 'UN'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{inst.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-bold">
                        {inst.code}
                      </span>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accredited Node
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{inst.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="font-mono text-slate-300 truncate">{inst.contactEmail}</span>
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Accreditation Ref: {inst.accreditationNo}
                </p>
              </div>

              {/* Public Key snippet */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <span className="text-slate-500 flex items-center gap-1">
                  <Key className="w-3 h-3 text-emerald-400" /> Ed25519 Public Key:
                </span>
                <span className="text-emerald-400 break-all select-all block">
                  {truncateHash(inst.publicKey, 12, 12)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">ISSUED</span>
                  <span className="text-white font-bold">{inst.totalIssued}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">REVOKED</span>
                  <span className="text-amber-400 font-bold">{inst.revokedCredentials}</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedInst(inst)}
              >
                Inspect Node Key
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Key Modal */}
      {selectedInst && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInst(null)}
          title={selectedInst.name}
          subtitle={`Authority Key & Accreditation Verification (${selectedInst.code})`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1 font-semibold">Full Ed25519 Public Key:</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-400 break-all select-all">
                {selectedInst.publicKey}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">ACCREDITATION REF</span>
                <span className="text-slate-200 font-bold">{selectedInst.accreditationNo}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">ESTABLISHED</span>
                <span className="text-slate-200 font-bold">{selectedInst.established}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setSelectedInst(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
