import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '../../services/classService';
import { attendanceService } from '../../services/attendanceService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/CommonStates';

export default function Attendance() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch active classes on mount
  useEffect(() => {
    async function loadClasses() {
      try {
        const classList = await classService.getClasses(true);
        setClasses(classList);
        if (classList.length > 0) {
          // Default to Grade 3-A (cls-4) if available
          const grade3A = classList.find((c) => c.className.includes('Grade 3') && c.section === 'A');
          setSelectedClassId(grade3A ? grade3A.id : classList[0].id);
        }
      } catch (err) {
        showToast('Failed to load class list', 'error');
      }
    }
    loadClasses();
  }, []);

  // Fetch roster whenever class or date changes
  useEffect(() => {
    if (!selectedClassId) return;

    async function loadRoster() {
      try {
        setLoading(true);
        const data = await attendanceService.getAttendance({
          date: selectedDate,
          classId: selectedClassId,
        });
        setRoster(data);
      } catch (err) {
        showToast('Failed to load attendance roster', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadRoster();
  }, [selectedClassId, selectedDate]);

  // Update a student's status
  const handleStatusChange = (studentId, newStatus) => {
    setRoster((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Update remarks
  const handleRemarksChange = (studentId, remarks) => {
    setRoster((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  };

  // Quick Action: Mark All Present
  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((item) => ({ ...item, status: 'P' })));
    showToast('All students marked as Present', 'info');
  };

  // Submit and Save Roll Call
  const handleSaveRollCall = async () => {
    try {
      setSaving(true);
      await attendanceService.saveRollCall({
        date: selectedDate,
        classId: selectedClassId,
        records: roster,
      });
      showToast(`Roll call submitted for ${selectedDate}!`, 'success');
    } catch (err) {
      showToast('Failed to save attendance record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Count metrics
  const totalStudents = roster.length;
  const presentCount = roster.filter((r) => r.status === 'P').length;
  const absentCount = roster.filter((r) => r.status === 'A').length;
  const lateCount = roster.filter((r) => r.status === 'L').length;
  const excusedCount = roster.filter((r) => r.status === 'E').length;
  const attendancePercentage =
    totalStudents > 0 ? (((presentCount + lateCount) / totalStudents) * 100).toFixed(1) : '0.0';

  const currentClassObj = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Daily Roll Call
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Record, verify, and lock official student attendance for Session 2024-25
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            materialIcon="history"
            onClick={() => navigate('/attendance/history')}
          >
            Attendance Logs
          </Button>
          <Button
            variant="secondary"
            materialIcon="done_all"
            onClick={handleMarkAllPresent}
          >
            Mark All Present
          </Button>
          <Button
            variant="primary"
            materialIcon="cloud_upload"
            loading={saving}
            onClick={handleSaveRollCall}
          >
            Submit & Lock Roll Call
          </Button>
        </div>
      </div>

      {/* Date & Class Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737686]">
              Date:
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* Class Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737686]">
              Class Section:
            </span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className} - Section {cls.section} ({cls.room})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Rate Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#434655]">Class Attendance Rate:</span>
          <span className="font-bold text-[#059669] text-base tabular-nums">
            {attendancePercentage}%
          </span>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
            Total Enrolled
          </span>
          <div className="font-headline text-2xl font-bold text-[#131b2e] mt-0.5 tabular-nums">
            {totalStudents}
          </div>
          <div className="text-[10px] text-[#737686]">Roster count</div>
        </div>

        <div className="bg-[#ecfdf5] p-3.5 rounded-xl border border-[#a7f3d0] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857]">
            Present (P)
          </span>
          <div className="font-headline text-2xl font-bold text-[#047857] mt-0.5 tabular-nums">
            {presentCount}
          </div>
          <div className="text-[10px] text-[#059669]">On-time in class</div>
        </div>

        <div className="bg-[#fef2f2] p-3.5 rounded-xl border border-[#fecaca] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#b91c1c]">
            Absent (A)
          </span>
          <div className="font-headline text-2xl font-bold text-[#b91c1c] mt-0.5 tabular-nums">
            {absentCount}
          </div>
          <div className="text-[10px] text-[#dc2626]">SMS notification triggered</div>
        </div>

        <div className="bg-[#eff6ff] p-3.5 rounded-xl border border-[#bfdbfe] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1d4ed8]">
            Late (L)
          </span>
          <div className="font-headline text-2xl font-bold text-[#1d4ed8] mt-0.5 tabular-nums">
            {lateCount}
          </div>
          <div className="text-[10px] text-[#2563eb]">Tardy entry</div>
        </div>

        <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
            Excused (E)
          </span>
          <div className="font-headline text-2xl font-bold text-[#334155] mt-0.5 tabular-nums">
            {excusedCount}
          </div>
          <div className="text-[10px] text-[#64748b]">Medical / Authorized</div>
        </div>
      </div>

      {/* Roster Table */}
      {loading ? (
        <LoadingState message="Loading class roll roster..." />
      ) : roster.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] text-center text-xs text-[#737686]">
          No active students are currently enrolled in {currentClassObj?.className} - Section {currentClassObj?.section}.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4 w-16">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">GR Number</th>
                  <th className="py-3 px-4">Previous Day</th>
                  <th className="py-3 px-4 text-center">Status Selection</th>
                  <th className="py-3 px-4">Remarks / Absentee Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {roster.map((student) => (
                  <tr key={student.studentId} className="hover:bg-[#faf8ff] transition-colors">
                    {/* Roll No */}
                    <td className="py-3 px-4 font-mono font-bold text-[#131b2e]">
                      {student.rollNo}
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-[#cbd5e1]"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#004ac6] font-bold text-[10px] flex items-center justify-center">
                            {student.name ? student.name[0] : 'S'}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-[#131b2e] block">{student.name}</span>
                          <span className="text-[10px] text-[#737686]">
                            {student.house || 'Red Cedar'} • {student.bus || 'Bus #12'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* GR No */}
                    <td className="py-3 px-4 font-mono text-[#737686]">
                      {student.grId}
                    </td>

                    {/* Previous Day Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.prevDay === 'P'
                            ? 'bg-[#ecfdf5] text-[#047857]'
                            : student.prevDay === 'A'
                            ? 'bg-[#fef2f2] text-[#b91c1c]'
                            : 'bg-[#eff6ff] text-[#1d4ed8]'
                        }`}
                      >
                        {student.prevDay === 'P' ? 'Present' : student.prevDay === 'A' ? 'Absent' : 'Late'}
                      </span>
                    </td>

                    {/* Interactive P / A / L / E Button Segment */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1 bg-[#f1f5f9] p-1 rounded-lg w-fit mx-auto">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'P')}
                          className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                            student.status === 'P'
                              ? 'bg-[#059669] text-white shadow-xs'
                              : 'text-[#475569] hover:text-[#131b2e] hover:bg-white'
                          }`}
                          title="Present"
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'A')}
                          className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                            student.status === 'A'
                              ? 'bg-[#dc2626] text-white shadow-xs'
                              : 'text-[#475569] hover:text-[#131b2e] hover:bg-white'
                          }`}
                          title="Absent"
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'L')}
                          className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                            student.status === 'L'
                              ? 'bg-[#2563eb] text-white shadow-xs'
                              : 'text-[#475569] hover:text-[#131b2e] hover:bg-white'
                          }`}
                          title="Late"
                        >
                          L
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'E')}
                          className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                            student.status === 'E'
                              ? 'bg-[#475569] text-white shadow-xs'
                              : 'text-[#475569] hover:text-[#131b2e] hover:bg-white'
                          }`}
                          title="Excused"
                        >
                          E
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={student.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                        placeholder="Add remark or doctor notice..."
                        className="w-full px-2.5 py-1 text-xs bg-white rounded border border-[#cbd5e1] focus:outline-none focus:border-[#2563eb] placeholder:text-[#94a3b8]"
                      />
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
