import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  QrCode,
  Printer,
  Calendar,
  Clock,
  MapPin,
  FileText,
  ArrowRight,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { Booking } from '../types';
import { Button } from '../components/common/Button';

export const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking: Booking | undefined = location.state?.booking;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Trigger festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#0f172a', '#3b82f6'],
      });
    } catch (e) {
      // safe fallback if canvas is not ready
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Booking Slip Not Found</h2>
        <p className="text-xs text-slate-500">
          You can look up all your active and past reservations in your account dashboard.
        </p>
        <Link to="/my-bookings" className="inline-block text-xs font-bold text-amber-600 hover:underline">
          Go to My Bookings →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0">
      {/* Confirmation Header Banner */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-9 h-9 stroke-[2.5]" />
        </div>
        <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Reservation Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          You're Ready to Ride!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Your booking voucher has been generated. Bring your original driving licence to the pickup hub counter.
        </p>
      </div>

      {/* Printable Booking Voucher Slip */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Ticket Header */}
        <div className="bg-slate-950 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-black tracking-widest block">
              TORQWHEELS RENTAL VOUCHER
            </span>
            <h2 className="text-2xl font-black text-white mt-0.5">{booking.bikeName}</h2>
            <p className="text-xs text-slate-400">
              {booking.bikeBrand} • {booking.durationDays} {booking.durationDays === 1 ? 'Day' : 'Days'} Trip
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Booking Ref Code
            </span>
            <span className="text-xl sm:text-2xl font-mono font-black text-amber-400">
              {booking.bookingCode}
            </span>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Rider & Pickup Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pb-6 border-b border-slate-200">
            {/* Rider Details */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Primary Rider</span>
              <p className="font-bold text-slate-900 text-sm">{booking.customerName}</p>
              <p className="text-slate-600">{booking.customerPhone}</p>
              <p className="text-slate-600">{booking.customerEmail}</p>
              <p className="text-amber-700 font-mono font-semibold pt-1">DL: {booking.drivingLicenceNumber}</p>
            </div>

            {/* Pickup Hub */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-emerald-600">Pickup Station</span>
              <p className="font-bold text-slate-900 text-sm">{booking.pickupLocationName}</p>
              <p className="text-slate-600 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{booking.pickupDate}</span>
              </p>
              <p className="text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{booking.pickupTime}</span>
              </p>
            </div>

            {/* Return Hub */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-amber-600">Return Station</span>
              <p className="font-bold text-slate-900 text-sm">{booking.returnLocationName}</p>
              <p className="text-slate-600 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{booking.returnDate}</span>
              </p>
              <p className="text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{booking.returnTime}</span>
              </p>
            </div>
          </div>

          {/* Pricing & QR Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Amount Paid / Payable
              </span>
              <div className="text-2xl font-black text-slate-950">
                ₹{booking.totalAmount}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Status: {booking.paymentStatus} ({booking.paymentMethod}) • Includes ₹{booking.securityDeposit} deposit
              </p>
            </div>

            {/* Counter Scan QR Code */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="w-16 h-16 bg-slate-950 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                <QrCode className="w-12 h-12" />
              </div>
              <div className="text-left text-[11px]">
                <p className="font-bold text-slate-900">Counter QR Code</p>
                <p className="text-slate-500">Scan at station desk for instantaneous key handover</p>
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>What to Bring to the Pickup Hub:</span>
            </p>
            <p className="text-slate-700 leading-relaxed">
              1. Original Driving Licence (matching DL #{booking.drivingLicenceNumber})<br />
              2. Any government ID proof (Aadhaar / Voter ID / Passport)<br />
              3. The booking code #{booking.bookingCode} on your smartphone
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
        <Button
          onClick={handlePrint}
          variant="outline"
          size="md"
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print / Save Voucher Slip
        </Button>

        <Button
          onClick={() => navigate('/my-bookings')}
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-md font-bold"
        >
          View in My Bookings
        </Button>

        <Link
          to="/"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
