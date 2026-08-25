import React, { useState } from 'react';
import { FileCheck2, Search, ArrowRight, ShieldCheck, AlertTriangle, XCircle, Filter, Download } from 'lucide-react';
import { useCredentials } from '../../context/CredentialContext';
import { truncateHash } from '../../utils/generateHash';
import Button from '../../components/common/Button';

export default function VerificationLogs() {
  const { verificationLogs } = useCredentials();
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');

  const filteredLogs = verificationLogs.filter((log) => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(search.toLowerCase()) ||
      log.verifier.toLowerCase().includes(search.toLowerCase()) ||
      log.credentialId.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);

    const matchesResult =
      resultFilter === 'ALL' || log.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  const exportLogsCSV = () => {
    const headers = ['Timestamp', 'Log ID', 'Credential ID', 'Student Name', 'Verifier', 'IP Address', 'Result', 'Queried Hash'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.id,
      l.credentialId,
      `"${l.studentName}"`,
      `"${l.verifier}"`,
      l.ipAddress,
      l.result,
      l.hashQueried,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verification_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-400" />
            Verification Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time immutable audit trail of all background checks and QR queries conducted by employers
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          icon={Download}
          onClick={exportLogsCSV}
          disabled={filteredLogs.length === 0}
        >
          Export CSV Log
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate, verifier, IP address..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'VALID', 'REVOKED', 'TAMPERED'].map((res) => (
            <button
              key={res}
              type="button"
              onClick={() => setResultFilter(res)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                resultFilter === res
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No verification audit logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Student & Credential</th>
                  <th className="py-3 px-4">Verifier / Agency</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Verification Result</th>
                  <th className="py-3 px-4">Queried Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-sans font-bold text-slate-100">{log.studentName}</div>
                      <div className="text-[10px] text-blue-400">{log.credentialId}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans">
                      {log.verifier}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {log.ipAddress}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          log.result === 'VALID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : log.result === 'REVOKED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {truncateHash(log.hashQueried, 6, 6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
