import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, FileText, CheckCircle, Shield, Award } from 'lucide-react';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../types';
import { Badge } from '../../components/common/Badge';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    CustomerService.getAllCustomers().then((c) => {
      setCustomers(c);
      setLoading(false);
    });
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.drivingLicenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          User Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
          Registered Riders & Customers
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage customer records, DL verification status, and rental activity metrics.
        </p>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by rider name, DL #, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rider</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Driving Licence (DL)</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Total Trips</th>
                <th className="py-3 px-4">Total Spend</th>
                <th className="py-3 px-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-950 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-semibold text-slate-900">{c.phone}</p>
                    <p className="text-slate-400 text-[11px]">{c.email}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-800 text-xs">
                    {c.drivingLicenceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={c.role === 'admin' ? 'purple' : 'slate'} size="sm">
                      {c.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {c.totalRentals} Trips
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-950 text-sm">
                    ₹{c.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
