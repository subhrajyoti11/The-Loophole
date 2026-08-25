import { STORAGE_KEYS, CREDENTIAL_STATUS } from '../utils/constants';
import { initialCredentials } from '../data/credentials';
import { initialInstitutions } from '../data/institutions';
import { initialBlockchain } from '../data/blockchainData';
import { initialUsers } from '../data/users';
import { generateCredentialHash, calculateBlockHash, mineBlock } from '../utils/generateHash';
import { verifyCredentialIntegrity, verifyEntireBlockchain } from '../utils/verification';

// Helper to interact with LocalStorage
const storage = {
  get: (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  },
};

// Initial Seed Setup
export function initStorage() {
  const currentCreds = storage.get(STORAGE_KEYS.CREDENTIALS, null);
  // Auto-upgrade if previous storage had old IITB seed
  if (!currentCreds || (currentCreds[0] && !currentCreds[0].id.includes('NITR'))) {
    storage.set(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    storage.set(STORAGE_KEYS.BLOCKCHAIN, initialBlockchain);
    storage.set(STORAGE_KEYS.INSTITUTIONS, initialInstitutions);
    storage.set(STORAGE_KEYS.USERS, initialUsers);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }

  if (!localStorage.getItem(STORAGE_KEYS.VERIFICATION_LOGS)) {
    const seedLogs = [
      {
        id: 'log-001',
        credentialId: 'CRD-2025-NITR-1001',
        studentName: 'Aarav Mehta',
        verifier: 'Microsoft India HR (recruitment@microsoft.com)',
        ipAddress: '103.21.244.0',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        result: 'VALID',
        hashQueried: initialCredentials[0].hash,
      },
      {
        id: 'log-002',
        credentialId: 'CRD-2025-NITR-1002',
        studentName: 'Priya Sharma',
        verifier: 'Google Recruitment Portal',
        ipAddress: '66.249.66.1',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        result: 'VALID',
        hashQueried: initialCredentials[1].hash,
      },
      {
        id: 'log-003',
        credentialId: 'CRD-2024-NITR-0980',
        studentName: 'Vikram Joshi',
        verifier: 'L&T Infotech Background Screening',
        ipAddress: '182.72.138.2',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        result: 'REVOKED',
        hashQueried: initialCredentials[4].hash,
      },
    ];
    storage.set(STORAGE_KEYS.VERIFICATION_LOGS, seedLogs);
  }
}

// Reset all storage to initial pristine state
export function resetDemoState() {
  localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
  localStorage.removeItem(STORAGE_KEYS.BLOCKCHAIN);
  localStorage.removeItem(STORAGE_KEYS.INSTITUTIONS);
  localStorage.removeItem(STORAGE_KEYS.VERIFICATION_LOGS);
  initStorage();
}

export const api = {
  // --- CREDENTIALS ---
  async getCredentials(institutionId = null) {
    const creds = storage.get(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    if (institutionId) {
      return creds.filter(c => c.institutionId === institutionId);
    }
    return creds;
  },

  async getCredentialById(id) {
    const creds = storage.get(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    return creds.find(c => c.id.toLowerCase() === id.toLowerCase() || c.studentId.toLowerCase() === id.toLowerCase());
  },

  async getCredentialByHash(hash) {
    const creds = storage.get(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    const cleanHash = hash.trim().toLowerCase();
    return creds.find(c => c.hash.toLowerCase() === cleanHash || c.id.toLowerCase() === cleanHash);
  },

  async issueCredential(credentialData, issuerInstitution) {
    const creds = storage.get(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    const chain = storage.get(STORAGE_KEYS.BLOCKCHAIN, initialBlockchain);

    const id = `CRD-${new Date().getFullYear()}-${issuerInstitution.code.split('-')[0]}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();
    
    // Construct base object
    const newCredential = {
      ...credentialData,
      id,
      institutionId: issuerInstitution.id,
      institutionName: issuerInstitution.name,
      issuerPublicKey: issuerInstitution.publicKey,
      issuerSignature: `SIG_ED25519_${Math.random().toString(36).substring(2)}${Date.now()}`,
      status: CREDENTIAL_STATUS.VALID,
      createdAt,
      viewsCount: 0,
      revocationReason: null,
      revokedAt: null,
    };

    // Calculate deterministic hash
    newCredential.hash = generateCredentialHash(newCredential);

    // Mine and append new Block to blockchain
    const lastBlock = chain[chain.length - 1];
    const blockIndex = chain.length;
    const timestamp = createdAt;
    const merkleRoot = newCredential.hash;
    const transactionType = 'ISSUE_CREDENTIAL';

    const rawBlockHeader = {
      index: blockIndex,
      previousHash: lastBlock.hash,
      timestamp,
      merkleRoot,
      issuerId: issuerInstitution.id,
      transactionType,
    };

    const { nonce, hash } = mineBlock(rawBlockHeader);

    const newBlock = {
      ...rawBlockHeader,
      nonce,
      hash,
      dataHash: newCredential.hash,
      credentialId: newCredential.id,
      status: CREDENTIAL_STATUS.VALID,
      validatorNode: 'node-auth-01.edutrust.gov.in',
      originalPayload: { ...newCredential },
      issuerSignature: newCredential.issuerSignature,
    };

    // Update state
    const updatedCreds = [newCredential, ...creds];
    const updatedChain = [...chain, newBlock];

    storage.set(STORAGE_KEYS.CREDENTIALS, updatedCreds);
    storage.set(STORAGE_KEYS.BLOCKCHAIN, updatedChain);

    return { credential: newCredential, block: newBlock };
  },

  async revokeCredential(credentialId, reason, issuerInstitution) {
    const creds = storage.get(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    const chain = storage.get(STORAGE_KEYS.BLOCKCHAIN, initialBlockchain);

    const credIndex = creds.findIndex(c => c.id === credentialId);
    if (credIndex === -1) throw new Error('Credential not found');

    const revokedAt = new Date().toISOString();
    const updatedCred = {
      ...creds[credIndex],
      status: CREDENTIAL_STATUS.REVOKED,
      revocationReason: reason,
      revokedAt,
    };

    // Append REVOKE block to chain
    const lastBlock = chain[chain.length - 1];
    const blockIndex = chain.length;
    const merkleRoot = updatedCred.hash;
    const transactionType = 'REVOKE_CREDENTIAL';

    const rawBlockHeader = {
      index: blockIndex,
      previousHash: lastBlock.hash,
      timestamp: revokedAt,
      merkleRoot,
      issuerId: issuerInstitution?.id || updatedCred.institutionId,
      transactionType,
    };

    const { nonce, hash } = mineBlock(rawBlockHeader);

    const newBlock = {
      ...rawBlockHeader,
      nonce,
      hash,
      dataHash: updatedCred.hash,
      credentialId: updatedCred.id,
      status: CREDENTIAL_STATUS.REVOKED,
      reason,
      validatorNode: 'node-auth-01.edutrust.gov.in',
      originalPayload: { ...updatedCred },
      issuerSignature: `SIG_ED25519_REVOKE_${Date.now()}`,
    };

    creds[credIndex] = updatedCred;
    const updatedChain = [...chain, newBlock];

    storage.set(STORAGE_KEYS.CREDENTIALS, creds);
    storage.set(STORAGE_KEYS.BLOCKCHAIN, updatedChain);

    return { credential: updatedCred, block: newBlock };
  },

  // --- VERIFICATION ---
  async verifyCredential(input, verifierInfo = 'Public Verifier') {
    const creds = storage.get(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    const chain = storage.get(STORAGE_KEYS.BLOCKCHAIN, initialBlockchain);
    const institutions = storage.get(STORAGE_KEYS.INSTITUTIONS, initialInstitutions);

    let candidate = null;
    if (typeof input === 'string') {
      const cleanInput = input.trim();
      candidate = creds.find(c => c.id.toLowerCase() === cleanInput.toLowerCase() || c.hash.toLowerCase() === cleanInput.toLowerCase() || c.studentId.toLowerCase() === cleanInput.toLowerCase());
      if (!candidate) {
        // Look for on-chain block directly
        const block = chain.find(b => b.credentialId?.toLowerCase() === cleanInput.toLowerCase() || b.dataHash?.toLowerCase() === cleanInput.toLowerCase() || b.hash?.toLowerCase() === cleanInput.toLowerCase());
        if (block && block.originalPayload) {
          candidate = block.originalPayload;
        }
      }
    } else if (typeof input === 'object' && input !== null) {
      candidate = input;
    }

    if (!candidate) {
      return {
        isFound: false,
        status: CREDENTIAL_STATUS.TAMPERED,
        message: 'No record found matching the provided Certificate ID, Hash, or QR Code on the blockchain.',
        checks: {
          hashMatch: false,
          issuerVerified: false,
          blockchainIntegrity: false,
          notRevoked: false,
        },
      };
    }

    const report = verifyCredentialIntegrity(candidate, chain, institutions);

    // Record verification log only if not an immediate duplicate
    const logs = storage.get(STORAGE_KEYS.VERIFICATION_LOGS, []);
    const lastLog = logs[0];
    const isRecentDuplicate = lastLog && lastLog.credentialId === candidate.id && (Date.now() - new Date(lastLog.timestamp).getTime() < 5000);
    
    if (!isRecentDuplicate) {
      const newLog = {
        id: `log-${Date.now()}`,
        credentialId: candidate.id || 'UNKNOWN',
        studentName: candidate.studentName || 'Unknown Student',
        verifier: typeof verifierInfo === 'string' ? verifierInfo : verifierInfo?.name || 'Public Verifier',
        ipAddress: `${Math.floor(Math.random() * 150 + 50)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.1`,
        timestamp: new Date().toISOString(),
        result: report.status,
        hashQueried: candidate.hash || report.computedHash,
      };
      storage.set(STORAGE_KEYS.VERIFICATION_LOGS, [newLog, ...logs.slice(0, 49)]);
    }

    return {
      isFound: true,
      credential: candidate,
      ...report,
    };
  },

  // --- BLOCKCHAIN & STATS ---
  async getBlockchainLedger() {
    return storage.get(STORAGE_KEYS.BLOCKCHAIN, initialBlockchain);
  },

  async getInstitutions() {
    return storage.get(STORAGE_KEYS.INSTITUTIONS, initialInstitutions);
  },

  async getVerificationLogs() {
    return storage.get(STORAGE_KEYS.VERIFICATION_LOGS, []);
  },

  async getNetworkStats() {
    const chain = storage.get(STORAGE_KEYS.BLOCKCHAIN, initialBlockchain);
    const creds = storage.get(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    const insts = storage.get(STORAGE_KEYS.INSTITUTIONS, initialInstitutions);
    const logs = storage.get(STORAGE_KEYS.VERIFICATION_LOGS, []);

    const integrity = verifyEntireBlockchain(chain);

    return {
      totalBlocks: chain.length,
      totalCredentials: creds.length,
      activeCredentials: creds.filter(c => c.status === CREDENTIAL_STATUS.VALID).length,
      revokedCredentials: creds.filter(c => c.status === CREDENTIAL_STATUS.REVOKED).length,
      totalInstitutions: insts.length,
      totalVerifications: logs.length,
      isChainValid: integrity.isValid,
      lastBlockHash: chain[chain.length - 1]?.hash || '',
      nodeHealth: '100% HEALTHY',
      consensus: 'Proof of Authority (PoA) / SHA-256 Hash Chain',
    };
  },
};
