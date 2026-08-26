import React, { useState } from 'react';
import { Settings, RefreshCw, Shield, Bell, Check, Database, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AdminSettingsPage: React.FC = () => {
  const [gstRate, setGstRate] = useState(18);
  const [freeKm, setFreeKm] = useState(250);
  const [excessKmRate, setExcessKmRate] = useState(5);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo local storage data (Fleet, Bookings, Customers) back to initial mock datasets?')) {
      setResetting(true);
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          System Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
          Platform Settings & Pricing Policies
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure business rules, tax parameters, excess kilometre tariffs, and prototype storage.
        </p>
      </div>

      <div className="space-y-6">
        {/* Pricing Rules Form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">Tariff & Taxation Rules</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">
                Standard GST Rate (%)
              </label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">
                Free Daily Limit (Kilometres)
              </label>
              <input
                type="number"
                value={freeKm}
                onChange={(e) => setFreeKm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">
                Excess Km Fee (₹ / km)
              </label>
              <input
                type="number"
                value={excessKmRate}
                onChange={(e) => setExcessKmRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Settings updated successfully!
              </span>
            )}
            <Button type="submit" variant="primary" size="md" className="ml-auto font-bold">
              Save Platform Policies
            </Button>
          </div>
        </form>

        {/* Prototype Demo Data Management */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Prototype Data Store</h3>
              <p className="text-xs text-slate-400">
                TorqWheels uses an asynchronous service layer connected to local persistent mock storage, ready to connect directly to Firebase Firestore.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-300">Restore Default Mock Data</p>
              <p className="text-[11px] text-slate-500">
                Cleans all added bikes, test bookings, and re-seeds fresh Royal Enfield, Ather, Yamaha datasets.
              </p>
            </div>

            <Button
              onClick={handleResetData}
              isLoading={resetting}
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-amber-400 border-amber-500/40 hover:bg-amber-500/10 text-xs"
            >
              Reset Data to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
