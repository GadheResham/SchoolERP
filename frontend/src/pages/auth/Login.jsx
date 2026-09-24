import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@stjudeacademy.edu');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      showToast('Welcome back, Dr. Sarah Jenkins!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@stjudeacademy.edu');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2e8f0] shadow-xl overflow-hidden">
        {/* Academic Header Banner */}
        <div className="bg-[#131b2e] px-8 py-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#2563eb]/20 rounded-full blur-2xl"></div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2563eb] text-white shadow-md mb-3">
            <span className="material-symbols-outlined text-[28px]">school</span>
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">SchoolERP</h1>
          <p className="text-xs text-[#cbd5e1] mt-1 uppercase tracking-widest font-semibold">
            St. Jude International Academy
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#131b2e]">Administrator Portal</h2>
            <p className="text-xs text-[#434655] mt-0.5">
              Enter your administrative credentials to manage student rosters, attendance, and finance.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@stjudeacademy.edu"
              materialIcon="mail"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              materialIcon="lock"
            />

            <div className="flex items-center justify-between text-xs text-[#434655]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb]"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[#2563eb] font-semibold hover:underline"
              >
                Use Demo Login
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              materialIcon="login"
            >
              Sign In to Administration
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#f1f5f9] text-center text-xs text-[#737686]">
            Session 2024-25 • Term II • Role-Based Admin Access
          </div>
        </div>
      </div>
    </div>
  );
}
