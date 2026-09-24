import api from './api';
import { initialFeeStructures } from './mockData';

const STORAGE_KEY = 'schoolerp_fee_structures';

function getStoredFeeStructures() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFeeStructures));
    return initialFeeStructures;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialFeeStructures;
  }
}

function saveFeeStructures(fees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fees));
}

export const feeService = {
  async getFeeStructures() {
    try {
      const res = await api.get('/fees');
      return res.data;
    } catch {
      return getStoredFeeStructures();
    }
  },

  async createFeeStructure(data) {
    try {
      const res = await api.post('/fees', data);
      return res.data;
    } catch {
      const list = getStoredFeeStructures();
      const newFee = {
        id: 'fee-' + Date.now(),
        ...data,
        baseTuition: Number(data.baseTuition) || 0,
        labTechFee: Number(data.labTechFee) || 0,
        totalAnnualFee: (Number(data.baseTuition) || 0) + (Number(data.labTechFee) || 0),
        status: 'Active',
      };
      const updated = [...list, newFee];
      saveFeeStructures(updated);
      return newFee;
    }
  },

  async updateFeeStructure(id, data) {
    try {
      const res = await api.put(`/fees/${id}`, data);
      return res.data;
    } catch {
      const list = getStoredFeeStructures();
      const index = list.findIndex((f) => f.id === id);
      if (index === -1) throw new Error('Fee structure not found.');

      const totalAnnualFee =
        (Number(data.baseTuition !== undefined ? data.baseTuition : list[index].baseTuition) || 0) +
        (Number(data.labTechFee !== undefined ? data.labTechFee : list[index].labTechFee) || 0);

      list[index] = {
        ...list[index],
        ...data,
        totalAnnualFee,
      };
      saveFeeStructures(list);
      return list[index];
    }
  }
};
