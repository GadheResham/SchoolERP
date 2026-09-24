import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { SearchBar, LoadingState } from '../../components/common/CommonStates';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export default function Parents() {
  const { showToast } = useToast();
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    occupation: '',
    address: '',
    alternateContact: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [parentList, studentList] = await Promise.all([
          parentService.getParents(),
          studentService.getStudents(),
        ]);
        setParents(parentList);
        setStudents(studentList);
      } catch (err) {
        showToast('Failed to load parents', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingParent(null);
    setFormData({
      parentName: '',
      phone: '+91 ',
      email: '',
      occupation: '',
      address: '',
      alternateContact: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingParent(p);
    setFormData({
      parentName: p.parentName,
      phone: p.phone,
      email: p.email || '',
      occupation: p.occupation || '',
      address: p.address || '',
      alternateContact: p.alternateContact || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.parentName.trim() || !formData.phone.trim()) {
      showToast('Parent name and phone are required', 'error');
      return;
    }

    try {
      if (editingParent) {
        const updated = await parentService.updateParent(editingParent.id, formData);
        setParents((prev) => prev.map((p) => (p.id === editingParent.id ? updated : p)));
        showToast('Parent record updated', 'success');
      } else {
        const created = await parentService.createParent(formData);
        setParents((prev) => [created, ...prev]);
        showToast('New guardian record added', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Failed to save parent record', 'error');
    }
  };

  const filtered = parents.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.parentName?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Parents & Guardians Directory
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Centralized registry of authorized primary emergency contacts and family records
          </p>
        </div>

        <Button
          variant="primary"
          materialIcon="person_add"
          onClick={openAddModal}
        >
          Add Guardian
        </Button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by parent name, phone number, email, or address..."
        />
      </div>

      {loading ? (
        <LoadingState message="Loading parents registry..." />
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4">Guardian Name</th>
                  <th className="py-3 px-4">Primary Phone (SMS)</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Profession / Title</th>
                  <th className="py-3 px-4">Enrolled Children</th>
                  <th className="py-3 px-4">Residential Address</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.map((parent) => {
                  const children = students.filter(
                    (s) => s.parentId === parent.id || s.parentName === parent.parentName
                  );

                  return (
                    <tr key={parent.id} className="hover:bg-[#faf8ff] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#131b2e]">
                        {parent.parentName}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#131b2e] font-medium">
                        {parent.phone}
                      </td>
                      <td className="py-3 px-4 text-[#737686]">
                        {parent.email || '-'}
                      </td>
                      <td className="py-3 px-4 text-[#434655]">
                        {parent.occupation || 'Private Service'}
                      </td>
                      <td className="py-3 px-4">
                        {children.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {children.map((c) => (
                              <span
                                key={c.id}
                                className="px-1.5 py-0.5 rounded bg-[#eaedff] text-[#004ac6] text-[10px] font-bold"
                              >
                                {c.fullName} ({c.classSimple})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#94a3b8] text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#737686] max-w-xs truncate">
                        {parent.address || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openEditModal(parent)}
                          className="text-[#2563eb] hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingParent ? 'Edit Guardian Details' : 'Register New Guardian'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Guardian Full Name"
            required
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            placeholder="e.g. David Chen"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primary Contact Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98221 00000"
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="parent@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Occupation / Profession"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              placeholder="e.g. Architect"
            />

            <Input
              label="Alternate Contact / Relation"
              value={formData.alternateContact}
              onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
              placeholder="e.g. Elena Chen (Mother)"
            />
          </div>

          <Input
            label="Residential Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Complete street address"
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Guardian Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
