import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Hash, Cpu, Check, AlertCircle, Eye } from 'lucide-react';
import Button from '../common/Button';
import HashDisplay from '../verification/HashDisplay';
import { SAMPLE_DEGREES } from '../../utils/constants';
import { generateCredentialHash } from '../../utils/generateHash';
import CredentialPreview from './CredentialPreview';
import Modal from '../common/Modal';

export default function CredentialForm({
  onSubmit,
  issuerInstitution,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    studentEmail: '',
    degree: SAMPLE_DEGREES[0],
    customDegree: '',
    major: 'Computer Science and Engineering',
    cgpa: '9.25',
    grade: 'First Class with Distinction',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const [isCustomDegree, setIsCustomDegree] = useState(false);
  const [calculatedHash, setCalculatedHash] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Recalculate hash live as user types!
  useEffect(() => {
    const degreeFinal = isCustomDegree ? formData.customDegree : formData.degree;
    const tempPayload = {
      id: 'CRD-PREVIEW',
      studentName: formData.studentName || 'Student Name',
      studentId: formData.studentId || 'STUDENT-ID',
      degree: degreeFinal || 'Degree',
      major: formData.major,
      cgpa: formData.cgpa,
      grade: formData.grade,
      institutionId: issuerInstitution?.id || 'inst-nitr-001',
      institutionName: issuerInstitution?.name || 'National Institute of Technology Rourkela',
      issueDate: formData.issueDate,
      expiryDate: 'PERPETUAL',
      issuerPublicKey: issuerInstitution?.publicKey || '',
    };
    setCalculatedHash(generateCredentialHash(tempPayload));
  }, [formData, isCustomDegree, issuerInstitution]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.studentName.trim()) errors.studentName = 'Student name is required';
    if (!formData.studentId.trim()) errors.studentId = 'Student ID / Roll number is required';
    if (!formData.studentEmail.trim()) errors.studentEmail = 'Student email is required';
    if (isCustomDegree && !formData.customDegree.trim()) errors.customDegree = 'Degree title is required';
    if (!formData.cgpa || isNaN(formData.cgpa) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      errors.cgpa = 'CGPA must be a valid number between 0.0 and 10.0';
    }
    if (!formData.issueDate) errors.issueDate = 'Issue date is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...formData,
      degree: isCustomDegree ? formData.customDegree : formData.degree,
    };
    delete payload.customDegree;
    onSubmit(payload);
  };

  const previewCredential = {
    id: 'CRD-SAMPLE-PENDING',
    studentName: formData.studentName || 'Sample Student',
    studentId: formData.studentId || '2025-CS-000',
    studentEmail: formData.studentEmail,
    degree: isCustomDegree ? formData.customDegree : formData.degree,
    major: formData.major,
    cgpa: formData.cgpa || '9.0',
    grade: formData.grade || 'First Class',
    institutionId: issuerInstitution?.id || 'inst-nitr-001',
    institutionName: issuerInstitution?.name || 'National Institute of Technology Rourkela',
    issueDate: formData.issueDate,
    hash: calculatedHash,
    status: 'VALID',
    issuerPublicKey: issuerInstitution?.publicKey || '',
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Student Information */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Student Identification Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name of Candidate <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="e.g. Aarav Mehta"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm focus:outline-none transition-all placeholder:text-slate-500"
              />
              {formErrors.studentName && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.studentName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Student ID / University Roll No <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g. 210050114"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm focus:outline-none transition-all placeholder:text-slate-500 font-mono"
              />
              {formErrors.studentId && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.studentId}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Student Official / Alumni Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                placeholder="e.g. aarav.mehta@alumni.iitb.ac.in"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm focus:outline-none transition-all placeholder:text-slate-500"
              />
              {formErrors.studentEmail && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.studentEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Academic Program & Degree */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Academic Program & Performance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Degree / Program Awarded <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomDegree(!isCustomDegree)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  {isCustomDegree ? 'Select from standard degrees' : '+ Enter custom degree title'}
                </button>
              </div>

              {isCustomDegree ? (
                <input
                  type="text"
                  name="customDegree"
                  value={formData.customDegree}
                  onChange={handleChange}
                  placeholder="e.g. Dual Degree B.Tech + M.Tech in Artificial Intelligence"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm focus:outline-none transition-all placeholder:text-slate-500"
                />
              ) : (
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-all"
                >
                  {SAMPLE_DEGREES.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-slate-100">
                      {d}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Branch / Specialization / Major
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm focus:outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cumulative GPA (CGPA out of 10.0) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 9.42"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm focus:outline-none transition-all font-mono placeholder:text-slate-500"
              />
              {formErrors.cgpa && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.cgpa}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Academic Classification / Honours
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-all"
              >
                <option value="Distinction / First Class with Honours">Distinction / First Class with Honours</option>
                <option value="First Class with Distinction">First Class with Distinction</option>
                <option value="First Division">First Division</option>
                <option value="Second Division">Second Division</option>
                <option value="Pass Division">Pass Division</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Conferment / Issue Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Live Cryptographic Stamping Preview */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-indigo-950/40 border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                Deterministic SHA-256 Digest (Live Calculation)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              SHA-256 Canonical
            </span>
          </div>

          <p className="text-xs text-slate-400">
            This 256-bit cryptographic digest changes instantaneously with every keystroke and will be permanently sealed into the next block of the ledger.
          </p>

          <HashDisplay hash={calculatedHash} label="" truncate={false} highlight={true} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="secondary"
            icon={Eye}
            onClick={() => setShowPreviewModal(true)}
          >
            Preview Certificate Template
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={ShieldCheck}
              isLoading={isLoading}
            >
              Sign & Mint to Blockchain Ledger
            </Button>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Live Credential Preview"
        subtitle="Verifiable Degree Certificate format prior to blockchain minting"
        maxWidth="max-w-4xl"
      >
        <CredentialPreview
          credential={previewCredential}
          showActions={false}
        />
      </Modal>
    </>
  );
}
