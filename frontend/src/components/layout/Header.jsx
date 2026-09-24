import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header({ onMobileMenuToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] z-40 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Brand Logo & Active Session Badge */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#434655] hover:bg-[#f1f5f9] transition-colors"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
          <span className="font-headline text-2xl font-bold text-[#004ac6] tracking-tight">
            SchoolERP
          </span>
        </div>

        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#004ac6] text-xs font-bold uppercase tracking-wider">
          Session 2024-25 (Active)
        </span>
      </div>

      {/* Center: Global Search Input */}
      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-[#737686] pointer-events-none text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, GR numbers, parents, or staff..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff]/60 text-[#131b2e] text-xs rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20 border border-transparent focus:border-[#2563eb] transition-all placeholder:text-[#737686]"
          />
        </form>
      </div>

      {/* Right: Date/Term, Notification, User Profile */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f2f3ff] text-[#434655] text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px] text-[#2563eb]">
            calendar_today
          </span>
          <span>Term II • Week 12</span>
        </div>

        <button
          className="relative p-2 rounded-lg text-[#434655] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#dc2626] ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-[#e2e8f0] hidden sm:block"></div>

        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-1 cursor-pointer group"
          title="View Settings / Account Profile"
        >
          <img
            src={
              user?.avatar ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEyWynl9v9EpxDWexDoNPQABWYy3erNuCULUpvJ6lsqKX5FPXBmd-X4428zPkOc9mRFs7W2dgRbfbsJsRAEohPO-8ZFsLw02c3uY-k-bGSMk8QxhPM5E5B-La6ydT6ODDTMztPOnbVQQDQEbK2Sr8FidXnglOsK9gmQcAr0_7gV15tDu1cs20IRrakY0tzg_SukFmUEBW8mOhv06-3LY1jgx801l9KzQxnni84FVJR53ac_5VWNjh'
            }
            alt="Admin Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#cbd5e1] group-hover:ring-[#2563eb] transition-all"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight text-[#131b2e] group-hover:text-[#2563eb] transition-colors">
              {user?.name || 'Dr. Sarah Jenkins'}
            </span>
            <span className="text-[11px] text-[#737686] leading-none">
              {user?.role || 'Principal / Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
