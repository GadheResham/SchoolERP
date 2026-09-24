import api from './api';
import { initialClasses } from './mockData';

const STORAGE_KEY = 'schoolerp_classes';

function getStoredClasses() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClasses));
    return initialClasses;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialClasses;
  }
}

function saveClasses(classes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

export const classService = {
  async getClasses(activeOnly = false) {
    try {
      const res = await api.get('/classes', { params: { activeOnly } });
      return res.data;
    } catch {
      const list = getStoredClasses();
      if (activeOnly) {
        return list.filter((c) => c.status === 'Active');
      }
      return list;
    }
  },

  async createClass(classData) {
    try {
      const res = await api.post('/classes', classData);
      return res.data;
    } catch {
      const list = getStoredClasses();
      const newClass = {
        id: 'cls-' + Date.now(),
        ...classData,
        enrolledCount: 0,
        status: classData.status || 'Active',
      };
      const updated = [...list, newClass];
      saveClasses(updated);
      return newClass;
    }
  },

  async updateClass(id, classData) {
    try {
      const res = await api.put(`/classes/${id}`, classData);
      return res.data;
    } catch {
      const list = getStoredClasses();
      const index = list.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Class not found.');

      list[index] = { ...list[index], ...classData };
      saveClasses(list);
      return list[index];
    }
  },

  async deactivateClass(id) {
    try {
      const res = await api.put(`/classes/${id}`, { status: 'Inactive' });
      return res.data;
    } catch {
      const list = getStoredClasses();
      const index = list.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Class not found.');

      list[index].status = 'Inactive';
      saveClasses(list);
      return list[index];
    }
  }
};
