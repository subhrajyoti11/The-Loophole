# VeriChain — Blockchain-Based Tamper-Proof Academic Credential Verification
### Enterprise Cryptographic Ledger • SHA-256 Permissioned Hash-Chain Architecture

VeriChain is a single-node permissioned SHA-256 hash-chain blockchain platform where universities issue digitally signed, immutable credentials and recruiters/employers can instantly validate authenticity via QR code or cryptographic hash in under 15ms.

## Features
- **Deterministic SHA-256 Hash Chain**: Every block embeds `previousHash`, timestamp, block index, issuer cryptographic signature, and payload hash.
- **Institution Portal**: Issue credentials with live hash preview, mint blocks, generate printable digital certificates, manage revocation, and view verification audit logs.
- **Public Verification**: Search by Certificate ID / Hash, live camera QR scanner, and drag-and-drop QR image verification.
- **Interactive Live Tamper Demo**: Modify any field (e.g. CGPA from 8.2 to 9.9) and watch the cryptographic hash mismatch break verification in real time.
- **Consensus & Block Explorer**: Visual block-by-block ledger explorer from Genesis Block #0 onwards and 1-click full blockchain integrity auditor.

## Quick Start
```bash
npm install
npm run dev
```

Open http://localhost:5173 to test.
