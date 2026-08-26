import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Filter, Bike as BikeIcon, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BookingService } from '../services/booking.service';
import { Booking, BookingStatus } from '../types';
import { BookingCard } from '../components/booking/BookingCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';

export const MyBookingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getUserBookings(currentUser?.id);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBookings();
  }, [currentUser]);

  const handleCancel = async (bookingId: string) => {
    const reason = window.prompt('Please enter a cancellation reason:');
    if (reason !== null) {
      await BookingService.updateBookingStatus(bookingId, 'Cancelled');
      loadBookings();
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bikeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pickupLocationName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    {
      id: 'Confirmed',
      label: 'Upcoming',
      count: bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Ready for Pickup').length,
    },
    {
      id: 'Active',
      label: 'Active Trips',
      count: bookings.filter((b) => b.bookingStatus === 'Active').length,
    },
    {
      id: 'Completed',
      label: 'Completed',
      count: bookings.filter((b) => b.bookingStatus === 'Completed').length,
    },
    {
      id: 'Cancelled',
      label: 'Cancelled',
      count: bookings.filter((b) => b.bookingStatus === 'Cancelled').length,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            My Reservations & Trips
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track upcoming rides, past journeys, and download voucher receipts.
          </p>
        </div>

        <Link
          to="/bikes"
          className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Book Another Bike</span>
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === t.id
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === t.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, bike name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner label="Loading your rental history..." />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon="booking"
          title="No bookings found"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'No trips matched your search filter criteria. Try clearing the filter.'
              : "You haven't booked any motorcycle or scooter trips yet. Experience the joy of the open road today!"
          }
          actionLabel="Browse Available Fleet"
          actionLink="/bikes"
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
