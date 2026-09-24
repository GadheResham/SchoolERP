import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeService } from '../../services/feeService';
import { classService } from '../../services/classService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { LoadingState } from '../../components/common/CommonStates';
import { formatCurrency } from '../../utils/formatters';

export default function FeeStructure() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [feeStructures, setFeeStructures] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for Add/Edit Fee Structure
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    academicYear: '2024–25',
    baseTuition: 40000,
    labTechFee: 8000,
    billingCycle: 'Quarterly',
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [fees, classList] = await Promise.all([
          feeService.getFeeStructures(),
          classService.getClasses(),
        ]);
        setFeeStructures(fees);
        setClasses(classList);
        if (classList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            classId: classList[0].id,
            className: classList[0].className,
          }));
        }
      } catch (err) {
        showToast('Failed to load fee structures', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      classId: classes[0]?.id || '',
      className: classes[0]?.className || 'Grade 1',
      academicYear: '2024–25',
      baseTuition: 38000,
      labTechFee: 6000,
      billingCycle: 'Quarterly',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (fee) => {
    setEditingId(fee.id);
    setFormData({
      classId: fee.classId,
      className: fee.className,
      academicYear: fee.academicYear || '2024–25',
      baseTuition: fee.baseTuition,
      labTechFee: fee.labTechFee,
      billingCycle: fee.billingCycle || 'Quarterly',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await feeService.updateFeeStructure(editingId, formData);
        setFeeStructures((prev) => prev.map((f) => (f.id === editingId ? updated : f)));
        showToast('Fee structure updated successfully', 'success');
      } else {
        const created = await feeService.createFeeStructure(formData);
        setFeeStructures((prev) => [...prev, created]);
        showToast('New fee structure added', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save fee structure', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Class Fee Schedules
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Standard tuition benchmarks, lab surcharges, and billing installments for Session 2024-25
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            materialIcon="payments"
            onClick={() => navigate('/fees/collection')}
          >
            Collect Fees
          </Button>
          <Button
            variant="secondary"
            materialIcon="pending_actions"
            onClick={() => navigate('/fees/pending')}
          >
            Pending Defaulters
          </Button>
          <Button
            variant="primary"
            materialIcon="add"
            onClick={openAddModal}
          >
            Define Fee Tier
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading fee structures..." />
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4">Class Standard</th>
                  <th className="py-3 px-4">Academic Period</th>
                  <th className="py-3 px-4">Base Tuition</th>
                  <th className="py-3 px-4">Lab & Tech Surcharge</th>
                  <th className="py-3 px-4">Total Annual Fee</th>
                  <th className="py-3 px-4">Billing Schedule</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {feeStructures.map((fee) => (
                  <tr key={fee.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#131b2e]">
                      {fee.className}
                    </td>
                    <td className="py-3 px-4 text-[#737686]">
                      {fee.academicYear || '2024–25'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#131b2e]">
                      {formatCurrency(fee.baseTuition)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#737686]">
                      {formatCurrency(fee.labTechFee)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#004ac6] text-sm tabular-nums">
                      {formatCurrency(fee.totalAnnualFee)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#131b2e] font-semibold">
                        {fee.billingCycle || 'Quarterly'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEditModal(fee)}
                        className="text-[#2563eb] hover:underline font-semibold"
                      >
                        Modify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modify Class Fee Structure' : 'Define New Class Fee Structure'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Class Grade / Name"
            required
            value={formData.className}
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
            placeholder="e.g. Grade 4"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Base Tuition (₹)"
              type="number"
              required
              value={formData.baseTuition}
              onChange={(e) => setFormData({ ...formData, baseTuition: e.target.value })}
            />

            <Input
              label="Lab & Tech Fee (₹)"
              type="number"
              required
              value={formData.labTechFee}
              onChange={(e) => setFormData({ ...formData, labTechFee: e.target.value })}
            />
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex justify-between items-center text-xs">
            <span className="font-semibold text-[#434655]">Calculated Total Annual Package:</span>
            <span className="font-headline text-lg font-bold text-[#004ac6] tabular-nums">
              {formatCurrency(
                (Number(formData.baseTuition) || 0) + (Number(formData.labTechFee) || 0)
              )}
            </span>
          </div>

          <Select
            label="Billing Frequency"
            value={formData.billingCycle}
            onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
            options={[
              { value: 'Quarterly', label: 'Quarterly (4 installments)' },
              { value: 'Biannual', label: 'Biannual (2 installments)' },
              { value: 'Annual', label: 'Annual (Single payment)' },
            ]}
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
              Save Fee Structure
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
