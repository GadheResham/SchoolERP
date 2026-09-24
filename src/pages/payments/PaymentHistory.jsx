import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { Button } from '../../components/common/Button';
import { SearchBar, LoadingState } from '../../components/common/CommonStates';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [viewReceipt, setViewReceipt] = useState(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        const data = await paymentService.getPayments();
        setPayments(data);
      } catch (err) {
        console.error('Failed to load payments', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const filtered = payments.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const matchRec = p.receiptNumber?.toLowerCase().includes(q);
      const matchStu = p.studentName?.toLowerCase().includes(q);
      const matchRef = p.transactionRef?.toLowerCase().includes(q);
      if (!matchRec && !matchStu && !matchRef) return false;
    }
    if (selectedMode && p.paymentMode !== selectedMode) {
      return false;
    }
    return true;
  });

  const totalSum = filtered.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Payment History & Receipts
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Official chronological register of all school fees collected across all payment channels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            materialIcon="print"
            onClick={() => window.print()}
          >
            Export Ledger
          </Button>
          <Button
            variant="primary"
            materialIcon="add"
            onClick={() => navigate('/fees/collection')}
          >
            Record New Payment
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by receipt number, student name, or transaction reference..."
          />
        </div>

        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          className="px-3 py-2 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
        >
          <option value="">All Payment Modes</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI / GPay</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
          <option value="Card">Card (POS)</option>
        </select>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <LoadingState message="Loading payment transactions..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] text-center text-xs text-[#737686]">
          No payment records found matching your filters.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Student & Class</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#004ac6]">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131b2e]">{p.studentName}</div>
                      <div className="text-[11px] text-[#737686]">{p.className}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#131b2e] font-medium">{formatDate(p.paymentDate)}</div>
                      <div className="text-[10px] text-[#737686]">{p.paymentTime}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#f1f5f9] font-medium text-[#131b2e]">
                        {p.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#737686]">
                      {p.transactionRef}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#059669] tabular-nums text-sm">
                      {formatCurrency(p.amountPaid)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setViewReceipt(p)}
                        className="text-[#2563eb] hover:underline font-semibold"
                      >
                        Reprint
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f8fafc] border-t border-[#e2e8f0] font-bold text-xs">
                <tr>
                  <td colSpan={5} className="py-3 px-4 text-right uppercase tracking-wider text-[#434655]">
                    Total Filtered Revenue:
                  </td>
                  <td className="py-3 px-4 text-right font-headline text-base text-[#059669] tabular-nums">
                    {formatCurrency(totalSum)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      <Modal
        isOpen={!!viewReceipt}
        onClose={() => setViewReceipt(null)}
        title="Official Receipt Voucher"
      >
        {viewReceipt && (
          <div className="space-y-4 text-xs">
            <div className="text-center border-b border-[#e2e8f0] pb-3">
              <h2 className="font-headline text-xl font-bold text-[#131b2e]">
                St. Jude International Academy
              </h2>
              <p className="text-[11px] text-[#737686]">CBSE Affiliation No. 882194</p>
              <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#ecfdf5] text-[#047857] font-bold text-[10px] uppercase">
                Payment Verification Receipt
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#faf8ff] p-3 rounded-lg border border-[#e2e8f0]">
              <div>
                <span className="text-[#737686] block text-[10px]">Receipt Voucher</span>
                <span className="font-mono font-bold text-[#004ac6] text-sm">
                  {viewReceipt.receiptNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#737686] block text-[10px]">Payment Date</span>
                <span className="font-semibold">{formatDate(viewReceipt.paymentDate)}</span>
              </div>
              <div>
                <span className="text-[#737686] block text-[10px]">Pupil Name</span>
                <span className="font-bold text-[#131b2e]">{viewReceipt.studentName}</span>
              </div>
              <div className="text-right">
                <span className="text-[#737686] block text-[10px]">Class / Division</span>
                <span>{viewReceipt.className}</span>
              </div>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex justify-between items-center">
              <div>
                <div className="font-bold text-[#131b2e]">{viewReceipt.remarks || 'Tuition Fee Payment'}</div>
                <div className="text-[10px] text-[#737686]">
                  Mode: {viewReceipt.paymentMode} • Ref: {viewReceipt.transactionRef}
                </div>
              </div>
              <div className="font-headline text-lg font-bold text-[#059669] tabular-nums">
                {formatCurrency(viewReceipt.amountPaid)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
              <Button
                variant="secondary"
                materialIcon="print"
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button
                variant="primary"
                onClick={() => setViewReceipt(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
