import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bike,
  CalendarCheck,
  CreditCard,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { BikeService } from '../../services/bike.service';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';
import { LocationService } from '../../services/location.service';
import { PaymentService } from '../../services/payment.service';
import { Bike as BikeType, Booking, Customer, LocationHub, PaymentRecord } from '../../types';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import { Button } from '../../components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const [bikes, setBikes] = useState<BikeType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [locations, setLocations] = useState<LocationHub[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bList, bkList, cList, lList, pList] = await Promise.all([
        BikeService.getAllBikes(),
        BookingService.getAllBookings(),
        CustomerService.getAllCustomers(),
        LocationService.getAllLocations(),
        PaymentService.getAllPayments(),
      ]);
      setBikes(bList);
      setBookings(bkList);
      setCustomers(cList);
      setLocations(lList);
      setPayments(pList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBikesCount = bikes.filter((b) => b.available).length;
  const activeBookingsCount = bookings.filter((b) => b.bookingStatus === 'Active' || b.bookingStatus === 'Ready for Pickup').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Karnataka Fleet Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Operations & Fleet Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, reservation tracking, and inventory status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/bikes"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Fleet</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>View All Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Fleet */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fleet</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-950">{bikes.length}</p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span>{availableBikesCount} Available for Rent</span>
          </p>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Trips</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-950">{activeBookingsCount}</p>
          <p className="text-xs text-blue-600 font-semibold">
            {bookings.length} Lifetime Reservations
          </p>
        </div>

        {/* Total Gross Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-950">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-700 font-semibold">Includes verified deposits</p>
        </div>

        {/* Active Hubs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hub Stations</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-950">{locations.length}</p>
          <p className="text-xs text-purple-700 font-semibold">Bengaluru, Mysuru, Chamarajanagara</p>
        </div>
      </div>

      {/* Main Grid: Recent Bookings Table & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Bookings */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Customer Bookings</h3>
            <Link to="/admin/bookings" className="text-xs font-bold text-amber-600 hover:underline">
              View All ({bookings.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Booking Code</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Motorcycle</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.bookingCode}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{b.customerName}</p>
                      <p className="text-slate-400 text-[10px]">{b.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">{b.bikeName}</td>
                    <td className="py-3 px-3 font-black text-slate-950">₹{b.totalAmount}</td>
                    <td className="py-3 px-3">
                      <BookingStatusBadge status={b.bookingStatus} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/bookings`}
                        className="text-amber-600 font-bold hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Fleet Distribution & Quick Station Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Station Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Station Inventory</h3>
            <div className="space-y-3">
              {locations.map((loc) => (
                <div key={loc.id} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">{loc.name}</p>
                    <p className="text-[10px] text-slate-500">{loc.city}</p>
                  </div>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {loc.bikeCount} Bikes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 space-y-3 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Prototype Fleet Tools
            </span>
            <h4 className="text-sm font-bold">Need to inject a new motorcycle into the system?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use the fleet management module to configure pricing, tags, security deposits, and hub assignments.
            </p>
            <Link
              to="/admin/bikes"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              <span>Open Fleet Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
