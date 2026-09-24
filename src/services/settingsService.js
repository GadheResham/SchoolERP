import api from './api';
import { initialSchoolSettings } from './mockData';

const STORAGE_KEY = 'schoolerp_settings';

function getStoredSettings() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSchoolSettings));
    return initialSchoolSettings;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialSchoolSettings;
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const settingsService = {
  async getSettings() {
    try {
      const res = await api.get('/settings');
      return res.data;
    } catch {
      return getStoredSettings();
    }
  },

  async updateSettings(data) {
    try {
      const res = await api.put('/settings', data);
      return res.data;
    } catch {
      const current = getStoredSettings();
      const updated = { ...current, ...data };
      saveSettings(updated);
      return updated;
    }
  }
};
