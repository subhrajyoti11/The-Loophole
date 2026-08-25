import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CredentialProvider } from './context/CredentialContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CredentialProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <AppRoutes />
          </div>
        </CredentialProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
