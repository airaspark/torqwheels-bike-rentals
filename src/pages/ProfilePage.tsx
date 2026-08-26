import React, { useState } from 'react';
import { User, Phone, Mail, FileText, ShieldCheck, Award, MapPin, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, switchUserRole } = useAuth();

  const [name, setName] = useState(currentUser?.name || 'Rohan Deshmukh');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [email, setEmail] = useState(currentUser?.email || 'rohan.deshmukh@example.com');
  const [drivingLicence, setDrivingLicence] = useState(currentUser?.drivingLicenceNumber || 'KA-01-2021-0089241');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      email,
      drivingLicenceNumber: drivingLicence,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
          Rider Profile & Preferences
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-xs space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto ring-4 ring-amber-100">
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-950 text-lg">{name}</h3>
              <p className="text-xs text-slate-500 font-medium">{email}</p>
              <span className="inline-block mt-2 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {currentUser?.role || 'Customer'}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Trips Done</span>
                <span className="font-black text-slate-900 text-base">4</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Rider Rating</span>
                <span className="font-black text-emerald-600 text-base">5.0 ★</span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher for Testing */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              Prototype Testing Controls
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch role instantly to test customer booking versus admin management dashboard.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => switchUserRole('customer')}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                  currentUser?.role === 'customer'
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Customer Role
              </button>
              <button
                type="button"
                onClick={() => switchUserRole('admin')}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                  currentUser?.role === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Admin Role
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">Personal & Licence Details</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Driving Licence Number (DL)
              </label>
              <input
                type="text"
                value={drivingLicence}
                onChange={(e) => setDrivingLicence(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Must match the original document presented during vehicle handover.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </span>
              )}
              <Button type="submit" variant="primary" size="md" className="ml-auto font-bold">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
