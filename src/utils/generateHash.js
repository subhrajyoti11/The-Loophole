import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';

/**
 * Standardize an object to a canonical JSON string with sorted keys
 * to ensure deterministic SHA-256 hash generation regardless of property order.
 */
export function canonicalStringify(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(item => canonicalStringify(item)).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map(key => {
    return JSON.stringify(key) + ':' + canonicalStringify(obj[key]);
  });
  return '{' + pairs.join(',') + '}';
}

/**
 * Compute SHA-256 hash of a string or object
 * @param {string|object} data - Payload to hash
 * @returns {string} 64-character hex string
 */
export function generateHash(data) {
  const content = typeof data === 'string' ? data : canonicalStringify(data);
  return SHA256(content).toString(Hex);
}

/**
 * Generates credential payload hash based solely on immutable academic data fields.
 * Omits volatile metadata like verification counter or view states.
 */
export function generateCredentialHash(credential) {
  const coreFields = {
    id: credential.id,
    studentName: credential.studentName?.trim(),
    studentId: credential.studentId?.trim(),
    degree: credential.degree?.trim(),
    major: credential.major?.trim() || '',
    cgpa: String(credential.cgpa)?.trim(),
    grade: credential.grade?.trim() || '',
    institutionId: credential.institutionId,
    institutionName: credential.institutionName?.trim(),
    issueDate: credential.issueDate,
    expiryDate: credential.expiryDate || 'PERPETUAL',
    issuerPublicKey: credential.issuerPublicKey || '',
  };
  return generateHash(coreFields);
}

/**
 * Computes block hash from block header & payload
 */
export function calculateBlockHash({ index, previousHash, timestamp, merkleRoot, nonce, issuerId, transactionType }) {
  const header = `${index}-${previousHash}-${timestamp}-${merkleRoot}-${nonce}-${issuerId}-${transactionType}`;
  return generateHash(header);
}

/**
 * Simulates lightweight Proof-of-Authority/Proof-of-Work nonce mining for block stamping
 */
export function mineBlock(blockData, targetPrefix = '00') {
  let nonce = 0;
  let hash = '';
  const startTime = Date.now();
  
  while (true) {
    hash = calculateBlockHash({ ...blockData, nonce });
    if (hash.startsWith(targetPrefix) || nonce > 1000) {
      break;
    }
    nonce++;
  }
  
  return {
    nonce,
    hash,
    miningDurationMs: Date.now() - startTime,
  };
}

/**
 * Format a hash for display (e.g. 0xabcd...1234)
 */
export function truncateHash(hash, startLen = 8, endLen = 8) {
  if (!hash || typeof hash !== 'string') return '';
  if (hash.length <= startLen + endLen) return hash;
  return `${hash.slice(0, startLen)}...${hash.slice(-endLen)}`;
}
