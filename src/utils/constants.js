export const CREDENTIAL_STATUS = {
  VALID: 'VALID',
  TAMPERED: 'TAMPERED',
  REVOKED: 'REVOKED',
  PENDING: 'PENDING',
};

export const USER_ROLES = {
  INSTITUTION: 'institution',
  ADMIN: 'admin',
  VERIFIER: 'verifier',
};

export const BLOCKCHAIN_CONSTANTS = {
  GENESIS_PREV_HASH: '0000000000000000000000000000000000000000000000000000000000000000',
  DIFFICULTY_TARGET: '00', // proof-of-authority lightweight nonce target
  NETWORK_NAME: 'EduTrust Permissioned Hash-Ledger',
  CONSENSUS_MECHANISM: 'Proof of Authority (PoA) / SHA-256 Hash Chain',
  NODE_ID: 'node-auth-01.edutrust.gov.in',
};

export const SAMPLE_DEGREES = [
  'Bachelor of Technology (B.Tech) in Computer Science',
  'Bachelor of Science (B.Sc) in Data Science & AI',
  'Master of Business Administration (MBA) in FinTech',
  'Bachelor of Engineering (B.E) in Electronics & Comm.',
  'Master of Technology (M.Tech) in Cybersecurity',
  'Doctor of Philosophy (Ph.D) in Artificial Intelligence',
  'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
  'Bachelor of Arts (B.A) in Economics',
];

export const STORAGE_KEYS = {
  CREDENTIALS: 'edutrust_credentials_v1',
  BLOCKCHAIN: 'edutrust_blockchain_v1',
  INSTITUTIONS: 'edutrust_institutions_v1',
  USERS: 'edutrust_users_v1',
  AUTH_USER: 'edutrust_auth_user_v1',
  VERIFICATION_LOGS: 'edutrust_verif_logs_v1',
};
