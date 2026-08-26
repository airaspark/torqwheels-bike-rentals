import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bike,
  CalendarCheck,
  Users,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const AdminLayout: React.FC = () => {
  const { currentUser, switchUserRole } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', label: 'Overview Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/bikes', label: 'Fleet & Bikes', icon: Bike },
    { to: '/admin/bookings', label: 'Reservations', icon: CalendarCheck },
    { to: '/admin/customers', label: 'Riders & Customers', icon: Users },
    { to: '/admin/locations', label: 'Hubs & Stations', icon: MapPin },
    { to: '/admin/payments', label: 'Payments & Deposits', icon: CreditCard },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                TW
              </div>
              <div>
                <span className="text-sm font-black tracking-tight text-white block">
                  Torq<span className="text-amber-400">Wheels</span>
                </span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  Fleet Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Controls & Return to Customer View */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Logged in as:</span>
            <p className="font-bold text-white truncate">{currentUser?.name || 'Aakash Sharma'}</p>
            <p className="text-[10px] text-amber-400 font-mono">{currentUser?.role?.toUpperCase()}</p>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Rider Site</span>
          </Link>
        </div>
      </aside>

      {/* Admin Main Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
