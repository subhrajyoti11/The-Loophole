import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import Button from '../common/Button';

export default function QRCode({
  value,
  size = 160,
  includeMargin = true,
  showDownload = true,
  className = '',
}) {
  const qrRef = useRef(null);

  const downloadQR = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size * 2;
      canvas.height = size * 2;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `verichain-qr-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const payloadString = typeof value === 'object' ? JSON.stringify(value) : String(value || '');

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        ref={qrRef}
        className="p-2.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-md"
      >
        <QRCodeSVG
          value={payloadString}
          size={size}
          level="M"
          includeMargin={includeMargin}
          fgColor="#0f172a"
          bgColor="#ffffff"
        />
      </div>

      {showDownload && (
        <Button
          size="sm"
          variant="secondary"
          onClick={downloadQR}
          icon={Download}
          className="text-xs"
        >
          Download QR
        </Button>
      )}
    </div>
  );
}
