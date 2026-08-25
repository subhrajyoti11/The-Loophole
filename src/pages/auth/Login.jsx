import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, School, Layers, Search, Lock, Mail, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import Button from '../../components/common/Button';

export default function Login() {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('registrar@nitrkl.ac.in');
  const [role, setRole] = useState(USER_ROLES.INSTITUTION);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, role);
    if (role === USER_ROLES.INSTITUTION) navigate('/institution/dashboard');
    else if (role === USER_ROLES.ADMIN) navigate('/admin/dashboard');
    else navigate('/verify');
  };

  const handleQuickLogin = (selectedRole, userEmail) => {
    switchRole(selectedRole);
    if (selectedRole === USER_ROLES.INSTITUTION) navigate('/institution/dashboard');
    else if (selectedRole === USER_ROLES.ADMIN) navigate('/admin/dashboard');
    else navigate('/verify');
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">Sign In to VeriChain</h1>
        <p className="text-xs text-slate-400">
          Access credential issuance, node consensus, and audit controls
        </p>
      </div>

      {/* Quick 1-Click Demo Accounts Box */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          ⚡ 1-Click Hackathon Login:
        </p>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => handleQuickLogin(USER_ROLES.INSTITUTION, 'registrar@nitrkl.ac.in')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <School className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">NIT Rourkela (Registrar)</p>
                <p className="text-[10px] text-slate-400 font-mono">registrar@nitrkl.ac.in</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin(USER_ROLES.ADMIN, 'superadmin@edutrust.gov.in')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Consensus Authority Node Admin</p>
                <p className="text-[10px] text-slate-400 font-mono">superadmin@edutrust.gov.in</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin(USER_ROLES.VERIFIER, 'recruiter@google.com')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Public Recruiter / Verifier</p>
                <p className="text-[10px] text-slate-400 font-mono">recruiter@google.com</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-slate-100 text-xs focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Select Access Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none"
          >
            <option value={USER_ROLES.INSTITUTION}>Institution Representative / Registrar</option>
            <option value={USER_ROLES.ADMIN}>Consensus Node Super Administrator</option>
            <option value={USER_ROLES.VERIFIER}>Corporate Recruiter / Public Verifier</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Security Passcode / Token
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              defaultValue="password123"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-slate-100 text-xs focus:outline-none font-mono"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" size="md">
          Authenticate & Access Portal
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Need institution onboarding?{' '}
        <Link to="/register" className="text-blue-400 hover:underline">
          Register New University Node
        </Link>
      </div>

    </div>
  );
}
