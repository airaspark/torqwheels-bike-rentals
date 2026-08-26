import React, { useState, useEffect } from 'react';
import { CreditCard, Search, ArrowDownLeft, ArrowUpRight, CheckCircle, RefreshCw } from 'lucide-react';
import { PaymentService } from '../../services/payment.service';
import { PaymentRecord } from '../../types';
import { PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import { Button } from '../../components/common/Button';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await PaymentService.getAllPayments();
      setPayments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPayments();
  }, []);

  const handleRefund = async (paymentId: string) => {
    if (window.confirm('Initiate 100% refund for this transaction?')) {
      await PaymentService.refundPayment(paymentId);
      loadPayments();
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaid = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Financial Reconciliation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Payments & Security Deposit Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track UPI settlement IDs, card authorizations, and deposit release records.
          </p>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
          <span className="text-[10px] text-emerald-800 font-bold uppercase block">Settled Gross Inflow</span>
          <span className="text-xl font-black text-emerald-950">₹{totalPaid.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by transaction ID, method..."
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
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-950">{p.transactionId}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{p.bookingId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{p.method}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(p.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-black text-slate-950 text-sm">₹{p.amount}</td>
                  <td className="py-3 px-4">
                    <PaymentStatusBadge status={p.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {p.status === 'Paid' && (
                      <button
                        onClick={() => handleRefund(p.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline"
                      >
                        Issue Refund
                      </button>
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
