import React, { useState } from 'react';
import { QrCode, CreditCard, Landmark, Banknote, ShieldCheck, Check } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  totalAmount: number;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onSelect,
  totalAmount,
}) => {
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCVV, setCardCVV] = useState('892');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const methods: { id: PaymentMethod; label: string; icon: any; tag?: string }[] = [
    { id: 'UPI', label: 'Instant UPI / QR', icon: QrCode, tag: 'Fastest' },
    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'NetBanking', label: 'Net Banking', icon: Landmark },
    { id: 'Cash on Pickup', label: 'Pay on Pickup', icon: Banknote },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
      <div>
        <h4 className="text-base font-bold text-slate-900 mb-1">Select Payment Method</h4>
        <p className="text-xs text-slate-500">
          All transactions are secured with 256-bit bank-grade encryption.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {methods.map((m) => {
          const Icon = m.icon;
          const active = selectedMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                active
                  ? 'border-amber-500 bg-amber-50/50 text-slate-950 shadow-xs ring-2 ring-amber-400'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
              }`}
            >
              {m.tag && (
                <span className="absolute -top-2 right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  {m.tag}
                </span>
              )}
              <Icon className={`w-5 h-5 mb-1.5 ${active ? 'text-amber-600' : 'text-slate-500'}`} />
              <span className="text-xs font-bold leading-tight">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Payment Method Specific Content */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        {selectedMethod === 'UPI' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Scan QR Code or Enter UPI VPA</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 0% Convenience Fee
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="p-3 bg-white border border-slate-300 rounded-xl flex flex-col items-center justify-center text-center shrink-0">
                <div className="w-24 h-24 bg-slate-950 p-2 rounded-lg flex items-center justify-center text-amber-400 font-mono text-[10px] text-center">
                  <div className="space-y-1">
                    <QrCode className="w-12 h-12 mx-auto text-amber-400" />
                    <span>BHIM UPI QR</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-medium">Scan with any App</span>
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  Or enter Virtual Payment Address (UPI ID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. yourname@oksbi / 9845012345@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-500">Supported:</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[10px]">GPay</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[10px]">PhonePe</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[10px]">Paytm</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[10px]">Cred</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'Card' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Card Payment Details (Simulated Test Mode)</span>
              <span className="text-slate-500 text-[10px]">Visa, MasterCard, RuPay</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">CVV</label>
                <input
                  type="password"
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'NetBanking' && (
          <div className="space-y-3">
            <span className="font-bold text-slate-900">Select Bank</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Canara Bank'].map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={`p-2 rounded-lg border text-left text-xs font-medium transition-colors ${
                    selectedBank === bank
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedMethod === 'Cash on Pickup' && (
          <div className="space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pay in Person at the Rental Station</span>
            </p>
            <p className="text-slate-600 leading-relaxed">
              You can inspect the bike, test ride, verify documents and settle total payment of ₹{totalAmount} via Cash, Card, or UPI QR code at our hub counter before taking delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
