import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { LoadingState } from '../../components/common/CommonStates';

export default function Settings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    schoolName: '',
    affiliationNo: '',
    principalName: '',
    email: '',
    phone: '',
    timezone: '',
    address: '',
    currency: '₹',
    academicYear: '2024–25',
    currentTerm: 'Term II • Week 12',
    termProgress: 68,
    totalCapacity: 520,
    autoSmsAbsent: true,
    strictRollCallLock: true,
    attendanceThreshold: 75,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err) {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      showToast('Institutional settings saved successfully', 'success');
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading school settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            School Configuration & Settings
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            Define institutional credentials, academic calendar boundaries, and administrative rules
          </p>
        </div>

        <Button
          variant="primary"
          materialIcon="save"
          loading={saving}
          onClick={handleSubmit}
        >
          Save Configuration
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institutional Profile */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#f1f5f9] pb-2">
            1. Institutional Profile & Board Registration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Official School Legal Name"
              required
              value={settings.schoolName}
              onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
            />

            <Input
              label="Board Affiliation / License Number"
              required
              value={settings.affiliationNo}
              onChange={(e) => setSettings({ ...settings, affiliationNo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Principal / Head Administrator"
              value={settings.principalName}
              onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
            />

            <Input
              label="Official Admin Email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />

            <Input
              label="Administrative Phone"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>

          <Input
            label="Institutional Physical Campus Address"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          />
        </div>

        {/* Academic Calendar & Financial Rules */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#f1f5f9] pb-2">
            2. Academic Calendar & Fiscal Operations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Active Academic Session"
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
            />

            <Input
              label="Current Term & Week"
              value={settings.currentTerm}
              onChange={(e) => setSettings({ ...settings, currentTerm: e.target.value })}
            />

            <Select
              label="Accounting Currency"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              options={[
                { value: '₹', label: 'INR (₹)' },
                { value: '$', label: 'USD ($)' },
                { value: '€', label: 'EUR (€)' },
                { value: '£', label: 'GBP (£)' },
              ]}
            />

            <Input
              label="Campus Seat Capacity"
              type="number"
              value={settings.totalCapacity}
              onChange={(e) => setSettings({ ...settings, totalCapacity: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-[#faf8ff] rounded-lg border border-[#e2e8f0]">
              <div>
                <span className="text-xs font-bold text-[#131b2e] block">
                  Automated Absentee SMS Alerts
                </span>
                <span className="text-[11px] text-[#737686]">
                  Trigger guardian SMS when student is marked 'A'
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSmsAbsent}
                onChange={(e) => setSettings({ ...settings, autoSmsAbsent: e.target.checked })}
                className="w-4 h-4 rounded text-[#2563eb]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#faf8ff] rounded-lg border border-[#e2e8f0]">
              <div>
                <span className="text-xs font-bold text-[#131b2e] block">
                  Lock Past Attendance Records
                </span>
                <span className="text-[11px] text-[#737686]">
                  Prevent modifications after 24 hours of roll call
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.strictRollCallLock}
                onChange={(e) => setSettings({ ...settings, strictRollCallLock: e.target.checked })}
                className="w-4 h-4 rounded text-[#2563eb]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            materialIcon="save"
          >
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
