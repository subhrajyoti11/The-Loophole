import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, PlusCircle, Search, Filter, Layers, QrCode as QrIcon, ShieldCheck, AlertOctagon, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCredentials } from '../../context/CredentialContext';
import CredentialCard from '../../components/credential/CredentialCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { CREDENTIAL_STATUS } from '../../utils/constants';

export default function Credentials() {
  const { institution } = useAuth();
  const { credentials } = useCredentials();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter for this institution or all if admin
  const instCredentials = credentials.filter(
    (c) => !institution || c.institutionId === institution.id
  );

  const filteredCredentials = instCredentials.filter((cred) => {
    const matchesSearch =
      cred.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.degree.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || cred.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Issued Credentials</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable registry of certificates minted on the blockchain ledger
          </p>
        </div>

        <Link to="/institution/issue">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Issue New Credential
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, roll no, degree..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            All ({instCredentials.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter(CREDENTIAL_STATUS.VALID)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === CREDENTIAL_STATUS.VALID
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            Valid ({instCredentials.filter((c) => c.status === CREDENTIAL_STATUS.VALID).length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter(CREDENTIAL_STATUS.REVOKED)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === CREDENTIAL_STATUS.REVOKED
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            Revoked ({instCredentials.filter((c) => c.status === CREDENTIAL_STATUS.REVOKED).length})
          </button>
        </div>

      </div>

      {/* Credentials Grid */}
      {filteredCredentials.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-3">
          <Award className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No matching credentials found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCredentials.map((cred) => (
            <CredentialCard
              key={cred.id}
              credential={cred}
              showInstitution={false}
            />
          ))}
        </div>
      )}

    </div>
  );
}
