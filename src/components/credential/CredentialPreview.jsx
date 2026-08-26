import React, { useRef, useState } from 'react';
import { ShieldCheck, Award, Printer, Download, ExternalLink, CheckCircle, Sun, Moon, FileCheck, Key } from 'lucide-react';
import QRCode from '../verification/QRCode';
import { truncateHash } from '../../utils/generateHash';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

export default function CredentialPreview({
  credential,
  showActions = true,
  className = '',
}) {
  const certificateRef = useRef(null);
  const [viewMode, setViewMode] = useState('dark'); // 'dark' (high-tech security) or 'parchment' (classic ivory paper)
  const { addToast } = useToast();

  if (!credential) return null;

  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = `${window.location.origin}/verify/${credential.hash || credential.id}`;

  const isParchment = viewMode === 'parchment';

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      
      {/* Certificate Frame Container */}
      <div
        ref={certificateRef}
        className={`printable-certificate relative rounded-3xl p-4 sm:p-8 transition-all duration-300 overflow-hidden select-none ${
          isParchment
            ? 'certificate-parchment'
            : 'certificate-dark'
        }`}
      >
        {/* Guilloche Micro-Security Border Overlay */}
        <div className="absolute inset-2 sm:inset-3 rounded-2xl guilloche-border pointer-events-none opacity-40" />

        {/* Security Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <Award className="w-96 h-96 text-amber-500" />
        </div>

        {/* Inner Certificate Container */}
        <div
          className={`relative rounded-xl p-5 sm:p-8 flex flex-col justify-between h-full border ${
            isParchment
              ? 'border-amber-800/40 bg-amber-50/20'
              : 'border-amber-500/30 bg-[#070b14]/90'
          }`}
        >
          {/* Top Microprint Security String */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 text-[9px] font-mono uppercase tracking-widest text-amber-500/70">
            <span>OFFICIAL NATIONAL ACADEMIC RECORD • IMMUTABLE LEDGER BLOCK</span>
            <span className="hidden sm:inline">SHA-256 HASH VERIFIED • ZERO-KNOWLEDGE PROOF COMPLIANT</span>
          </div>

          {/* Header Seal & University Title */}
          <div className="text-center space-y-3 py-4 relative">
            {/* Gold Crest Foil Seal */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full gold-foil-bg p-0.5 shadow-lg flex items-center justify-center">
                  <div className={`w-full h-full rounded-full flex items-center justify-center p-2 ${isParchment ? 'bg-[#fcfbfa]' : 'bg-[#090e18]'}`}>
                    <Award className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full hologram-seal flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <div>
              <h2 className={`font-serif text-xl sm:text-2xl font-bold tracking-wider uppercase ${isParchment ? 'text-amber-950 font-bold' : 'gold-foil'}`}>
                {credential.institutionName || 'National Institute of Technology Rourkela'}
              </h2>
              <p className={`text-[11px] font-mono tracking-widest uppercase mt-0.5 ${isParchment ? 'text-slate-600' : 'text-slate-400'}`}>
                An Institute of National Importance • Ministry of Education, Government of India
              </p>
            </div>
          </div>

          {/* Certificate Main Body */}
          <div className="text-center my-4 sm:my-6 space-y-3">
            <p className={`font-serif italic text-sm ${isParchment ? 'text-stone-600' : 'text-slate-400'}`}>
              By the authority of the Board of Governors & the Senate, be it known that
            </p>
            
            <h1 className={`font-serif text-2xl sm:text-4xl font-bold tracking-wide ${isParchment ? 'text-stone-900' : 'text-white'}`}>
              {credential.studentName}
            </h1>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary-500/10 border border-primary-500/30 text-primary-300 font-mono text-xs">
              <span>Roll No / Student ID:</span>
              <span className="font-bold text-white">{credential.studentId}</span>
            </div>

            <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-1 ${isParchment ? 'text-stone-700' : 'text-slate-300'}`}>
              has satisfactorily completed the prescribed curriculum and passed the approved examinations, and is admitted to the degree of
            </p>

            <div className="py-2">
              <h3 className={`text-xl sm:text-2xl font-bold font-serif ${isParchment ? 'text-amber-900' : 'text-amber-300'}`}>
                {credential.degree}
              </h3>
              {credential.major && (
                <p className={`text-xs sm:text-sm font-medium mt-1 ${isParchment ? 'text-stone-800' : 'text-slate-200'}`}>
                  in <span className="font-semibold">{credential.major}</span>
                </p>
              )}
            </div>

            {/* Academic Classification Badge */}
            <div className={`inline-flex items-center gap-4 px-4 py-2 rounded-xl border ${
              isParchment ? 'bg-amber-100/50 border-amber-300/80 text-stone-800' : 'bg-slate-900/90 border-slate-800 text-slate-200'
            }`}>
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Cumulative GPA</span>
                <span className={`text-sm font-bold font-mono ${isParchment ? 'text-emerald-800' : 'text-emerald-400'}`}>
                  {credential.cgpa} / 10.0
                </span>
              </div>
              <div className="h-5 w-px bg-slate-700/50" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Academic Honour</span>
                <span className="text-xs font-semibold">{credential.grade || 'First Class with Distinction'}</span>
              </div>
            </div>
          </div>

          {/* Footer: Date, Live QR Code, Signatures */}
          <div className="pt-6 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center sm:text-left">
            
            {/* Left: Date & Status */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono text-slate-500">Date of Conferment</p>
              <p className={`text-xs font-bold font-mono ${isParchment ? 'text-stone-900' : 'text-slate-200'}`}>
                {credential.issueDate ? new Date(credential.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'June 15, 2025'}
              </p>
              <div className="pt-1">
                <StatusBadge status={credential.status} size="sm" />
              </div>
            </div>

            {/* Center: Live Verifiable QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className={`p-2 rounded-xl border shadow-sm ${isParchment ? 'bg-white border-amber-300' : 'bg-white border-slate-700'}`}>
                <QRCode
                  value={verificationUrl}
                  size={84}
                  showDownload={false}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-tight">
                Scan with camera to verify
              </span>
            </div>

            {/* Right: Digital Signature & Registrar */}
            <div className="text-center sm:text-right space-y-1">
              <div className="inline-block border-b border-slate-600/80 pb-1 px-4">
                <p className={`font-serif italic text-base ${isParchment ? 'text-amber-900' : 'text-amber-300/90'}`}>
                  Prof. Rohan K. Sen
                </p>
              </div>
              <p className="text-[10px] uppercase font-mono text-slate-500">Registrar & Controller of Exams</p>
              <p className="text-[9px] font-mono text-slate-500 truncate">
                Signer: {truncateHash(credential.issuerPublicKey || credential.issuerSignature, 6, 6)}
              </p>
            </div>

          </div>

          {/* Bottom SHA-256 Ledger Stamp */}
          <div className="mt-4 pt-3 border-t border-amber-500/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
              <span>Immutable Ledger Stamp:</span>
              <span className={`font-bold select-all ${isParchment ? 'text-stone-800' : 'text-primary-300'}`}>
                {truncateHash(credential.hash, 10, 10)}
              </span>
            </div>
            <div>
              Certificate ID: <span className="font-semibold">{credential.id}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Bar (Print / Direct Link / Parchment Mode Toggle) */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-canvas-card border border-slate-800/90 no-print shadow-tactile">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode(isParchment ? 'dark' : 'parchment')}
              className="px-3 py-1.5 rounded-xl bg-canvas-raised hover:bg-canvas-highlight text-xs font-mono text-slate-300 border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isParchment ? <Moon className="w-3.5 h-3.5 text-primary-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isParchment ? 'Dark Security View' : 'Classic Parchment View'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={Printer}
              onClick={handlePrint}
            >
              Print / Save PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={ExternalLink}
              onClick={() => window.open(`/verify/${credential.hash || credential.id}`, '_blank')}
            >
              Public Verify URL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

