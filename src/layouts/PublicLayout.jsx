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

      {/* Modern Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  VeriChain — Blockchain-Based Tamper-Proof Academic Credential Verification
                </p>
                <p className="text-[11px] text-slate-500">
                  Smart India Hackathon (PS-03) • SHA-256 Permissioned Hash-Chain Architecture
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PoA Node 01 Online
              </span>
              <span>•</span>
              <span>Zero-Knowledge Proofs & SHA-256</span>
              <span>•</span>
              <span className="text-slate-500">SIH 2025-2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
