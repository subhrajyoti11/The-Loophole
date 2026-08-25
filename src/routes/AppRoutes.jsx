import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import InstitutionLayout from '../layouts/InstitutionLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Verify from '../pages/verification/Verify';
import VerificationResult from '../pages/verification/VerificationResult';
import TamperDemo from '../pages/verification/TamperDemo';

// Institution Pages
import InstitutionDashboard from '../pages/institution/Dashboard';
import IssueCredential from '../pages/institution/IssueCredential';
import Credentials from '../pages/institution/Credentials';
import CredentialDetails from '../pages/institution/CredentialDetails';
import RevokeCredential from '../pages/institution/RevokeCredential';
import VerificationLogs from '../pages/institution/VerificationLogs';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import Institutions from '../pages/admin/Institutions';
import BlockchainLedger from '../pages/admin/BlockchainLedger';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:idOrHash" element={<VerificationResult />} />
        <Route path="/tamper-demo" element={<TamperDemo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Institution Dashboard & Actions */}
      <Route path="/institution" element={<InstitutionLayout />}>
        <Route index element={<Navigate to="/institution/dashboard" replace />} />
        <Route path="dashboard" element={<InstitutionDashboard />} />
        <Route path="issue" element={<IssueCredential />} />
        <Route path="credentials" element={<Credentials />} />
        <Route path="credentials/:id" element={<CredentialDetails />} />
        <Route path="revoke" element={<RevokeCredential />} />
        <Route path="logs" element={<VerificationLogs />} />
      </Route>

      {/* Admin Blockchain Management */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="institutions" element={<Institutions />} />
        <Route path="ledger" element={<BlockchainLedger />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
