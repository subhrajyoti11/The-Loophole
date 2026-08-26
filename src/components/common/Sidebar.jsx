import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Award,
  AlertOctagon,
  FileCheck2,
  Layers,
  Building2,
  ShieldCheck,
  Sparkles,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCredentials } from '../../context/CredentialContext';

export default function Sidebar({ mode = 'institution' }) {
  const { institution, user } = useAuth();
  const { credentials, blockchain, chainHealth } = useCredentials();
  const location = useLocation();

  const institutionLinks = [
    { name: 'Overview', path: '/institution/dashboard', icon: LayoutDashboard },
    { name: 'Issue Credential', path: '/institution/issue', icon: PlusCircle, highlight: true },
    { name: 'Issued Credentials', path: '/institution/credentials', icon: Award, count: credentials.length },
    { name: 'Revoke / Suspend', path: '/institution/revoke', icon: AlertOctagon },
    { name: 'Verification Logs', path: '/institution/logs', icon: FileCheck2 },
  ];

  const adminLinks = [
    { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Blockchain Ledger', path: '/admin/ledger', icon: Layers, count: blockchain.length },
    { name: 'Institutions Directory', path: '/admin/institutions', icon: Building2 },
  ];

  const links = mode === 'institution' ? institutionLinks : adminLinks;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col justify-between bg-canvas-panel border-r border-slate-800/80 p-4 min-h-[calc(100vh-4rem)]">
      <div>
        {/* Entity Banner */}
        <div className="p-3.5 mb-6 rounded-2xl bg-canvas-raised border border-slate-700/60 shadow-tactile">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center text-primary-300 font-bold font-serif text-sm">
              {mode === 'institution' ? (institution?.shortName?.slice(0, 2) || 'NR') : 'NA'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-100 truncate">
                {mode === 'institution' ? (institution?.shortName || 'NIT Rourkela') : 'National Ledger Authority'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {mode === 'institution' ? 'Accredited Issuer Node' : 'Consensus Authority'}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">Node Sync</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% INTACT
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase font-mono tracking-wider mb-2">
            {mode === 'institution' ? 'Issuer Operations' : 'Consensus Operations'}
          </p>

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-tactile-primary font-semibold border-t border-white/20 border-x border-b border-primary-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>

                {link.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {link.count}
                  </span>
                )}
                {link.highlight && !isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-primary-500/20 text-primary-300 border border-primary-500/30">
                    Mint
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Diagnostic Jump Links */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase font-mono tracking-wider mb-2">
            Public Tooling
          </p>
          <NavLink
            to="/tamper-demo"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300/90 hover:text-amber-200 hover:bg-amber-500/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tamper Playground</span>
          </NavLink>
          <NavLink
            to="/verify"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-primary-300 hover:text-primary-200 hover:bg-primary-500/10 transition-colors"
          >
            <Search className="w-4 h-4 text-primary-400" />
            <span>Public Scanner</span>
          </NavLink>
        </div>
      </div>

      {/* Chain Status Mini Widget */}
      <div className="mt-4 p-3 rounded-xl bg-canvas-subtle border border-slate-800/90 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span className="uppercase">Ledger Height</span>
          <span className="text-primary-300 font-bold">#{blockchain.length} BLOCKS</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Chain State</span>
          <span className={chainHealth.isValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {chainHealth.isValid ? '✓ 100% Cryptographic Match' : '✖ Broken'}
          </span>
        </div>
      </div>
    </aside>
  );
}

