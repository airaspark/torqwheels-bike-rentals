import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck, Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemo, isAuthenticating } = useAuth();

  const [email, setEmail] = useState('rohan.deshmukh@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = await login(email, password);
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError('Invalid credentials. You can use the 1-click test buttons below.');
    }
  };

  const handleDemo = async (role: 'customer' | 'admin') => {
    const user = await loginAsDemo(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto font-black text-xl shadow-xs">
            <Bike className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-slate-950">Welcome to TorqWheels</h1>
          <p className="text-xs text-slate-500">Sign in to manage your bike rentals & reservations</p>
        </div>

        {/* 1-Click Quick Demo Login Box */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
            ⚡ 1-Click Quick Prototype Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('customer')}
              className="p-2 bg-white border border-amber-300 hover:border-amber-500 rounded-xl text-xs font-bold text-slate-900 shadow-xs hover:bg-amber-100 transition-colors text-center"
            >
              Demo Customer
              <span className="block text-[10px] text-slate-500 font-normal">Rohan Deshmukh</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors text-center"
            >
              Fleet Admin
              <span className="block text-[10px] text-amber-400 font-normal">Aakash Sharma</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isAuthenticating}
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md shadow-amber-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-amber-600 hover:underline">
            Create Rider Account
          </Link>
        </p>
      </div>
    </div>
  );
};
