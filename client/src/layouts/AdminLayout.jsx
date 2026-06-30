import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList, QrCode,
  ChevronLeft, ChevronRight, Coffee, Monitor
} from 'lucide-react';
import FroozoLogo from '../components/FroozoLogo.jsx';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/menu', label: 'Menu Manager', icon: UtensilsCrossed },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-froozo-cream">
      <aside
        className={`flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}
        style={{ background: 'linear-gradient(180deg, #4A2C17 0%, #2D1A0A 100%)' }}
      >
        <div className={`flex items-center border-b border-white/10 flex-shrink-0 ${collapsed ? 'justify-center px-2 py-4' : 'px-5 py-4'}`}>
          {collapsed ? <Coffee className="w-6 h-6 text-white" /> : <FroozoLogo size="md" white />}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-froozo-caramel text-white shadow-warm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="px-2 pb-2 space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Quick Access</p>
            <button
              onClick={() => navigate('/staff')}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              <Monitor className="w-5 h-5" />
              <span>Staff POS</span>
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              <QrCode className="w-5 h-5" />
              <span>View Menu</span>
            </button>
          </div>
        )}

        <div className="border-t border-white/10 p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-froozo-sand/50 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <p className="text-xs text-froozo-mocha font-medium">Welcome back</p>
            <p className="text-froozo-brown font-bold">Froozo Admin Panel</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-froozo-mocha">
            <Coffee className="w-4 h-4 text-froozo-caramel" />
            <span className="font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
