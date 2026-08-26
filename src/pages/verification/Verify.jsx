import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, QrCode as QrIcon, ShieldCheck, ArrowRight, Sparkles, Hash, AlertCircle, Clipboard, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import QRScanner from '../../components/verification/QRScanner';
import Modal from '../../components/common/Modal';
import { useCredentials } from '../../context/CredentialContext';
import { useToast } from '../../context/ToastContext';

export default function Verify() {
  const [query, setQuery] = useState('');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { credentials } = useCredentials();
  const { addToast } = useToast();

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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuery(text.trim());
        addToast('Pasted from clipboard', 'info');
      }
    } catch {
      addToast('Unable to read clipboard. Please paste manually.', 'warning');
    }
  };

  const handleScanSuccess = (decodedHashOrId) => {
    setShowScannerModal(false);
    navigate(`/verify/${encodeURIComponent(decodedHashOrId)}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public Trust Verification Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Academic Credentials Instantly
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Validate the cryptographic authenticity of any university degree, transcript, or diploma directly against the PoA blockchain ledger.
        </p>
      </div>

      {/* Main Search / Lookup Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-canvas-panel border border-slate-800 shadow-tactile space-y-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Enter Certificate ID, SHA-256 Hash, or Roll Number:
            </label>
            <button
              type="button"
              onClick={handlePaste}
              className="text-[11px] font-mono text-primary-400 hover:text-primary-300 flex items-center gap-1 cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste Clipboard</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="e.g. CRD-2025-IITB-1001 or 04a1b2... or 210050114"
                className="w-full pl-11 pr-4 py-3 rounded-xl tactile-input text-slate-100 text-xs focus:outline-none transition-all placeholder:text-slate-600 font-mono"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Search}
              className="px-6 sm:w-auto"
            >
              Verify Record
            </Button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
          <div className="h-px bg-slate-800 flex-1" />
          <span>OR SCAN QR CODE</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* QR Scan Button Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-canvas-subtle border border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <QrIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Scan Certificate QR Code</h4>
              <p className="text-[11px] text-slate-400">Use device camera viewfinder or upload degree screenshot</p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            icon={QrIcon}
            onClick={() => setShowScannerModal(true)}
          >
            Launch Viewfinder
          </Button>
        </div>
      </div>

      {/* Pre-seeded Credentials Quick Test */}
      <div className="p-6 rounded-2xl bg-canvas-panel border border-slate-800 space-y-4 shadow-tactile">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Demo Test Records (Click to Verify)
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Real-time ledger data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {credentials.map((cred) => (
            <Link
              key={cred.id}
              to={`/verify/${cred.id}`}
              className="p-3 rounded-xl bg-canvas-subtle border border-slate-800 hover:border-primary-500/50 hover:bg-canvas-raised transition-all flex items-center justify-between group shadow-tactile"
            >
              <div className="space-y-0.5 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-primary-300 transition-colors truncate">
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

              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
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

