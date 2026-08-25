import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Layers, 
  Search, 
  Cpu, 
  UserCheck, 
  RotateCcw, 
  ChevronDown, 
  ExternalLink,
  Sparkles,
  School,
  Building2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCredentials } from '../../context/CredentialContext';
import { USER_ROLES } from '../../utils/constants';

export default function Navbar() {
  const { user, switchRole, isInstitution, isAdmin, isVerifier } = useAuth();
  const { resetAllData } = useCredentials();
  const location = useLocation();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset all blockchain blocks & credentials to pristine demo state?')) {
      setIsResetting(true);
      await resetAllData();
      setIsResetting(false);
      navigate('/');
    }
  };

  const navLinks = [
    { name: 'Public Verify', path: '/verify', icon: Search },
    { name: 'Tamper Demo', path: '/tamper-demo', icon: Sparkles, badge: 'Live Test' },
    { name: 'Blockchain Explorer', path: '/admin/ledger', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent tracking-tight">
                    VeriChain
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    PoA Ledger
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Tamper-Proof Academic Credentials
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Portal Direct Links based on role */}
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <Link
              to="/institution/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname.startsWith('/institution')
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <School className="w-3.5 h-3.5 text-indigo-400" />
              <span>Institution Portal</span>
            </Link>
          </nav>

          {/* Right Action Tools & Demo Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Reset Button */}
            <button
              onClick={handleReset}
              disabled={isResetting}
              title="Reset Demo Data (Blockchain & Credentials)"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Demo</span>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-200 transition-all shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 font-mono uppercase leading-tight">Role Switcher</span>
                  <span className="font-semibold text-slate-100">
                    {user?.role === USER_ROLES.INSTITUTION && '🎓 Institution (NIT Rourkela)'}
                    {user?.role === USER_ROLES.ADMIN && '⚡ Authority Node Admin'}
                    {user?.role === USER_ROLES.VERIFIER && '🔍 Public Verifier'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Role Menu */}
              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Demo User Roles</p>
                    <p className="text-xs text-slate-300">Click to preview features as different actors</p>
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => { switchRole(USER_ROLES.INSTITUTION); navigate('/institution/dashboard'); }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                        isInstitution ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-800/80'
                      }`}
                    >
                      <School className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-100">Institution Admin</p>
                        <p className="text-[11px] text-slate-400">Issue credentials, manage ledger keys & revoke</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { switchRole(USER_ROLES.ADMIN); navigate('/admin/dashboard'); }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                        isAdmin ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800/80'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-indigo-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-100">Super Node Admin</p>
                        <p className="text-[11px] text-slate-400">Inspect blocks, verify integrity & institutions</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { switchRole(USER_ROLES.VERIFIER); navigate('/verify'); }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                        isVerifier ? 'bg-emerald-600/20 border border-emerald-500/30' : 'hover:bg-slate-800/80'
                      }`}
                    >
                      <Search className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-100">Public Verifier / Recruiter</p>
                        <p className="text-[11px] text-slate-400">Scan QR codes, check hashes & audit authenticity</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
