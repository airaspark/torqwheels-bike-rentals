import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  CalendarCheck,
  User,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  ChevronDown,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { currentUser, isAdmin, logout, loginAsAdmin, loginAsDemoCustomer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes' },
    { name: 'Locations', path: '/locations' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0C11]/95 backdrop-blur-md border-b border-white/5 text-white">
      {/* Top micro banner for prototype notice & rapid testing shortcuts */}
      <div className="bg-[#F59E0B] text-black px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-black text-amber-400 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider">
            Prototype Demo
          </span>
          <span className="hidden sm:inline font-medium">
            Zero Deposit with instant verification • Mysore, Bangalore, Chamarajanagar & Mangalore
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => {
              if (isAdmin) {
                loginAsDemoCustomer();
                navigate('/');
              } else {
                loginAsAdmin();
                navigate('/admin');
              }
            }}
            className="flex items-center gap-1.5 bg-black/20 hover:bg-black/40 text-black px-2.5 py-0.5 rounded-md transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Switch to Customer Mode' : 'Switch to Admin Panel'}</span>
          </button>
          <a href="tel:+918041237890" className="flex items-center gap-1 hover:underline">
            <PhoneCall className="w-3 h-3" />
            <span>+91 80 4123 7890</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  VELO<span className="text-amber-400">MOTION</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Premium Bike & EV Rentals
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#F59E0B] bg-white/5 font-semibold'
                    : 'text-slate-300 hover:text-[#F59E0B] hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser && (
              <Link
                to="/my-bookings"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/my-bookings')
                    ? 'text-[#F59E0B] bg-white/5 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                <span>My Bookings</span>
              </Link>
            )}

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#161B22] border border-white/10 hover:border-white/20 transition-all text-sm text-white"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-200 text-xs truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {currentUser.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      <span>My Profile & DL</span>
                    </Link>

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <CalendarCheck className="w-4 h-4 text-amber-400" />
                      <span>My Rentals</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-400 hover:bg-white/5 font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Quick Find Bikes CTA */}
            <Link
              to="/bikes"
              className="flex items-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Book Now</span>
            </Link>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/bikes"
              className="bg-[#F59E0B] text-black px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md shadow-amber-500/20"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#161B22] text-slate-300 hover:text-white border border-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161B22] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                if (isAdmin) {
                  loginAsDemoCustomer();
                  navigate('/');
                } else {
                  loginAsAdmin();
                  navigate('/admin');
                }
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 p-2.5 rounded-xl text-xs font-bold"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Customer Mode' : 'Admin Panel'}</span>
            </button>
            <Link
              to="/locations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-slate-200 p-2.5 rounded-xl text-xs font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Hub Locations</span>
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'text-[#F59E0B] bg-white/5 font-semibold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            {currentUser ? (
              <>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-black">
                    {currentUser.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold text-center"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold text-center"
                  >
                    My Profile
                  </Link>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#F59E0B] text-black text-xs font-bold text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
