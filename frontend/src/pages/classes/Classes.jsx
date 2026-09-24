import React, { useState, useEffect } from 'react';
import { classService } from '../../services/classService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { LoadingState } from '../../components/common/CommonStates';

export default function Classes() {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    section: 'A',
    room: '',
    academicYear: '2024–25',
    classTeacherName: '',
    capacity: 30,
    status: 'Active',
  });

  // Deactivate state
  const [classToDeactivate, setClassToDeactivate] = useState(null);

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const data = await classService.getClasses();
        setClasses(data);
      } catch (err) {
        showToast('Failed to load classes', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  const openAddModal = () => {
    setEditingClass(null);
    setFormData({
      className: '',
      section: 'A',
      room: 'Room 101',
      academicYear: '2024–25',
      classTeacherName: '',
      capacity: 30,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setFormData({
      className: cls.className,
      section: cls.section,
      room: cls.room || '',
      academicYear: cls.academicYear || '2024–25',
      classTeacherName: cls.classTeacherName || '',
      capacity: cls.capacity || 30,
      status: cls.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.className.trim()) {
      showToast('Class name is required', 'error');
      return;
    }

    try {
      if (editingClass) {
        const updated = await classService.updateClass(editingClass.id, formData);
        setClasses((prev) => prev.map((c) => (c.id === editingClass.id ? updated : c)));
        showToast('Class section updated', 'success');
      } else {
        const created = await classService.createClass(formData);
        setClasses((prev) => [...prev, created]);
        showToast('New class section created', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save class', 'error');
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!classToDeactivate) return;
    try {
      await classService.deactivateClass(classToDeactivate.id);
      setClasses((prev) =>
        prev.map((c) => (c.id === classToDeactivate.id ? { ...c, status: 'Inactive' } : c))
      );
      showToast(`Class ${classToDeactivate.className} - ${classToDeactivate.section} marked inactive`, 'success');
      setClassToDeactivate(null);
    } catch (err) {
      showToast('Failed to deactivate class', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Academic Class Sections
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Manage grade standards, homeroom divisions, room allocations, and faculty leads
          </p>
        </div>

        <Button
          variant="primary"
          materialIcon="add"
          onClick={openAddModal}
        >
          Create Class Section
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Loading class divisions..." />
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4">Class Standard</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Class Teacher</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#131b2e]">
                      {cls.className}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold px-2 py-0.5 rounded bg-[#f1f5f9] text-[#131b2e]">
                        Section {cls.section}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#737686]">{cls.room || 'General Hall'}</td>
                    <td className="py-3 px-4 font-medium text-[#131b2e]">
                      {cls.classTeacherName || 'Faculty Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums">
                          {cls.enrolledCount || 0} / {cls.capacity || 30}
                        </span>
                        <div className="w-12 bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2563eb]"
                            style={{
                              width: `${Math.min(
                                100,
                                (((cls.enrolledCount || 0) / (cls.capacity || 30)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#737686]">{cls.academicYear || '2024–25'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cls.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cls)}
                          className="text-[#2563eb] hover:underline font-semibold"
                        >
                          Edit
                        </button>
                        {cls.status === 'Active' && (
                          <button
                            onClick={() => setClassToDeactivate(cls)}
                            className="text-[#dc2626] hover:underline font-semibold"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Class Section' : 'Create New Class Section'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Class Grade / Standard"
            required
            value={formData.className}
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
            placeholder="e.g. Grade 4"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Section"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              options={[
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
                { value: 'D', label: 'Section D' },
              ]}
            />

            <Input
              label="Assigned Classroom"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              placeholder="e.g. Room 204"
            />
          </div>

          <Input
            label="Class Teacher / Homeroom Faculty"
            value={formData.classTeacherName}
            onChange={(e) => setFormData({ ...formData, classTeacherName: e.target.value })}
            placeholder="e.g. Mrs. Emily Vance"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Class Max Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />

            <Select
              label="Section Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active (Available for Enrollment)' },
                { value: 'Inactive', label: 'Inactive (Archived)' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Class Section
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!classToDeactivate}
        onClose={() => setClassToDeactivate(null)}
        onConfirm={handleDeactivateConfirm}
        isDanger={true}
        title="Deactivate Class Section"
        message={`Are you sure you want to deactivate ${classToDeactivate?.className} - Section ${classToDeactivate?.section}? Inactive classes cannot be assigned to newly enrolled students.`}
        confirmLabel="Deactivate Class"
      />
    </div>
  );
}
