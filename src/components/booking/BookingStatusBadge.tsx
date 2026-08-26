import React from 'react';
import { BookingStatus, PaymentStatus } from '../../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status, className = '' }) => {
  const styles: Record<BookingStatus, string> = {
    Pending: 'bg-amber-100 text-amber-900 border-amber-300',
    Confirmed: 'bg-blue-100 text-blue-900 border-blue-300',
    'Ready for Pickup': 'bg-purple-100 text-purple-900 border-purple-300',
    Active: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    Completed: 'bg-slate-100 text-slate-800 border-slate-300',
    Cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-slate-100 text-slate-800 border-slate-200'
      } ${className}`}
    >
      {status}
    </span>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const styles: Record<PaymentStatus, string> = {
    Pending: 'bg-amber-50 text-amber-800 border-amber-200',
    Paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Failed: 'bg-rose-50 text-rose-800 border-rose-200',
    Refunded: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
        styles[status] || 'bg-slate-100 text-slate-800'
      } ${className}`}
    >
      {status}
    </span>
  );
};
