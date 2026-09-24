import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { parentService } from '../../services/parentService';
import { feeService } from '../../services/feeService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export default function AddStudent() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    studentId: `GR-${Math.floor(1060 + Math.random() * 890)}`,
    firstName: '',
    lastName: '',
    dob: '2016-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    classId: '',
    section: 'A',
    parentId: '',
    parentName: '',
    phone: '',
    email: '',
    motherName: '',
    emergencyPhone: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    totalFee: 48000,
  });

  useEffect(() => {
    async function loadFormMeta() {
      try {
        const [activeClasses, parentList, feeList] = await Promise.all([
          classService.getClasses(true), // Rule: Only active classes can be assigned
          parentService.getParents(),
          feeService.getFeeStructures(),
        ]);
        setClasses(activeClasses);
        setParents(parentList);
        setFeeStructures(feeList);

        if (activeClasses.length > 0) {
          setFormData((prev) => ({
            ...prev,
            classId: activeClasses[0].id,
            section: activeClasses[0].section,
          }));
        }
      } catch (err) {
        showToast('Error loading class metadata', 'error');
      }
    }
    loadFormMeta();
  }, []);

  // When class changes, auto-update section & default fee
  const handleClassChange = (selectedClassId) => {
    const matchedClass = classes.find((c) => c.id === selectedClassId);
    const matchedFee = feeStructures.find((f) => f.classId === selectedClassId);
    setFormData((prev) => ({
      ...prev,
      classId: selectedClassId,
      section: matchedClass?.section || 'A',
      totalFee: matchedFee ? matchedFee.totalAnnualFee : prev.totalFee,
    }));
  };

  // When existing parent is picked, auto-populate phone, email, address
  const handleParentSelect = (parentId) => {
    if (!parentId) {
      setFormData((prev) => ({ ...prev, parentId: '' }));
      return;
    }
    const p = parents.find((item) => item.id === parentId);
    if (p) {
      setFormData((prev) => ({
        ...prev,
        parentId: p.id,
        parentName: p.parentName,
        phone: p.phone,
        email: p.email,
        address: p.address,
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.studentId.trim()) errs.studentId = 'GR / Student ID is required.';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.classId) errs.classId = 'Please select an active class section.';
    if (!formData.parentName.trim()) errs.parentName = 'Parent / Guardian name is required.';
    if (!formData.phone.trim()) errs.phone = 'Contact phone number is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct form validation errors.', 'error');
      return;
    }

    try {
      setLoading(true);
      const selectedClassObj = classes.find((c) => c.id === formData.classId);
      const payload = {
        ...formData,
        className: selectedClassObj ? `${selectedClassObj.className} - Section ${formData.section}` : '',
        classSimple: selectedClassObj ? selectedClassObj.className : '',
      };

      await studentService.createStudent(payload);
      showToast(`Student ${formData.firstName} ${formData.lastName} successfully enrolled!`, 'success');
      navigate('/students');
    } catch (err) {
      showToast(err.message || 'Failed to enroll student.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
        <div>
          <button
            onClick={() => navigate('/students')}
            className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline mb-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Students</span>
          </button>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e]">
            Enroll New Student
          </h1>
          <p className="text-xs text-[#434655]">
            Create a permanent admission record in Session 2024-25
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Academic & Identification */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#f1f5f9] pb-2">
            1. Academic & Student Identification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="GR / Student ID"
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              error={errors.studentId}
              helperText="Unique institutional registration number"
            />

            <Input
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={errors.firstName}
              placeholder="e.g. Liam"
            />

            <Input
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={errors.lastName}
              placeholder="e.g. Chen"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />

            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />

            <Select
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
              ]}
            />

            <Input
              label="Admission Date"
              type="date"
              required
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <Select
              label="Class Assignment (Active Only)"
              required
              value={formData.classId}
              onChange={(e) => handleClassChange(e.target.value)}
              error={errors.classId}
              options={classes.map((c) => ({
                value: c.id,
                label: `${c.className} - Section ${c.section} (${c.enrolledCount}/${c.capacity || 30})`,
              }))}
            />

            <Select
              label="Section"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              options={[
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
              ]}
            />

            <Input
              label="Assigned Annual Fee"
              type="number"
              value={formData.totalFee}
              onChange={(e) => setFormData({ ...formData, totalFee: e.target.value })}
              helperText="Derived from fee structure"
            />
          </div>
        </div>

        {/* Section 2: Parent & Guardian Details */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#004ac6]">
              2. Parent & Contact Details
            </h3>
            {parents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737686]">Link Existing Parent:</span>
                <select
                  value={formData.parentId}
                  onChange={(e) => handleParentSelect(e.target.value)}
                  className="px-2.5 py-1 bg-[#f8fafc] text-[#131b2e] rounded border border-[#cbd5e1] text-xs font-semibold"
                >
                  <option value="">-- Create New Guardian --</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.parentName} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Guardian Name"
              required
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              error={errors.parentName}
              placeholder="e.g. David Chen"
            />

            <Input
              label="Mother's Name (Optional)"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              placeholder="e.g. Elena Chen"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Primary Phone (SMS Alerts)"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="+91 98221 00000"
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="guardian@example.com"
            />

            <Input
              label="Emergency Phone"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              placeholder="+91 98221 11111"
            />
          </div>

          <Input
            label="Residential Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Street address, apartment, locality, city"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/students')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            materialIcon="save"
          >
            Save & Enroll Student
          </Button>
        </div>
      </form>
    </div>
  );
}
