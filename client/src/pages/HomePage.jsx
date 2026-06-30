import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, LayoutDashboard, QrCode, ArrowRight, Coffee, Star } from 'lucide-react';
import FroozoLogo from '../components/FroozoLogo.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #4A2C17 0%, #6B3F1F 40%, #8B5E3C 100%)' }}>
      <header className="px-8 py-6">
        <FroozoLogo size="lg" white />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Cafe Management System — V1 Prototype
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Your Cafe,<br />
            <span style={{ color: '#F5A056' }}>Perfectly Managed</span>
          </h1>

          <p className="text-white/70 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            From table orders to live analytics — Froozo POS replaces pen-and-paper with a system built for your cafe.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Monitor, title: 'Staff POS', desc: 'Take orders, manage tables, create bills', path: '/staff', label: 'Open POS' },
              { icon: LayoutDashboard, title: 'Admin Dashboard', desc: 'Analytics, revenue, menu management', path: '/admin', label: 'View Dashboard' },
              { icon: QrCode, title: 'Digital Menu', desc: 'QR-accessible menu for customers', path: '/menu', label: 'View Menu' },
            ].map(({ icon: Icon, title, desc, path, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="group bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-2xl p-6 text-left transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-4 transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                <p className="text-white/60 text-sm">{desc}</p>
                <div className="flex items-center gap-1 text-white/40 group-hover:text-white/80 text-sm mt-3 transition-all">
                  <span>{label}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-2"><Coffee className="w-4 h-4" /><span>Real-time order management</span></div>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Cash & UPI payments</span>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span>QR digital menu</span>
          </div>
        </div>
      </div>

      <footer className="px-8 py-4 text-center text-white/30 text-xs">
        Froozo Cafe POS — Built for Froozo, Mumbai · {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default HomePage;
