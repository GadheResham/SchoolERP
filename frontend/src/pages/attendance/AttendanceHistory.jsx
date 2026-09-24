import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { classService } from '../../services/classService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { SearchBar, LoadingState } from '../../components/common/CommonStates';
import { formatDate } from '../../utils/formatters';

export default function AttendanceHistory() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [classList, history] = await Promise.all([
          classService.getClasses(),
          attendanceService.getAttendanceHistory(),
        ]);
        setClasses(classList);
        setLogs(history);
      } catch (err) {
        console.error('Error loading history', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (search && !log.studentName.toLowerCase().includes(search.toLowerCase()) && !log.grId.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedClass && log.classId !== selectedClass) {
      return false;
    }
    if (selectedDate && log.date !== selectedDate) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline mb-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Daily Roll Call</span>
          </button>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Attendance History & Logs
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Archival records of daily class roll calls across all academic periods
          </p>
        </div>

        <Button
          variant="secondary"
          materialIcon="print"
          onClick={() => window.print()}
        >
          Print Log
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search student or GR number in log..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
          />

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className} - {cls.section}
              </option>
            ))}
          </select>

          {(search || selectedClass || selectedDate) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedClass('');
                setSelectedDate('');
              }}
              className="text-xs text-[#2563eb] font-semibold hover:underline px-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading attendance history..." />
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] text-center text-xs text-[#737686]">
          No attendance records match your filter criteria.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">GR Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recorded Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#faf8ff]">
                  <td className="py-3 px-4 font-medium text-[#131b2e]">{formatDate(log.date)}</td>
                  <td className="py-3 px-4 font-bold text-[#131b2e]">{log.studentName}</td>
                  <td className="py-3 px-4 font-mono text-[#737686]">{log.grId}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="py-3 px-4 text-[#434655]">{log.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
