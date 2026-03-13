import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const SuperAdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Koyu renk (SKILL referansı) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar (İleride eklenebilir, şu an basit bırakıyoruz) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">Süper Admin Paneli</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
