import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { paymentService } from '../../services/paymentService';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [studentList, classList, paymentList] = await Promise.all([
          studentService.getStudents(),
          classService.getClasses(),
          paymentService.getPayments(),
        ]);
        setStudents(studentList);
        setClasses(classList);
        setPayments(paymentList);
      } catch (err) {
        console.error('Failed loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalEnrolled = students.filter((s) => s.status === 'Active').length;
  const activeClasses = classes.filter((c) => c.status === 'Active').length;

  const totalFeeExpected = students.reduce((sum, s) => sum + (s.totalFee || 0), 0);
  const totalFeeCollected = students.reduce((sum, s) => sum + (s.paidFee || 0), 0);
  const totalFeePending = totalFeeExpected - totalFeeCollected;
  const feeRealizationRate = totalFeeExpected > 0 ? ((totalFeeCollected / totalFeeExpected) * 100).toFixed(1) : 0;

  // Alerts: Defaulters or attendance warnings
  const alerts = [
    {
      id: 1,
      type: 'warning',
      icon: 'warning',
      title: 'Consecutive Absence Alert',
      desc: 'Marcus Sterling (Grade 3-A) has been marked absent for 2 consecutive days.',
      time: 'Today 09:15 AM',
      action: () => navigate('/attendance'),
    },
    {
      id: 2,
      type: 'danger',
      icon: 'payments',
      title: 'Tuition Fee Overdue Alert',
      desc: '3 students in Grade 3 have overdue fee balances totaling ₹96,000.',
      time: 'Term II Billing',
      action: () => navigate('/fees/pending'),
    },
    {
      id: 3,
      type: 'success',
      icon: 'check_circle',
      title: 'Morning Roll Call Complete',
      desc: '11 out of 11 active class sections have locked and submitted daily attendance.',
      time: '08:45 AM',
      action: () => navigate('/attendance'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Academic Overview
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Term II • Week 12 • Real-time operational and financial summary across all grades
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            materialIcon="download"
            onClick={() => navigate('/reports')}
          >
            Export Logs
          </Button>
          <Button
            variant="primary"
            materialIcon="event_available"
            onClick={() => navigate('/attendance')}
          >
            Take Roll Call
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Enrolled"
          value={totalEnrolled}
          badgeText="+12.4% vs LY"
          badgeType="positive"
          subtitle={`${Math.round((totalEnrolled / 520) * 100)}% of 520 max capacity`}
          progress={(totalEnrolled / 520) * 100}
          footerLeft="Active Records"
          footerRight={`${totalEnrolled} Pupils`}
          onClick={() => navigate('/students')}
        />

        <KpiCard
          title="Class Sections"
          value={`${activeClasses} Active`}
          badgeText="Fully Staffed"
          badgeType="neutral"
          subtitle="Pre-K through Grade 10"
          progress={100}
          footerLeft="Avg Class Size"
          footerRight={`${(totalEnrolled / (activeClasses || 1)).toFixed(1)} Pupils`}
          onClick={() => navigate('/classes')}
        />

        <KpiCard
          title="Today's Attendance"
          value="94.6%"
          badgeText="Above Target"
          badgeType="positive"
          subtitle="456 Present • 26 Absent"
          progress={94.6}
          footerLeft="School Target"
          footerRight="92.0% min"
          onClick={() => navigate('/attendance')}
        />

        <KpiCard
          title="Fee Realization"
          value={`${feeRealizationRate}%`}
          badgeText="Term II"
          badgeType={Number(feeRealizationRate) > 75 ? 'positive' : 'warning'}
          subtitle={`${formatCurrency(totalFeePending)} Pending`}
          progress={Number(feeRealizationRate)}
          footerLeft="Collected"
          footerRight={formatCurrency(totalFeeCollected)}
          onClick={() => navigate('/fees')}
        />
      </div>

      {/* Main Grid: Quick Action Cards + Recent Payments + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Student Roster & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Bar */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#737686] mb-3">
              Administrative Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/students/new')}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#faf8ff] hover:bg-[#eaedff] text-[#131b2e] border border-[#e2e8f0] transition-colors group text-center"
              >
                <div className="w-9 h-9 rounded-lg bg-[#2563eb]/10 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors mb-2">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <span className="text-xs font-bold">Admit Student</span>
                <span className="text-[10px] text-[#737686]">Enroll new record</span>
              </button>

              <button
                onClick={() => navigate('/attendance')}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#faf8ff] hover:bg-[#eaedff] text-[#131b2e] border border-[#e2e8f0] transition-colors group text-center"
              >
                <div className="w-9 h-9 rounded-lg bg-[#059669]/10 text-[#059669] group-hover:bg-[#059669] group-hover:text-white flex items-center justify-center transition-colors mb-2">
                  <span className="material-symbols-outlined text-[20px]">checklist</span>
                </div>
                <span className="text-xs font-bold">Daily Roll Call</span>
                <span className="text-[10px] text-[#737686]">Mark attendance</span>
              </button>

              <button
                onClick={() => navigate('/fees/collection')}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#faf8ff] hover:bg-[#eaedff] text-[#131b2e] border border-[#e2e8f0] transition-colors group text-center"
              >
                <div className="w-9 h-9 rounded-lg bg-[#9333ea]/10 text-[#9333ea] group-hover:bg-[#9333ea] group-hover:text-white flex items-center justify-center transition-colors mb-2">
                  <span className="material-symbols-outlined text-[20px]">receipt</span>
                </div>
                <span className="text-xs font-bold">Collect Fees</span>
                <span className="text-[10px] text-[#737686]">Issue receipt</span>
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#faf8ff] hover:bg-[#eaedff] text-[#131b2e] border border-[#e2e8f0] transition-colors group text-center"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0284c7]/10 text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white flex items-center justify-center transition-colors mb-2">
                  <span className="material-symbols-outlined text-[20px]">query_stats</span>
                </div>
                <span className="text-xs font-bold">Reports Center</span>
                <span className="text-[10px] text-[#737686]">Audit & Analytics</span>
              </button>
            </div>
          </div>

          {/* Recent Student Roster Table Preview */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="font-headline text-lg font-semibold text-[#131b2e]">
                  Active Student Enrollment
                </h3>
                <p className="text-xs text-[#737686]">
                  Latest registered pupils and their current academic standing
                </p>
              </div>
              <button
                onClick={() => navigate('/students')}
                className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>View All ({students.length})</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">GR No.</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Parent</th>
                    <th className="py-3 px-4">Fee Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {students.slice(0, 5).map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="hover:bg-[#faf8ff] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.fullName}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#cbd5e1]"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#004ac6] font-bold text-[10px] flex items-center justify-center">
                              {student.firstName[0]}
                              {student.lastName[0]}
                            </div>
                          )}
                          <span className="font-semibold text-[#131b2e]">{student.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#434655]">{student.studentId}</td>
                      <td className="py-3 px-4 text-[#434655]">{student.classSimple} - {student.section}</td>
                      <td className="py-3 px-4 text-[#434655]">{student.parentName}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={student.feeStatus} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[#2563eb] hover:underline font-semibold">View</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Payments & Operational Alerts */}
        <div className="space-y-6">
          {/* Critical Operational Alerts */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline text-lg font-semibold text-[#131b2e]">
                Operational Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#93000a]">
                3 Active
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={alert.action}
                  className="p-3 rounded-lg border border-[#e2e8f0] hover:border-[#2563eb] bg-[#faf8ff] transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                        alert.type === 'danger'
                          ? 'text-[#dc2626]'
                          : alert.type === 'warning'
                          ? 'text-[#d97706]'
                          : 'text-[#059669]'
                      }`}
                    >
                      {alert.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#131b2e] group-hover:text-[#2563eb] transition-colors">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-[#434655] mt-0.5 leading-snug">{alert.desc}</p>
                      <span className="text-[10px] text-[#737686] block mt-1">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payment Receipts */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline text-lg font-semibold text-[#131b2e]">
                Recent Collections
              </h3>
              <button
                onClick={() => navigate('/payments')}
                className="text-xs font-bold text-[#2563eb] hover:underline"
              >
                All Receipts
              </button>
            </div>

            <div className="divide-y divide-[#f1f5f9]">
              {payments.slice(0, 4).map((pay) => (
                <div key={pay.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#131b2e]">{pay.studentName}</div>
                    <div className="text-[11px] text-[#737686] flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono">{pay.receiptNumber}</span>
                      <span>•</span>
                      <span>{pay.paymentMode}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#059669] tabular-nums">
                      {formatCurrency(pay.amountPaid)}
                    </div>
                    <div className="text-[10px] text-[#737686]">{formatDate(pay.paymentDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
