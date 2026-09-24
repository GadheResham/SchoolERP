import api from './api';
import { initialParents } from './mockData';

const STORAGE_KEY = 'schoolerp_parents';

function getStoredParents() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialParents));
    return initialParents;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialParents;
  }
}

function saveParents(parents) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parents));
}

export const parentService = {
  async getParents(search = '') {
    try {
      const res = await api.get('/parents', { params: { search } });
      return res.data;
    } catch {
      let list = getStoredParents();
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.parentName?.toLowerCase().includes(q) ||
            p.phone?.includes(q) ||
            p.email?.toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  async getParentById(id) {
    try {
      const res = await api.get(`/parents/${id}`);
      return res.data;
    } catch {
      const list = getStoredParents();
      const parent = list.find((p) => p.id === id);
      if (!parent) throw new Error('Parent not found.');
      return parent;
    }
  },

  async createParent(parentData) {
    try {
      const res = await api.post('/parents', parentData);
      return res.data;
    } catch {
      const list = getStoredParents();
      const newParent = {
        id: 'par-' + Date.now(),
        ...parentData,
      };
      const updated = [newParent, ...list];
      saveParents(updated);
      return newParent;
    }
  },

  async updateParent(id, parentData) {
    try {
      const res = await api.put(`/parents/${id}`, parentData);
      return res.data;
    } catch {
      const list = getStoredParents();
      const index = list.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Parent not found.');

      list[index] = { ...list[index], ...parentData };
      saveParents(list);
      return list[index];
    }
  }
};
