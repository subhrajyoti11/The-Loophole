import React, { useRef } from 'react';
import { ShieldCheck, Award, Printer, Download, ExternalLink, CheckCircle } from 'lucide-react';
import QRCode from '../verification/QRCode';
import { truncateHash } from '../../utils/generateHash';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';

export default function CredentialPreview({
  credential,
  showActions = true,
  className = '',
}) {
  const certificateRef = useRef(null);

  if (!credential) return null;

  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = `${window.location.origin}/verify/${credential.hash || credential.id}`;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Certificate Frame Container */}
      <div
        ref={certificateRef}
        className="printable-certificate relative rounded-3xl p-6 sm:p-10 bg-[#090d16] border-2 border-amber-500/50 shadow-xl overflow-hidden"
      >
        {/* Decorative corner ornaments */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

        {/* Inner Border */}
        <div className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full border border-amber-500/30 bg-[#0c1222]">
          
          {/* Header Seal & University Title */}
          <div className="text-center space-y-3 pb-6 border-b border-amber-500/20 relative">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center p-2 text-amber-400">
                <Award className="w-8 h-8" />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-amber-300 uppercase">
                {credential.institutionName || 'National Institute of Technology Rourkela'}
              </h2>
              <p className="text-[11px] font-mono text-slate-400 tracking-widest uppercase mt-1">
                An Institute of National Importance • Ministry of Education, Government of India
              </p>
            </div>
          </div>

          {/* Certificate Main Body */}
          <div className="text-center my-6 space-y-3">
            <p className="font-serif italic text-slate-400 text-sm">This is to certify that</p>
            
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide underline decoration-amber-500/40 underline-offset-8">
              {credential.studentName}
            </h1>

            <p className="font-mono text-xs text-blue-400 font-semibold tracking-wider">
              Student ID / Roll No: {credential.studentId}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
              has successfully fulfilled all academic curriculum requirements and examinations prescribed by the Senate and is hereby conferred the degree of
            </p>

            <div className="py-2">
              <h3 className="text-lg sm:text-xl font-bold text-amber-200 font-serif">
                {credential.degree}
              </h3>
              {credential.major && (
                <p className="text-xs text-slate-300 font-medium mt-1">
                  with Specialization in <span className="text-white font-semibold">{credential.major}</span>
                </p>
              )}
            </div>

            {/* Performance Grade / CGPA */}
            <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Cumulative GPA</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{credential.cgpa} / 10.0</span>
              </div>
              <div className="h-5 w-px bg-slate-800" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Academic Classification</span>
                <span className="text-xs font-semibold text-slate-200">{credential.grade || 'First Class Honours'}</span>
              </div>
            </div>
          </div>

          {/* Footer with Signatures, QR Code & Blockchain Hash */}
          <div className="pt-6 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center sm:text-left">
            
            {/* Left: Date & Status */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono text-slate-400">Date of Conferment</p>
              <p className="text-xs font-bold text-slate-200 font-mono">
                {credential.issueDate ? new Date(credential.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'June 15, 2025'}
              </p>
              <div className="pt-1">
                <StatusBadge status={credential.status} size="sm" />
              </div>
            </div>

            {/* Center: Live Verifiable QR Code */}
            <div className="flex flex-col items-center justify-center">
              <QRCode
                value={verificationUrl}
                size={88}
                showDownload={false}
              />
              <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-tight">
                Scan with camera to verify
              </span>
            </div>

            {/* Right: Digital Signature & Registrar */}
            <div className="text-center sm:text-right space-y-1">
              <div className="inline-block border-b border-slate-600 pb-1 px-3">
                <p className="font-serif italic text-sm text-amber-300/90">Prof. Rohan K. Sen</p>
              </div>
              <p className="text-[10px] uppercase font-mono text-slate-400">Registrar & Controller of Exams</p>
              <p className="text-[9px] font-mono text-slate-500 truncate">
                Key: {truncateHash(credential.issuerPublicKey || credential.issuerSignature, 6, 6)}
              </p>
            </div>

          </div>

          {/* Bottom SHA-256 Ledger Stamp */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Immutable Ledger Stamp:</span>
              <span className="text-blue-300 font-bold select-all">
                {truncateHash(credential.hash, 10, 10)}
              </span>
            </div>
            <div className="text-slate-500">
              Certificate ID: {credential.id}
            </div>
          </div>

        </div>
      </div>

      {/* Action Bar (Print / Direct Link) */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-slate-800 no-print">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Tamper-proof hash permanently stored on PoA Blockchain block.</span>
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
              Open Public Verification
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
