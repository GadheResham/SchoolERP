import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      <Header onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <main className="flex-1 mt-16 lg:ml-64 p-4 lg:p-8 min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full transition-all">
        <Outlet />
      </main>
    </div>
  );
}
