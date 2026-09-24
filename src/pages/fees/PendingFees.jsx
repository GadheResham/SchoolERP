import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Button } from '../../components/common/Button';
import { SearchBar, LoadingState } from '../../components/common/CommonStates';
import { formatCurrency } from '../../utils/formatters';

export default function PendingFees() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const allStudents = await studentService.getStudents();
        const pendingList = allStudents.filter((s) => s.pendingFee > 0);
        setStudents(pendingList);
      } catch (err) {
        console.error('Error loading pending dues', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.parentName?.toLowerCase().includes(q) ||
      s.phone?.includes(q)
    );
  });

  const totalOutstanding = filtered.reduce((sum, s) => sum + (s.pendingFee || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/fees')}
            className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline mb-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Fee Structures</span>
          </button>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Pending Fee Defaulters
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Active students with overdue and partial tuition fees requiring collection follow-up
          </p>
        </div>

        <Button
          variant="primary"
          materialIcon="payments"
          onClick={() => navigate('/fees/collection')}
        >
          Collect Fee
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fef2f2] p-4 rounded-xl border border-[#fecaca] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
            Total Outstanding Balance
          </span>
          <div className="font-headline text-3xl font-bold text-[#b91c1c] mt-1 tabular-nums">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="text-[11px] text-[#dc2626] mt-0.5">Across all classes</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737686]">
            Total Pupils with Dues
          </span>
          <div className="font-headline text-3xl font-bold text-[#131b2e] mt-1 tabular-nums">
            {filtered.length} Students
          </div>
          <div className="text-[11px] text-[#737686] mt-0.5">Requiring fee collection</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737686]">
            Billing Session
          </span>
          <div className="font-headline text-3xl font-bold text-[#004ac6] mt-1">
            Term II • 2024–25
          </div>
          <div className="text-[11px] text-[#737686] mt-0.5">Due date passed on Oct 1st</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by pupil name, parent, phone, or GR number..."
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Loading pending dues..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] text-center text-xs text-[#737686]">
          No students currently have overdue fees matching this criteria!
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Guardian & Phone</th>
                  <th className="py-3 px-4 text-right">Total Fee</th>
                  <th className="py-3 px-4 text-right">Paid So Far</th>
                  <th className="py-3 px-4 text-right">Pending Due</th>
                  <th className="py-3 px-4 text-center">Overdue Days</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131b2e]">{s.fullName}</div>
                      <div className="text-[11px] font-mono text-[#737686]">{s.studentId}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#131b2e]">
                      {s.classSimple} - {s.section}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#131b2e] font-semibold">{s.parentName}</div>
                      <div className="text-[11px] text-[#737686]">{s.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#737686]">
                      {formatCurrency(s.totalFee)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#059669]">
                      {formatCurrency(s.paidFee)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#dc2626] tabular-nums text-sm">
                      {formatCurrency(s.pendingFee)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-[#fef2f2] text-[#b91c1c] font-bold text-[10px]">
                        {s.overdueDays > 0 ? `${s.overdueDays} Days` : 'Due Now'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        materialIcon="payments"
                        onClick={() => navigate(`/fees/collection?studentId=${s.id}`)}
                      >
                        Collect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
