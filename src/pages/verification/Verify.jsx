import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, QrCode as QrIcon, ShieldCheck, ArrowRight, Sparkles, Hash, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import QRScanner from '../../components/verification/QRScanner';
import Modal from '../../components/common/Modal';
import { useCredentials } from '../../context/CredentialContext';
import { truncateHash } from '../../utils/generateHash';

export default function Verify() {
  const [query, setQuery] = useState('');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { credentials } = useCredentials();

  const handleSearch = (e) => {
    e?.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setErrorMsg('Please enter a Certificate ID, SHA-256 Hash, or Student Roll No.');
      return;
    }
    setErrorMsg('');
    navigate(`/verify/${encodeURIComponent(clean)}`);
  };

  const handleScanSuccess = (decodedHashOrId) => {
    setShowScannerModal(false);
    navigate(`/verify/${encodeURIComponent(decodedHashOrId)}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public Trust Verification Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Verify Academic Credentials Instantly
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Validate the cryptographic authenticity of any university degree or marksheet directly against the permissioned blockchain ledger.
        </p>
      </div>

      {/* Main Search / Lookup Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Enter Certificate ID, SHA-256 Hash, or Roll Number:
          </label>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="e.g. CRD-2025-IITB-1001 or 04a1b2... or 210050114"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input text-slate-100 text-sm focus:outline-none transition-all placeholder:text-slate-500 font-mono"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Search}
              className="px-6 sm:w-auto"
            >
              Verify Record
            </Button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
          <div className="h-px bg-slate-800 flex-1" />
          <span>OR SCAN QR CODE</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* QR Scan Button Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <QrIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Scan Certificate QR Code</h4>
              <p className="text-xs text-slate-400">Use device camera or upload degree certificate image</p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            icon={QrIcon}
            onClick={() => setShowScannerModal(true)}
          >
            Launch QR Scanner
          </Button>
        </div>
      </div>

      {/* Pre-seeded Credentials Quick Test */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Demo Test Records (Click to Verify)
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Real-time ledger data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {credentials.map((cred) => (
            <Link
              key={cred.id}
              to={`/verify/${cred.id}`}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all flex items-center justify-between group"
            >
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                    {cred.studentName}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                      cred.status === 'VALID'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {cred.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {cred.degree} • {cred.institutionName.split(' ')[0]}
                </p>
                <p className="text-[10px] font-mono text-slate-500 truncate">
                  ID: {cred.id}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <Modal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        title="Scan Certificate QR Code"
        subtitle="Point camera at certificate QR or upload QR screenshot"
        maxWidth="max-w-md"
      >
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onScanError={(err) => setErrorMsg(err)}
        />
      </Modal>

    </div>
  );
}
