import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { paymentService } from '../../services/paymentService';
import { attendanceService } from '../../services/attendanceService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/CommonStates';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // profile, fees, attendance

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        const data = await studentService.getStudentById(id);
        setStudent(data);

        // Fetch related payments & attendance
        const [paymentList, attendanceList] = await Promise.all([
          paymentService.getPayments({ studentId: data.id }),
          attendanceService.getAttendanceHistory({ student: data.fullName }),
        ]);
        setPayments(paymentList);
        setAttendanceHistory(attendanceList);
      } catch (err) {
        showToast('Student record not found.', 'error');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    }
    loadStudent();
  }, [id]);

  if (loading || !student) {
    return <LoadingState message="Loading student dossier..." />;
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Students Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            materialIcon="print"
            onClick={() => window.print()}
          >
            Print Dossier
          </Button>
          <Button
            variant="secondary"
            size="sm"
            materialIcon="edit"
            onClick={() => navigate(`/students/edit/${student.id}`)}
          >
            Edit Record
          </Button>
          {student.pendingFee > 0 && (
            <Button
              variant="primary"
              size="sm"
              materialIcon="payments"
              onClick={() => navigate(`/fees/collection?studentId=${student.id}`)}
            >
              Collect Fee
            </Button>
          )}
        </div>
      </div>

      {/* Top Student Banner Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#e2e8f0]"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#eaedff] text-[#004ac6] font-bold text-2xl flex items-center justify-center">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-headline text-3xl font-semibold text-[#131b2e]">
                {student.fullName}
              </h1>
              <StatusBadge status={student.status} />
              <StatusBadge status={student.feeStatus} />
            </div>

            <div className="flex items-center gap-3 text-xs text-[#434655] mt-1.5 flex-wrap font-medium">
              <span className="font-mono font-bold bg-[#f1f5f9] px-2 py-0.5 rounded text-[#131b2e]">
                {student.studentId}
              </span>
              <span>•</span>
              <span className="text-[#004ac6] font-bold">
                {student.className || `${student.classSimple} - Section ${student.section}`}
              </span>
              <span>•</span>
              <span>Session {student.academicYear || '2024–25'}</span>
              <span>•</span>
              <span>Admitted: {formatDate(student.admissionDate)}</span>
            </div>
          </div>
        </div>

        {/* Quick Contact Badge */}
        <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] text-xs space-y-1 w-full md:w-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
            Primary Guardian
          </div>
          <div className="font-bold text-[#131b2e]">{student.parentName}</div>
          <div className="text-[#434655] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">call</span>
            <span>{student.phone}</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#737686] font-bold">
            Attendance Rate
          </span>
          <div className="font-headline text-2xl font-bold text-[#131b2e] mt-1 tabular-nums">
            {student.attendanceRate}%
          </div>
          <div className="text-[11px] text-[#059669] font-medium mt-0.5">
            Good Standing (Min: 75%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#737686] font-bold">
            Total Annual Fee
          </span>
          <div className="font-headline text-2xl font-bold text-[#131b2e] mt-1 tabular-nums">
            {formatCurrency(student.totalFee)}
          </div>
          <div className="text-[11px] text-[#737686] mt-0.5">Session 2024-25</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#737686] font-bold">
            Paid to Date
          </span>
          <div className="font-headline text-2xl font-bold text-[#059669] mt-1 tabular-nums">
            {formatCurrency(student.paidFee)}
          </div>
          <div className="text-[11px] text-[#059669] font-medium mt-0.5">
            {((student.paidFee / (student.totalFee || 1)) * 100).toFixed(0)}% Cleared
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#737686] font-bold">
            Pending Balance
          </span>
          <div
            className={`font-headline text-2xl font-bold mt-1 tabular-nums ${
              student.pendingFee > 0 ? 'text-[#dc2626]' : 'text-[#059669]'
            }`}
          >
            {formatCurrency(student.pendingFee)}
          </div>
          <div className="text-[11px] text-[#737686] mt-0.5">
            {student.overdueDays > 0 ? `${student.overdueDays} days overdue` : 'No overdue fine'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e2e8f0] flex items-center gap-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'profile'
              ? 'text-[#2563eb]'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Demographic & Family Dossier
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb]"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'fees'
              ? 'text-[#2563eb]'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Fee Ledger & Receipts ({payments.length})
          {activeTab === 'fees' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb]"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'attendance'
              ? 'text-[#2563eb]'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Attendance Log
          {activeTab === 'attendance' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb]"></span>
          )}
        </button>
      </div>

      {/* Tab 1: Profile & Family Dossier */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004ac6]">
              Student Academic & Medical Information
            </h3>
            <div className="divide-y divide-[#f1f5f9] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Date of Birth</span>
                <span className="font-semibold text-[#131b2e]">{formatDate(student.dob)}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Gender</span>
                <span className="font-semibold text-[#131b2e]">{student.gender}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Blood Group</span>
                <span className="font-semibold text-[#131b2e]">{student.bloodGroup || 'O+'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Admission Date</span>
                <span className="font-semibold text-[#131b2e]">{formatDate(student.admissionDate)}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Class Section</span>
                <span className="font-semibold text-[#131b2e]">
                  {student.className || `${student.classSimple} - ${student.section}`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004ac6]">
              Guardian & Residential Information
            </h3>
            <div className="divide-y divide-[#f1f5f9] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Primary Guardian</span>
                <span className="font-semibold text-[#131b2e]">{student.parentName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Mother's Name</span>
                <span className="font-semibold text-[#131b2e]">{student.motherName || '-'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Primary Phone (SMS)</span>
                <span className="font-semibold text-[#131b2e] font-mono">{student.phone}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Email Address</span>
                <span className="font-semibold text-[#131b2e]">{student.email || '-'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Emergency Phone</span>
                <span className="font-semibold text-[#131b2e] font-mono">{student.emergencyPhone || student.phone}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#737686]">Address</span>
                <span className="font-semibold text-[#131b2e] text-right max-w-xs">{student.address || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fee Ledger & Receipts */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h3 className="font-headline text-lg font-semibold text-[#131b2e]">
              Official Fee Payment Receipts
            </h3>
            {student.pendingFee > 0 && (
              <Button
                variant="primary"
                size="sm"
                materialIcon="add"
                onClick={() => navigate(`/fees/collection?studentId=${student.id}`)}
              >
                Record Payment
              </Button>
            )}
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737686]">
              No fee payment receipts recorded yet for this student.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Remarks</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf8ff]">
                    <td className="py-3 px-4 font-mono font-bold text-[#004ac6]">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4">{formatDate(p.paymentDate)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#f1f5f9] font-medium text-[#131b2e]">
                        {p.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#737686]">{p.transactionRef}</td>
                    <td className="py-3 px-4 text-[#434655]">{p.remarks}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#059669] tabular-nums">
                      {formatCurrency(p.amountPaid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 3: Attendance Log */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-lg font-semibold text-[#131b2e]">
              Recent Daily Attendance Records
            </h3>
            <Button
              variant="secondary"
              size="sm"
              materialIcon="calendar_today"
              onClick={() => navigate('/attendance/history')}
            >
              Full School History
            </Button>
          </div>

          <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-2.5 px-4">Session Date</th>
                  <th className="py-2.5 px-4">Roll Status</th>
                  <th className="py-2.5 px-4">Remarks / Excuse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#faf8ff]">
                      <td className="py-2.5 px-4 font-medium">{formatDate(item.date)}</td>
                      <td className="py-2.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-2.5 px-4 text-[#737686]">{item.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-center text-[#737686]">
                      Present in all standard class sessions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
