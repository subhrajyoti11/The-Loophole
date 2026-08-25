import { generateCredentialHash, calculateBlockHash } from './generateHash';
import { CREDENTIAL_STATUS, BLOCKCHAIN_CONSTANTS } from './constants';

/**
 * Validates full blockchain integrity by verifying all cryptographic links and header hashes.
 * @param {Array} chain - List of blocks in the blockchain
 * @returns {Object} { isValid: boolean, error: string|null, brokenBlockIndex: number|null }
 */
export function verifyEntireBlockchain(chain) {
  if (!chain || chain.length === 0) {
    return { isValid: false, error: 'Blockchain is empty', brokenBlockIndex: null };
  }

  // Verify Genesis Block
  const genesis = chain[0];
  if (genesis.index !== 0 || genesis.previousHash !== BLOCKCHAIN_CONSTANTS.GENESIS_PREV_HASH) {
    return {
      isValid: false,
      error: 'Genesis block corrupted or invalid previous hash',
      brokenBlockIndex: 0,
    };
  }

  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const prevBlock = chain[i - 1];

    // Check previous hash pointer
    if (currentBlock.previousHash !== prevBlock.hash) {
      return {
        isValid: false,
        error: `Broken chain link at Block #${currentBlock.index}: previousHash (${currentBlock.previousHash.slice(0, 10)}...) does not match Block #${prevBlock.index} hash (${prevBlock.hash.slice(0, 10)}...)`,
        brokenBlockIndex: currentBlock.index,
      };
    }

    // Check block hash computation
    const recalculatedHash = calculateBlockHash({
      index: currentBlock.index,
      previousHash: currentBlock.previousHash,
      timestamp: currentBlock.timestamp,
      merkleRoot: currentBlock.merkleRoot || currentBlock.dataHash,
      nonce: currentBlock.nonce,
      issuerId: currentBlock.issuerId,
      transactionType: currentBlock.transactionType,
    });

    if (currentBlock.hash !== recalculatedHash) {
      return {
        isValid: false,
        error: `Block #${currentBlock.index} header tampering detected: Recorded hash does not match recalculated hash!`,
        brokenBlockIndex: currentBlock.index,
      };
    }
  }

  return { isValid: true, error: null, brokenBlockIndex: null };
}

/**
 * Validates a single credential candidate against the blockchain ledger
 * @param {Object} credential - The candidate credential being verified
 * @param {Array} chain - The blockchain ledger
 * @param {Array} institutions - Registered institutions
 * @returns {Object} Comprehensive verification report
 */
export function verifyCredentialIntegrity(credential, chain, institutions = []) {
  const computedHash = generateCredentialHash(credential);

  // Find corresponding block in blockchain
  const block = chain.find(b => b.credentialId === credential.id || b.dataHash === computedHash || b.dataHash === credential.hash);

  if (!block) {
    return {
      status: CREDENTIAL_STATUS.TAMPERED,
      isAuthentic: false,
      computedHash,
      ledgerHash: null,
      message: 'No on-chain cryptographic record found for this credential ID or hash.',
      checks: {
        hashMatch: false,
        issuerVerified: false,
        blockchainIntegrity: false,
        notRevoked: false,
      },
      blockDetails: null,
      mismatchedFields: ['All fields - Unregistered Credential'],
    };
  }

  // Check if ledger block hash matches calculated hash
  const hashMatches = computedHash === block.dataHash;

  // Check issuer authenticity
  const institution = institutions.find(inst => inst.id === credential.institutionId);
  const issuerVerified = Boolean(institution && institution.verified);

  // Check if revoked on chain
  const revocationBlock = chain.find(b => b.transactionType === 'REVOKE_CREDENTIAL' && b.credentialId === credential.id);
  const isRevoked = Boolean(credential.status === CREDENTIAL_STATUS.REVOKED || revocationBlock || block.status === CREDENTIAL_STATUS.REVOKED);

  // Check blockchain health
  const chainIntegrity = verifyEntireBlockchain(chain);

  let status = CREDENTIAL_STATUS.VALID;
  let message = 'Credential is authentic, mathematically verified, and immutable on the blockchain.';

  if (!hashMatches) {
    status = CREDENTIAL_STATUS.TAMPERED;
    message = 'TAMPER DETECTED: The computed hash of this certificate does not match the immutable hash on the blockchain ledger.';
  } else if (isRevoked) {
    status = CREDENTIAL_STATUS.REVOKED;
    message = `REVOKED: This credential was revoked by ${institution?.name || 'the issuing institution'}.`;
  } else if (!issuerVerified) {
    message = 'WARNING: Issuing institution is not certified in the institutional registry.';
  }

  const mismatchedFields = [];
  if (!hashMatches && block.originalPayload) {
    const original = block.originalPayload;
    if (original.studentName !== credential.studentName) mismatchedFields.push({ field: 'Student Name', original: original.studentName, current: credential.studentName });
    if (original.studentId !== credential.studentId) mismatchedFields.push({ field: 'Student ID / Roll No', original: original.studentId, current: credential.studentId });
    if (original.degree !== credential.degree) mismatchedFields.push({ field: 'Degree / Program', original: original.degree, current: credential.degree });
    if (original.major !== credential.major) mismatchedFields.push({ field: 'Specialization / Major', original: original.major, current: credential.major });
    if (String(original.cgpa) !== String(credential.cgpa)) mismatchedFields.push({ field: 'CGPA / Marks', original: original.cgpa, current: credential.cgpa });
    if (original.grade !== credential.grade) mismatchedFields.push({ field: 'Grade', original: original.grade, current: credential.grade });
    if (original.institutionId !== credential.institutionId) mismatchedFields.push({ field: 'Institution', original: original.institutionName, current: credential.institutionName });
    if (original.issueDate !== credential.issueDate) mismatchedFields.push({ field: 'Issue Date', original: original.issueDate, current: credential.issueDate });
  }

  return {
    status,
    isAuthentic: hashMatches && !isRevoked && issuerVerified && chainIntegrity.isValid,
    computedHash,
    ledgerHash: block.dataHash,
    blockIndex: block.index,
    blockTimestamp: block.timestamp,
    blockHash: block.hash,
    previousHash: block.previousHash,
    issuerSignature: block.issuerSignature,
    issuerName: institution?.name || credential.institutionName,
    issuerVerified,
    isRevoked,
    revocationReason: revocationBlock?.reason || credential.revocationReason || null,
    revocationDate: revocationBlock?.timestamp || credential.revokedAt || null,
    chainIntegrityValid: chainIntegrity.isValid,
    message,
    checks: {
      hashMatch: hashMatches,
      issuerVerified,
      blockchainIntegrity: chainIntegrity.isValid,
      notRevoked: !isRevoked,
    },
    mismatchedFields,
  };
}
