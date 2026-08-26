import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, AlertCircle, RefreshCw, X, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

export default function QRScanner({ onScanSuccess, onScanError }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'file'
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const { addToast } = useToast();
  const containerId = 'qr-reader-target';

  useEffect(() => {
    let html5QrCode = null;

    if (activeTab === 'camera') {
      html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 240, height: 240 } };

      html5QrCode
        .start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            handleDecoded(decodedText);
          },
          (errorMessage) => {
            // normal scanning frames
          }
        )
        .then(() => {
          setIsScanning(true);
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Camera start error:', err);
          setCameraError('Camera access unavailable or blocked in this browser. You can upload a QR image screenshot instead.');
          setIsScanning(false);
        });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch((e) => console.error('Stop error', e));
      }
    };
  }, [activeTab]);

  const handleDecoded = (rawText) => {
    addToast('QR Code decoded successfully', 'success', 2000);
    try {
      if (rawText.startsWith('{') && rawText.endsWith('}')) {
        const parsed = JSON.parse(rawText);
        onScanSuccess(parsed.hash || parsed.id || rawText);
      } else if (rawText.includes('/verify/')) {
        const parts = rawText.split('/verify/');
        onScanSuccess(parts[parts.length - 1]);
      } else {
        onScanSuccess(rawText.trim());
      }
    } catch {
      onScanSuccess(rawText.trim());
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-file-dummy');
      const result = await html5QrCode.scanFile(file, true);
      handleDecoded(result);
    } catch (err) {
      if (onScanError) onScanError('Could not decode a valid QR code from this image.');
      else addToast('No valid QR code found in uploaded image', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Tab Switcher */}
      <div className="flex w-full bg-canvas-subtle p-1 rounded-2xl border border-slate-800 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'camera'
              ? 'bg-canvas-raised text-white shadow-tactile border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Camera Viewfinder</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'file'
              ? 'bg-canvas-raised text-white shadow-tactile border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image / Doc</span>
        </button>
      </div>

      {/* Hidden dummy for file scanning */}
      <div id="qr-file-dummy" className="hidden" />

      {/* Camera View */}
      {activeTab === 'camera' && (
        <div className="w-full relative rounded-2xl overflow-hidden border border-slate-700/80 bg-canvas-subtle p-3 shadow-tactile">
          {cameraError ? (
            <div className="p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300">{cameraError}</p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setActiveTab('file')}
                icon={Upload}
              >
                Switch to File Upload
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div id={containerId} className="w-full rounded-xl overflow-hidden" />
              
              {/* Laser animation bar */}
              {isScanning && (
                <div className="absolute left-6 right-6 h-0.5 bg-primary-400 shadow-glow-cyan pointer-events-none animate-laser" />
              )}

              <p className="text-[11px] text-center text-slate-400 mt-2.5 font-mono">
                Frame the certificate QR code inside the scanner target
              </p>
            </div>
          )}
        </div>
      )}

      {/* File Upload View */}
      {activeTab === 'file' && (
        <div className="w-full">
          <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-700/80 hover:border-primary-500 rounded-2xl cursor-pointer bg-canvas-subtle hover:bg-canvas-panel transition-all group shadow-tactile">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 group-hover:scale-105 transition-transform mb-3 shadow-tactile">
                <Upload className="w-5 h-5" />
              </div>
              <p className="mb-1 text-xs font-semibold text-slate-200">
                Click or drag & drop certificate QR screenshot
              </p>
              <p className="text-[11px] text-slate-500 font-mono">PNG, JPG, WEBP, or SVG</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}

