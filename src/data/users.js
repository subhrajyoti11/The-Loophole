import { USER_ROLES } from '../utils/constants';

export const initialUsers = [
  {
    id: 'user-inst-01',
    email: 'registrar@nitrkl.ac.in',
    name: 'Prof. Rohan K. Sen',
    role: USER_ROLES.INSTITUTION,
    institutionId: 'inst-nitr-001',
    institutionName: 'National Institute of Technology Rourkela',
    designation: 'Registrar & Dean (Academic)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-admin-01',
    email: 'superadmin@edutrust.gov.in',
    name: 'Dr. Ananya Roy',
    role: USER_ROLES.ADMIN,
    institutionId: null,
    institutionName: 'National Higher Education Ledger Authority',
    designation: 'Chief Blockchain Architect & Node Administrator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-verifier-01',
    email: 'recruiter@google.com',
    name: 'Siddharth Varma',
    role: USER_ROLES.VERIFIER,
    institutionId: null,
    institutionName: 'Global Talent Acquisition Corp',
    designation: 'Senior Background Verification Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];
