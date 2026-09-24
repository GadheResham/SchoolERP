import api from './api';
import { initialAttendanceRosters } from './mockData';
import { studentService } from './studentService';

const STORAGE_KEY = 'schoolerp_attendance';

function getStoredAttendance() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const today = new Date().toISOString().split('T')[0];
    const initial = {
      [`${today}_cls-4`]: initialAttendanceRosters['cls-4'],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveAttendance(attendanceMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceMap));
}

export const attendanceService = {
  async getAttendance({ date, classId }) {
    try {
      const res = await api.get('/attendance', { params: { date, classId } });
      return res.data;
    } catch {
      const allAttendance = getStoredAttendance();
      const key = `${date}_${classId}`;

      // If already recorded for this date & class, return it
      if (allAttendance[key]) {
        return allAttendance[key];
      }

      // Otherwise generate a fresh template roster from active students in this class
      const students = await studentService.getStudents({ classId, status: 'Active' });
      const roster = students.map((s, idx) => ({
        studentId: s.id,
        rollNo: String(idx + 1).padStart(2, '0'),
        grId: s.studentId,
        name: s.fullName,
        avatar: s.avatar,
        status: 'P',
        prevDay: 'P',
        remarks: '',
        house: 'Red Cedar',
        bus: 'Bus #12',
      }));

      return roster;
    }
  },

  async saveRollCall({ date, classId, records }) {
    try {
      const res = await api.post('/attendance', { date, classId, records });
      return res.data;
    } catch {
      const allAttendance = getStoredAttendance();
      const key = `${date}_${classId}`;
      allAttendance[key] = records;
      saveAttendance(allAttendance);
      return { success: true, count: records.length, key };
    }
  },

  async getAttendanceHistory(params = {}) {
    try {
      const res = await api.get('/attendance/history', { params });
      return res.data;
    } catch {
      const allAttendance = getStoredAttendance();
      const rows = [];

      Object.entries(allAttendance).forEach(([key, records]) => {
        const [date, classId] = key.split('_');
        if (params.date && params.date !== date) return;
        if (params.classId && params.classId !== classId) return;

        records.forEach((rec) => {
          if (params.student && !rec.name.toLowerCase().includes(params.student.toLowerCase())) {
            return;
          }
          rows.push({
            id: `${date}_${rec.studentId}`,
            date,
            studentId: rec.studentId,
            studentName: rec.name,
            grId: rec.grId,
            classId,
            status: rec.status,
            remarks: rec.remarks || '-',
          });
        });
      });

      return rows;
    }
  }
};
