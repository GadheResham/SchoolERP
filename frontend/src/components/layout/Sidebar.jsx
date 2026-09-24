import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Students Directory', path: '/students', icon: 'school' },
    { name: 'Parents Directory', path: '/parents', icon: 'escalator_warning' },
    { name: 'Class Sections', path: '/classes', icon: 'meeting_room' },
    { name: 'Daily Attendance', path: '/attendance', icon: 'event_available' },
    { name: 'Fee Structure', path: '/fees', icon: 'receipt_long' },
    { name: 'Fee Collection', path: '/fees/collection', icon: 'payments' },
    { name: 'Payment History', path: '/payments', icon: 'history' },
    { name: 'Analytics & Reports', path: '/reports', icon: 'monitoring' },
    { name: 'School Settings', path: '/settings', icon: 'tune' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-[#f8fafc] border-r border-[#e2e8f0] z-40 flex flex-col justify-between p-3.5 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="px-3 pt-2 pb-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#737686]">
            Administration
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                end={item.path === '/fees'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-xs'
                      : 'text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff]/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`material-symbols-outlined text-[19px] ${
                        isActive ? 'text-white' : 'text-[#737686]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom School Status Card & Logout */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#e2e8f0]">
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#131b2e] truncate">
                St. Jude Academy
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ecfdf5] text-[#047857]">
                Active
              </span>
            </div>
            <div className="text-[11px] text-[#737686] mt-1 flex justify-between items-center">
              <span>Term II Progress</span>
              <span className="font-semibold text-[#131b2e] tabular-nums">68%</span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#2563eb] h-full rounded-full w-[68%]" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-[#b91c1c] hover:bg-[#ffdad6]/50 transition-colors w-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
