import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // using Html5Qrcode directly for better control
    const html5QrCode = new Html5Qrcode("qr-reader");

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        html5QrCode.stop().then(() => {
          onScan(decodedText);
        }).catch((err) => {
           console.error(err);
        });
      },
      (errorMessage) => {
        // parse error, ignore it
      }
    ).catch((err) => {
      // Start failed, handle it.
      setError("Camera permission denied or camera not found.");
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="modal-overlay z-[120]" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-black border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden relative shadow-2xl"
      >
        <div className="flex justify-between items-center p-4 bg-slate-900 absolute top-0 w-full z-10 opacity-70">
           <h3 className="text-white font-bold tracking-widest text-sm uppercase">Scan Join Code</h3>
           <button onClick={onClose} className="text-white bg-slate-800 rounded-full p-1 opacity-70 mb-0 hover:opacity-100 transition-opacity">
              <X size={20} />
           </button>
        </div>
        
        {error ? (
          <div className="p-8 text-center text-red-400 font-bold bg-slate-900 mt-14">
            {error}
          </div>
        ) : (
          <div className="bg-black w-full" style={{ height: "400px" }}>
             <div id="qr-reader" style={{ width: "100%", border: "none" }} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
