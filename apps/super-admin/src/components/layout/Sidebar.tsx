import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'İşletmeler', icon: Store, href: '/businesses' },
  { label: 'Platform İstatistikleri', icon: BarChart3, href: '/analytics' },
  { label: 'Ayarlar', icon: Settings, href: '/settings' },
];

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-64 bg-sidebar text-white flex flex-col">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Store className="w-6 h-6 text-blue-400 mr-3" />
        <span className="font-bold text-lg tracking-wide">Dijital Vitrin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
