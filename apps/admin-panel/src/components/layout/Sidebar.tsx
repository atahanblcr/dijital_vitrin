import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Tags, FileText, BarChart2, LogOut, Search, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Ürün Yönetimi', icon: ShoppingBag, href: '/products' },
  { label: 'Kategoriler', icon: Tags, href: '/categories' },
  { label: 'Blog & Duyuru', icon: FileText, href: '/blog' },
  { label: 'İstatistikler', icon: BarChart2, href: '/analytics' },
  { label: "Google'da Görün 🔍", icon: Search, href: '/google-guide' },
];

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const business = useAuthStore((state) => state.business);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <ShoppingBag className="w-6 h-6 text-orange-500 mr-3" />
        <span className="font-bold text-lg text-gray-800 tracking-wide">İşletme Paneli</span>
      </div>

      {/* Storefront Link */}
      {business?.slug && (
        <div className="px-4 py-4">
          <a 
            href={`http://${business.slug}.dijitalvitrin.test:3000`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <ExternalLink size={16} />
            Vitrini Görüntüle
          </a>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-400 hover:text-red-500" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
