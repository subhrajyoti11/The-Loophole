import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, initStorage, resetDemoState } from '../services/api';
import { verifyEntireBlockchain } from '../utils/verification';

const CredentialContext = createContext(null);

export function CredentialProvider({ children }) {
  const [credentials, setCredentials] = useState([]);
  const [blockchain, setBlockchain] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [verificationLogs, setVerificationLogs] = useState([]);
  const [networkStats, setNetworkStats] = useState(null);
  const [chainHealth, setChainHealth] = useState({ isValid: true, error: null });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize storage & state
  const reloadData = useCallback(async () => {
    try {
      initStorage();
      const [creds, chain, insts, logs, stats] = await Promise.all([
        api.getCredentials(),
        api.getBlockchainLedger(),
        api.getInstitutions(),
        api.getVerificationLogs(),
        api.getNetworkStats(),
      ]);

      setCredentials(creds);
      setBlockchain(chain);
      setInstitutions(insts);
      setVerificationLogs(logs);
      setNetworkStats(stats);
      setChainHealth(verifyEntireBlockchain(chain));
    } catch (err) {
      console.error('Error loading credential state', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const issueCredential = useCallback(async (credentialData, issuerInstitution) => {
    setIsLoading(true);
    try {
      const result = await api.issueCredential(credentialData, issuerInstitution);
      await reloadData();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [reloadData]);

  const revokeCredential = useCallback(async (credentialId, reason, issuerInstitution) => {
    setIsLoading(true);
    try {
      const result = await api.revokeCredential(credentialId, reason, issuerInstitution);
      await reloadData();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [reloadData]);

  const verifyCredential = useCallback(async (input, verifierInfo) => {
    const report = await api.verifyCredential(input, verifierInfo);
    return report;
  }, []);

  const resetAllData = useCallback(async () => {
    setIsLoading(true);
    resetDemoState();
    await reloadData();
  }, [reloadData]);

  const checkBlockchainIntegrity = useCallback(() => {
    const health = verifyEntireBlockchain(blockchain);
    setChainHealth(health);
    return health;
  }, [blockchain]);

  return (
    <CredentialContext.Provider
      value={{
        credentials,
        blockchain,
        institutions,
        verificationLogs,
        networkStats,
        chainHealth,
        isLoading,
        reloadData,
        issueCredential,
        revokeCredential,
        verifyCredential,
        resetAllData,
        checkBlockchainIntegrity,
      }}
    >
      {children}
    </CredentialContext.Provider>
  );
}

export function useCredentials() {
  const ctx = useContext(CredentialContext);
  if (!ctx) {
    throw new Error('useCredentials must be used within a CredentialProvider');
  }
  return ctx;
}
