import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/CommonStates';
import { formatCurrency } from '../../utils/formatters';

export default function Reports() {
  const [studentReport, setStudentReport] = useState(null);
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [feeReport, setFeeReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const [sRep, aRep, fRep] = await Promise.all([
          reportService.getStudentReport(),
          reportService.getAttendanceReport(),
          reportService.getFeeReport(),
        ]);
        setStudentReport(sRep);
        setAttendanceReport(aRep);
        setFeeReport(fRep);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  if (loading) {
    return <LoadingState message="Compiling administrative reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Institutional Reports & Analytics
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Session 2024-25 • Real-time operational metrics, student density, and financial solvency
          </p>
        </div>

        <Button
          variant="primary"
          materialIcon="print"
          onClick={() => window.print()}
        >
          Print Full Comprehensive Report
        </Button>
      </div>

      {/* Grid: 3 Major Report Dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Enrollment & Demographic Report */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h2 className="font-headline text-lg font-semibold text-[#131b2e]">
                Enrollment Distribution
              </h2>
              <span className="p-1.5 rounded-lg bg-[#eaedff] text-[#004ac6]">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </span>
            </div>

            <div className="my-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#faf8ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#737686]">Active Pupils</span>
                <span className="font-headline text-2xl font-bold text-[#131b2e] block tabular-nums">
                  {studentReport?.activeStudents}
                </span>
              </div>
              <div className="p-3 bg-[#faf8ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#737686]">Archived / Left</span>
                <span className="font-headline text-2xl font-bold text-[#737686] block tabular-nums">
                  {studentReport?.inactiveStudents}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#434655] uppercase text-[10px] tracking-wider">
                Class Section Breakdown
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {studentReport?.byClass.slice(0, 6).map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#131b2e]">{c.className}</span>
                    <span className="font-bold font-mono text-[#004ac6]">
                      {c.enrolled} / {c.capacity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-xs text-[#737686]">
            <span>Gender: {studentReport?.males} Boys • {studentReport?.females} Girls</span>
          </div>
        </div>

        {/* 2. Attendance Compliance Report */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h2 className="font-headline text-lg font-semibold text-[#131b2e]">
                Attendance Regularity
              </h2>
              <span className="p-1.5 rounded-lg bg-[#ecfdf5] text-[#047857]">
                <span className="material-symbols-outlined text-[18px]">event_available</span>
              </span>
            </div>

            <div className="my-4 text-center p-4 bg-[#ecfdf5] rounded-xl border border-[#a7f3d0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857]">
                Session Overall Attendance
              </span>
              <div className="font-headline text-4xl font-bold text-[#047857] tabular-nums mt-1">
                {attendanceReport?.overallRate}%
              </div>
              <span className="text-[11px] text-[#059669]">
                Target: {attendanceReport?.targetBaseline}% • {attendanceReport?.totalWorkingDays} Working Days
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#434655] uppercase text-[10px] tracking-wider">
                Weekly Regularity Trend
              </span>
              <div className="grid grid-cols-5 gap-1 text-center">
                {attendanceReport?.weeklyTrends.map((w, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border ${
                      w.isToday
                        ? 'bg-[#2563eb] text-white border-[#2563eb]'
                        : 'bg-[#f8fafc] border-[#e2e8f0] text-[#131b2e]'
                    }`}
                  >
                    <div className="text-[10px] font-bold">{w.day}</div>
                    <div className="font-bold text-xs mt-0.5 tabular-nums">{w.rate}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-xs text-[#737686]">
            <span>Average Daily Absences: {attendanceReport?.averageAbsent} Pupils</span>
          </div>
        </div>

        {/* 3. Fee Collection Audit Report */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h2 className="font-headline text-lg font-semibold text-[#131b2e]">
                Fee Realization Audit
              </h2>
              <span className="p-1.5 rounded-lg bg-[#fef2f2] text-[#b91c1c]">
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
              </span>
            </div>

            <div className="my-4 space-y-2">
              <div className="flex justify-between text-xs py-1">
                <span className="text-[#737686]">Gross Budgeted Revenue:</span>
                <span className="font-bold text-[#131b2e] font-mono">
                  {formatCurrency(feeReport?.grossTarget)}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-[#047857] font-semibold">Total Revenue Realized:</span>
                <span className="font-bold text-[#047857] font-mono">
                  {formatCurrency(feeReport?.collected)}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-[#f1f5f9]">
                <span className="text-[#b91c1c] font-semibold">Outstanding Receivables:</span>
                <span className="font-bold text-[#b91c1c] font-mono">
                  {formatCurrency(feeReport?.pending)}
                </span>
              </div>

              <div className="w-full bg-[#e2e8f0] h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#059669] h-full rounded-full"
                  style={{ width: `${feeReport?.realizationRate}%` }}
                />
              </div>
              <div className="text-right text-[11px] text-[#737686]">
                {feeReport?.realizationRate}% Collected
              </div>
            </div>

            <div className="p-3 bg-[#faf8ff] rounded-lg border border-[#e2e8f0] text-xs">
              <div className="flex justify-between">
                <span className="text-[#434655]">Total Defaulters:</span>
                <span className="font-bold text-[#dc2626]">{feeReport?.defaultersCount} Students</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[#434655]">Receipts Issued:</span>
                <span className="font-bold text-[#131b2e]">{feeReport?.recentPaymentsCount} Vouchers</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-xs text-[#737686]">
            <span>Financial Year 2024-25</span>
          </div>
        </div>
      </div>
    </div>
  );
}
