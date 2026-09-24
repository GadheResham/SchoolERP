import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { paymentService } from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/CommonStates';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function FeeCollection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(searchParams.get('studentId') || '');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [remarks, setRemarks] = useState('Tuition fee installment');
  const [amountError, setAmountError] = useState('');

  // Generated receipt modal
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const list = await studentService.getStudents();
        setStudents(list);

        const initialId = searchParams.get('studentId');
        if (initialId) {
          const match = list.find((s) => s.id === initialId);
          if (match) {
            setSelectedStudent(match);
            setSelectedStudentId(match.id);
            setAmountPaid(String(match.pendingFee));
          }
        } else if (list.length > 0) {
          const firstWithPending = list.find((s) => s.pendingFee > 0) || list[0];
          setSelectedStudent(firstWithPending);
          setSelectedStudentId(firstWithPending.id);
          setAmountPaid(String(firstWithPending.pendingFee));
        }
      } catch (err) {
        showToast('Failed to load student list', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [searchParams]);

  const handleStudentSelect = (id) => {
    setSelectedStudentId(id);
    const stu = students.find((s) => s.id === id);
    setSelectedStudent(stu || null);
    if (stu) {
      setAmountPaid(String(stu.pendingFee));
      setAmountError('');
    }
  };

  const handleAmountChange = (val) => {
    setAmountPaid(val);
    const num = Number(val);
    if (!num || num <= 0) {
      setAmountError('Please enter a positive amount.');
    } else if (selectedStudent && num > selectedStudent.pendingFee) {
      setAmountError(`Cannot exceed pending balance of ${formatCurrency(selectedStudent.pendingFee)}.`);
    } else {
      setAmountError('');
    }
  };

  const handleSetQuickAmount = (amount) => {
    if (!selectedStudent) return;
    const capped = Math.min(amount, selectedStudent.pendingFee);
    setAmountPaid(String(capped));
    setAmountError('');
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    const num = Number(amountPaid);

    if (!selectedStudent) {
      showToast('Please select a student.', 'error');
      return;
    }
    if (!num || num <= 0) {
      setAmountError('Please enter a valid payment amount.');
      return;
    }
    if (num > selectedStudent.pendingFee) {
      setAmountError(`Payment amount cannot exceed pending balance of ${formatCurrency(selectedStudent.pendingFee)}.`);
      return;
    }

    try {
      setSubmitting(true);
      const receipt = await paymentService.recordPayment({
        studentId: selectedStudent.id,
        amountPaid: num,
        paymentDate,
        paymentMode,
        transactionRef: transactionRef || (paymentMode === 'Cash' ? 'CASH-COUNTER' : 'REF-' + Date.now()),
        remarks,
      });

      // Refresh student data
      const updatedStudent = await studentService.getStudentById(selectedStudent.id);
      setSelectedStudent(updatedStudent);
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );

      setGeneratedReceipt(receipt);
      showToast(`Receipt ${receipt.receiptNumber} generated!`, 'success');
    } catch (err) {
      showToast(err.message || 'Payment processing failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading fee counter..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Fee Collection Counter
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Counter receipts, online transfers, and student ledger reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            materialIcon="history"
            onClick={() => navigate('/payments')}
          >
            Payment Logs
          </Button>
          <Button
            variant="secondary"
            materialIcon="receipt_long"
            onClick={() => navigate('/fees')}
          >
            Fee Schedules
          </Button>
        </div>
      </div>

      {/* Grid: Student Selection & Ledger + Payment Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Selection & Financial Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004ac6]">
              1. Select Student
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#434655]">
                Search / Select Pupil Roster
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentId}) — {s.classSimple} — Pending: {formatCurrency(s.pendingFee)}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="p-4 bg-[#faf8ff] rounded-xl border border-[#e2e8f0] space-y-4">
                <div className="flex items-center gap-3">
                  {selectedStudent.avatar ? (
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.fullName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#cbd5e1]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#eaedff] text-[#004ac6] font-bold text-base flex items-center justify-center">
                      {selectedStudent.firstName[0]}
                      {selectedStudent.lastName[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-[#131b2e] text-sm">{selectedStudent.fullName}</h4>
                    <span className="text-xs text-[#737686] font-mono block">
                      {selectedStudent.studentId} • {selectedStudent.className || `${selectedStudent.classSimple} - ${selectedStudent.section}`}
                    </span>
                    <span className="text-[11px] text-[#434655]">
                      Guardian: {selectedStudent.parentName} ({selectedStudent.phone})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e2e8f0] text-center">
                  <div className="bg-white p-2 rounded-lg border border-[#e2e8f0]">
                    <span className="text-[10px] text-[#737686] block font-bold uppercase">Total</span>
                    <span className="font-bold text-xs text-[#131b2e] tabular-nums">
                      {formatCurrency(selectedStudent.totalFee)}
                    </span>
                  </div>

                  <div className="bg-[#ecfdf5] p-2 rounded-lg border border-[#a7f3d0]">
                    <span className="text-[10px] text-[#047857] block font-bold uppercase">Paid</span>
                    <span className="font-bold text-xs text-[#047857] tabular-nums">
                      {formatCurrency(selectedStudent.paidFee)}
                    </span>
                  </div>

                  <div className="bg-[#fef2f2] p-2 rounded-lg border border-[#fecaca]">
                    <span className="text-[10px] text-[#b91c1c] block font-bold uppercase">Pending</span>
                    <span className="font-bold text-xs text-[#b91c1c] tabular-nums">
                      {formatCurrency(selectedStudent.pendingFee)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Collection Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmitPayment}
            className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-5"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#f1f5f9] pb-2">
              2. Transaction Details
            </h3>

            {/* Amount Field with Quick Preset Chips */}
            <div className="space-y-2">
              <Input
                label="Amount Paid (₹)"
                type="number"
                required
                value={amountPaid}
                onChange={(e) => handleAmountChange(e.target.value)}
                error={amountError}
                placeholder="Enter amount in ₹"
                materialIcon="payments"
              />

              {selectedStudent && selectedStudent.pendingFee > 0 && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-[#737686]">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSetQuickAmount(selectedStudent.pendingFee)}
                    className="px-2.5 py-1 rounded bg-[#eaedff] text-[#004ac6] text-xs font-bold hover:bg-[#dbe1ff] transition-colors"
                  >
                    Full Balance ({formatCurrency(selectedStudent.pendingFee)})
                  </button>
                  {selectedStudent.pendingFee > 10000 && (
                    <button
                      type="button"
                      onClick={() => handleSetQuickAmount(Math.round(selectedStudent.pendingFee / 2))}
                      className="px-2.5 py-1 rounded bg-[#f1f5f9] text-[#131b2e] text-xs font-bold hover:bg-[#e2e8f0] transition-colors"
                    >
                      50% ({formatCurrency(Math.round(selectedStudent.pendingFee / 2))})
                    </button>
                  )}
                  {selectedStudent.pendingFee >= 10000 && (
                    <button
                      type="button"
                      onClick={() => handleSetQuickAmount(10000)}
                      className="px-2.5 py-1 rounded bg-[#f1f5f9] text-[#131b2e] text-xs font-bold hover:bg-[#e2e8f0] transition-colors"
                    >
                      ₹10,000
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date of Payment"
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                materialIcon="calendar_today"
              />

              <Select
                label="Payment Mode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                options={[
                  { value: 'Cash', label: 'Cash (Counter)' },
                  { value: 'UPI', label: 'UPI / QR Code (GPay, PhonePe)' },
                  { value: 'Bank Transfer', label: 'Bank Transfer (NEFT/IMPS)' },
                  { value: 'Cheque', label: 'Cheque' },
                  { value: 'Card', label: 'POS Debit/Credit Card' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Transaction / Reference ID"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder={paymentMode === 'Cash' ? 'Auto-generated counter ref' : 'e.g. UTR-88129031'}
                helperText="Leave empty to auto-generate"
              />

              <Input
                label="Accounting Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Term II installment clearance"
              />
            </div>

            <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/students')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                disabled={!selectedStudent || selectedStudent.pendingFee === 0}
                materialIcon="receipt"
              >
                {selectedStudent?.pendingFee === 0
                  ? 'Fee Already Cleared'
                  : 'Record Payment & Issue Receipt'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <Modal
        isOpen={!!generatedReceipt}
        onClose={() => setGeneratedReceipt(null)}
        title="Official Payment Receipt"
        maxWidth="max-w-lg"
      >
        {generatedReceipt && (
          <div className="space-y-4 text-xs">
            {/* School Header */}
            <div className="text-center border-b border-[#e2e8f0] pb-3">
              <h2 className="font-headline text-xl font-bold text-[#131b2e]">
                St. Jude International Academy
              </h2>
              <p className="text-[11px] text-[#737686]">
                CBSE Affiliation No. 882194 • Academic District, Pune
              </p>
              <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#ecfdf5] text-[#047857] font-bold text-[10px] uppercase">
                Official Tuition Fee Receipt
              </div>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-3 bg-[#faf8ff] p-3 rounded-lg border border-[#e2e8f0]">
              <div>
                <span className="text-[#737686] block text-[10px]">Receipt Number</span>
                <span className="font-mono font-bold text-sm text-[#004ac6]">
                  {generatedReceipt.receiptNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#737686] block text-[10px]">Date & Time</span>
                <span className="font-semibold text-[#131b2e]">
                  {formatDate(generatedReceipt.paymentDate)} • {generatedReceipt.paymentTime}
                </span>
              </div>
              <div>
                <span className="text-[#737686] block text-[10px]">Student Name</span>
                <span className="font-bold text-[#131b2e]">{generatedReceipt.studentName}</span>
              </div>
              <div className="text-right">
                <span className="text-[#737686] block text-[10px]">Class Standard</span>
                <span className="font-semibold text-[#131b2e]">{generatedReceipt.className}</span>
              </div>
            </div>

            {/* Ledger Line */}
            <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
              <div className="bg-[#f8fafc] px-3 py-2 flex justify-between font-bold text-[#737686] uppercase text-[10px]">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="px-3 py-2.5 flex justify-between items-center text-[#131b2e]">
                <div>
                  <div className="font-semibold">{generatedReceipt.remarks || 'Tuition Fee Installment'}</div>
                  <div className="text-[10px] text-[#737686]">
                    Mode: {generatedReceipt.paymentMode} • Ref: {generatedReceipt.transactionRef}
                  </div>
                </div>
                <div className="font-headline text-base font-bold text-[#059669] tabular-nums">
                  {formatCurrency(generatedReceipt.amountPaid)}
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-[10px] text-[#737686] pt-2">
              This is a computer-generated institutional receipt. No physical signature is required.
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
              <Button
                variant="secondary"
                materialIcon="print"
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
              <Button
                variant="primary"
                onClick={() => setGeneratedReceipt(null)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
