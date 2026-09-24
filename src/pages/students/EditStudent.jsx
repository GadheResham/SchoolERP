import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { LoadingState } from '../../components/common/CommonStates';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    classId: '',
    section: 'A',
    parentName: '',
    phone: '',
    email: '',
    motherName: '',
    emergencyPhone: '',
    address: '',
    status: 'Active',
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [student, activeClasses] = await Promise.all([
          studentService.getStudentById(id),
          classService.getClasses(false),
        ]);
        setClasses(activeClasses);
        setFormData({
          studentId: student.studentId || '',
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          dob: student.dob || '',
          gender: student.gender || 'Male',
          bloodGroup: student.bloodGroup || 'O+',
          classId: student.classId || '',
          section: student.section || 'A',
          parentName: student.parentName || '',
          phone: student.phone || '',
          email: student.email || '',
          motherName: student.motherName || '',
          emergencyPhone: student.emergencyPhone || '',
          address: student.address || '',
          status: student.status || 'Active',
        });
      } catch (err) {
        showToast('Student not found', 'error');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!formData.studentId.trim()) errs.studentId = 'GR / Student ID is required.';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.parentName.trim()) errs.parentName = 'Parent name is required.';
    if (!formData.phone.trim()) errs.phone = 'Contact phone number is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const selectedClassObj = classes.find((c) => c.id === formData.classId);
      const payload = {
        ...formData,
        className: selectedClassObj ? `${selectedClassObj.className} - Section ${formData.section}` : '',
        classSimple: selectedClassObj ? selectedClassObj.className : '',
      };

      await studentService.updateStudent(id, payload);
      showToast(`Student record for ${formData.firstName} updated!`, 'success');
      navigate(`/students/${id}`);
    } catch (err) {
      showToast(err.message || 'Failed to update student.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading student profile for editing..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
        <div>
          <button
            onClick={() => navigate(`/students/${id}`)}
            className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline mb-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Profile</span>
          </button>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e]">
            Edit Student Profile
          </h1>
          <p className="text-xs text-[#434655]">
            Update demographic, class assignment, or parental contact details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#f1f5f9] pb-2">
            Student Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="GR / Student ID"
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              error={errors.studentId}
            />

            <Input
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={errors.lastName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Date of Birth"
              type="date"
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

            <Select
              label="Enrollment Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Select
              label="Class Section"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              options={classes.map((c) => ({
                value: c.id,
                label: `${c.className} - Section ${c.section} ${c.status === 'Inactive' ? '(Inactive)' : ''}`,
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
          </div>
        </div>

        {/* Parent & Contact Details */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#f1f5f9] pb-2">
            Parent & Emergency Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Parent / Guardian Name"
              required
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              error={errors.parentName}
            />

            <Input
              label="Mother's Name"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Primary Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Emergency Phone"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
            />
          </div>

          <Input
            label="Residential Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/students/${id}`)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            materialIcon="save"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
