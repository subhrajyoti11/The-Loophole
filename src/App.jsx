import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CredentialProvider } from './context/CredentialContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CredentialProvider>
          <ToastProvider>
            <div className="min-h-screen bg-canvas text-slate-100 flex flex-col font-sans">
              <AppRoutes />
            </div>
          </ToastProvider>
        </CredentialProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

