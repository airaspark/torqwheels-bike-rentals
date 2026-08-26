import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { BookingService } from '../services/booking.service';
import { Booking, BookingStatus } from '../types';
import { BookingStatusBadge, PaymentStatusBadge } from '../components/booking/BookingStatusBadge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await BookingService.getBookingById(id);
      setBooking(data || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!booking) return;
    const confirm = window.confirm('Are you sure you want to cancel this booking? Refund will be initiated as per policy.');
    if (confirm) {
      await BookingService.updateBookingStatus(booking.id, 'Cancelled');
      loadBooking();
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading reservation details..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Reservation Not Found</h2>
        <p className="text-xs text-slate-500">Could not find booking record #{id}.</p>
        <Link to="/my-bookings" className="text-xs font-bold text-amber-600 hover:underline">
          ← Back to My Bookings
        </Link>
      </div>
    );
  }

  const steps: { label: string; statusMatch: BookingStatus[] }[] = [
    { label: 'Booking Placed', statusMatch: ['Pending', 'Confirmed', 'Ready for Pickup', 'Active', 'Completed'] },
    { label: 'Ready for Pickup', statusMatch: ['Ready for Pickup', 'Active', 'Completed'] },
    { label: 'On Ride', statusMatch: ['Active', 'Completed'] },
    { label: 'Returned & Inspected', statusMatch: ['Completed'] },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Print Receipt
          </Button>

          {['Confirmed', 'Pending', 'Ready for Pickup'].includes(booking.bookingStatus) && (
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      {/* Main Reservation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Header Bar */}
        <div className="bg-slate-950 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                REF #{booking.bookingCode}
              </span>
              <BookingStatusBadge status={booking.bookingStatus} />
            </div>
            <h1 className="text-2xl font-black text-white mt-1">{booking.bikeName}</h1>
            <p className="text-xs text-slate-400">{booking.bikeBrand} • {booking.durationDays} Days Rental</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Fare</span>
            <span className="text-2xl font-black text-amber-400">₹{booking.totalAmount}</span>
            <p className="text-[10px] text-slate-400">Paid via {booking.paymentMethod}</p>
          </div>
        </div>

        {/* Progress Tracker (unless cancelled) */}
        {booking.bookingStatus !== 'Cancelled' && (
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-4">
              Trip Lifecycle Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {steps.map((step, idx) => {
                const isPassed = step.statusMatch.includes(booking.bookingStatus);
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span className={`text-[11px] font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Body Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Pickup & Return Station */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                Pickup Station & Time
              </span>
              <p className="font-bold text-slate-900 text-sm">{booking.pickupLocationName}</p>
              <p className="text-slate-600">{booking.pickupDate} at {booking.pickupTime}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-700 block">
                Dropoff Station & Time
              </span>
              <p className="font-bold text-slate-900 text-sm">{booking.returnLocationName}</p>
              <p className="text-slate-600">{booking.returnDate} at {booking.returnTime}</p>
            </div>
          </div>

          {/* Customer & DL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold block">Rider Name</span>
              <p className="font-bold text-slate-900">{booking.customerName}</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold block">Phone / Email</span>
              <p className="font-bold text-slate-900">{booking.customerPhone}</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold block">Driving Licence #</span>
              <p className="font-mono font-bold text-amber-800">{booking.drivingLicenceNumber}</p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block pb-2 border-b border-slate-200">
              Payment Summary
            </span>
            <div className="flex justify-between text-slate-600">
              <span>Rental Base Charge ({booking.durationDays} days)</span>
              <span className="font-semibold text-slate-900">₹{booking.rentalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Security Deposit (Refundable)</span>
              <span className="font-semibold text-slate-900">₹{booking.securityDeposit}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Addons & Protective Gear</span>
              <span className="font-semibold text-slate-900">₹{booking.addonsAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (18%)</span>
              <span className="font-semibold text-slate-900">₹{booking.taxAmount}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Promotional Discount</span>
                <span>-₹{booking.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t border-slate-200">
              <span>Total Settled</span>
              <span>₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
