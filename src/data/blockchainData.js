import { BLOCKCHAIN_CONSTANTS } from '../utils/constants';
import { calculateBlockHash } from '../utils/generateHash';
import { initialCredentials } from './credentials';

function buildInitialBlockchain() {
  const chain = [];

  // 1. Genesis Block (Index 0)
  const genesisTimestamp = '2024-01-01T00:00:00.000Z';
  const genesisMerkleRoot = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const genesisHeader = {
    index: 0,
    previousHash: BLOCKCHAIN_CONSTANTS.GENESIS_PREV_HASH,
    timestamp: genesisTimestamp,
    merkleRoot: genesisMerkleRoot,
    nonce: 1042,
    issuerId: 'SYSTEM_ROOT_AUTHORITY',
    transactionType: 'GENESIS_INITIALIZATION',
  };
  const genesisHash = calculateBlockHash(genesisHeader);

  chain.push({
    ...genesisHeader,
    hash: genesisHash,
    dataHash: genesisMerkleRoot,
    credentialId: 'GENESIS',
    status: 'CONFIRMED',
    validatorNode: BLOCKCHAIN_CONSTANTS.NODE_ID,
    originalPayload: null,
    issuerSignature: 'SIG_ROOT_ED25519_0000000000000000000000000000000000000000000000000000000000000000',
  });

  // 2. Add credential blocks
  for (let i = 0; i < initialCredentials.length; i++) {
    const cred = initialCredentials[i];
    const prevBlock = chain[chain.length - 1];
    const blockIndex = chain.length;
    const timestamp = cred.createdAt;
    const merkleRoot = cred.hash;
    const nonce = 100 + i * 37;
    const issuerId = cred.institutionId;
    const transactionType = 'ISSUE_CREDENTIAL';

    const header = {
      index: blockIndex,
      previousHash: prevBlock.hash,
      timestamp,
      merkleRoot,
      nonce,
      issuerId,
      transactionType,
    };

    const hash = calculateBlockHash(header);

    chain.push({
      ...header,
      hash,
      dataHash: cred.hash,
      credentialId: cred.id,
      status: cred.status,
      validatorNode: BLOCKCHAIN_CONSTANTS.NODE_ID,
      originalPayload: { ...cred },
      issuerSignature: cred.issuerSignature,
    });
  }

  // 3. Add Revocation Block for Vikram Joshi's credential
  const revokedCred = initialCredentials.find(c => c.id === 'CRD-2024-NITR-0980');
  if (revokedCred) {
    const prevBlock = chain[chain.length - 1];
    const blockIndex = chain.length;
    const timestamp = revokedCred.revokedAt;
    const merkleRoot = revokedCred.hash;
    const nonce = 442;
    const issuerId = revokedCred.institutionId;
    const transactionType = 'REVOKE_CREDENTIAL';

    const header = {
      index: blockIndex,
      previousHash: prevBlock.hash,
      timestamp,
      merkleRoot,
      nonce,
      issuerId,
      transactionType,
    };

    const hash = calculateBlockHash(header);

    chain.push({
      ...header,
      hash,
      dataHash: revokedCred.hash,
      credentialId: revokedCred.id,
      status: 'REVOKED',
      reason: revokedCred.revocationReason,
      validatorNode: BLOCKCHAIN_CONSTANTS.NODE_ID,
      originalPayload: { ...revokedCred },
      issuerSignature: 'SIG_ED25519_REVOKE_99887766554433221100aabbccddeeff',
    });
  }

  return chain;
}

export const initialBlockchain = buildInitialBlockchain();
