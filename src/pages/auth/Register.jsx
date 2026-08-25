import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Key, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    accreditationNo: '',
    email: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/institution/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">Register Institution Node</h1>
        <p className="text-xs text-slate-400">
          Join the National Academic Credential Consensus Ledger
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Application Approved!</h3>
            <p className="text-xs text-slate-400">
              Generating public/private keypair and provisioning authority node... Redirecting to dashboard.
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institution Official Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. National Institute of Technology Trichy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-100 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institution Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NITT-IN"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-100 text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Accreditation Ref No
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIRF-2025-ENG-008"
                  value={formData.accreditationNo}
                  onChange={(e) => setFormData({ ...formData, accreditationNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-100 text-xs focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Registrar Official Email
              </label>
              <input
                type="email"
                required
                placeholder="registrar@nitt.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-100 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Campus Location / State
              </label>
              <input
                type="text"
                required
                placeholder="Tiruchirappalli, Tamil Nadu, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-100 text-xs focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" size="md">
              Submit for Authority Node Authorization
            </Button>
          </>
        )}
      </form>

      <div className="text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-blue-400 hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
