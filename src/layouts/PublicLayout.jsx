import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { ShieldCheck, Layers } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>

      {/* Bespoke Footer */}
      <footer className="bg-canvas-panel border-t border-slate-800 py-8 mt-16 shadow-tactile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 tracking-tight">
                  VeriChain — Cryptographic Academic Credential & Tamper-Proof Ledger
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Deterministic SHA-256 Permissioned Hash-Chain Architecture • Zero Knowledge Registry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PoA Consensus Synchronized
              </span>
              <span>•</span>
              <span className="text-slate-400">Block Latency &lt; 15ms</span>
              <span>•</span>
              <span className="text-slate-500">v2.4.0 (Engineered Build)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

