import api from './api';
import { initialStudents } from './mockData';

const STORAGE_KEY = 'schoolerp_students';

function getStoredStudents() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
    return initialStudents;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialStudents;
  }
}

function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export const studentService = {
  async getStudents(params = {}) {
    try {
      const res = await api.get('/students', { params });
      return res.data;
    } catch {
      let list = getStoredStudents();
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (s) =>
            s.fullName?.toLowerCase().includes(q) ||
            s.studentId?.toLowerCase().includes(q) ||
            s.parentName?.toLowerCase().includes(q) ||
            s.phone?.includes(q)
        );
      }
      if (params.classId) {
        list = list.filter((s) => s.classId === params.classId || s.classSimple === params.classId);
      }
      if (params.section) {
        list = list.filter((s) => s.section === params.section);
      }
      if (params.status) {
        list = list.filter((s) => s.status === params.status);
      }
      return list;
    }
  },

  async getStudentById(id) {
    try {
      const res = await api.get(`/students/${id}`);
      return res.data;
    } catch {
      const list = getStoredStudents();
      const student = list.find((s) => s.id === id || s.studentId === id);
      if (!student) throw new Error('Student record not found.');
      return student;
    }
  },

  async createStudent(studentData) {
    try {
      const res = await api.post('/students', studentData);
      return res.data;
    } catch {
      const list = getStoredStudents();

      // Rule: Student ID uniqueness
      const exists = list.some(
        (s) => s.studentId?.toLowerCase() === studentData.studentId?.toLowerCase()
      );
      if (exists) {
        throw new Error(`Student ID "${studentData.studentId}" is already assigned to another student.`);
      }

      const newStudent = {
        id: 'stu-' + Date.now(),
        ...studentData,
        fullName: `${studentData.firstName} ${studentData.lastName}`,
        status: 'Active',
        attendanceRate: 100,
        totalFee: Number(studentData.totalFee) || 48000,
        paidFee: 0,
        pendingFee: Number(studentData.totalFee) || 48000,
        feeStatus: 'Overdue',
        overdueDays: 0,
      };

      const updated = [newStudent, ...list];
      saveStudents(updated);
      return newStudent;
    }
  },

  async updateStudent(id, studentData) {
    try {
      const res = await api.put(`/students/${id}`, studentData);
      return res.data;
    } catch {
      const list = getStoredStudents();
      const index = list.findIndex((s) => s.id === id || s.studentId === id);
      if (index === -1) throw new Error('Student not found for update.');

      // Rule: Ensure student ID uniqueness if changed
      if (studentData.studentId) {
        const idConflict = list.some(
          (s) => s.id !== id && s.studentId?.toLowerCase() === studentData.studentId?.toLowerCase()
        );
        if (idConflict) {
          throw new Error(`Student ID "${studentData.studentId}" is already in use.`);
        }
      }

      const updatedStudent = {
        ...list[index],
        ...studentData,
        fullName: `${studentData.firstName || list[index].firstName} ${studentData.lastName || list[index].lastName}`,
      };

      list[index] = updatedStudent;
      saveStudents(list);
      return updatedStudent;
    }
  },

  async deactivateStudent(id) {
    try {
      const res = await api.delete(`/students/${id}`);
      return res.data;
    } catch {
      const list = getStoredStudents();
      const index = list.findIndex((s) => s.id === id || s.studentId === id);
      if (index === -1) throw new Error('Student not found.');

      list[index].status = 'Inactive';
      saveStudents(list);
      return list[index];
    }
  }
};
