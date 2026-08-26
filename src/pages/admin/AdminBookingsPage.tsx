import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus, PaymentStatus } from '../../types';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getAllBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    await BookingService.updateBookingStatus(bookingId, newStatus);
    loadBookings();
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, bookingStatus: newStatus });
    }
  };

  const handlePaymentStatusChange = async (bookingId: string, newStatus: PaymentStatus) => {
    await BookingService.updatePaymentStatus(bookingId, newStatus);
    loadBookings();
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, paymentStatus: newStatus });
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bikeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Operations & Handover
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Reservations & Bookings Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review customer reservations, authorize vehicle handovers, and track trip lifecycles.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, rider name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['all', 'Pending', 'Confirmed', 'Ready for Pickup', 'Active', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer & DL</th>
                <th className="py-3 px-4">Bike</th>
                <th className="py-3 px-4">Pickup / Return Hub</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Trip Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-950">{b.bookingCode}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{b.customerName}</p>
                    <p className="text-slate-500 text-[11px]">{b.customerPhone}</p>
                    <p className="text-amber-800 font-mono text-[10px] font-semibold">{b.drivingLicenceNumber}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={b.bikeImage}
                        alt={b.bikeName}
                        className="w-10 h-8 object-cover rounded-lg bg-slate-950 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{b.bikeName}</p>
                        <span className="text-[10px] text-slate-400 font-bold">{b.bikeBrand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    <p className="font-semibold text-slate-900 truncate max-w-[150px]">{b.pickupLocationName}</p>
                    <p className="text-slate-400 truncate max-w-[150px]">To: {b.returnLocationName}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    <p className="font-semibold text-slate-900">{b.pickupDate}</p>
                    <p className="text-slate-500">{b.durationDays} {b.durationDays === 1 ? 'Day' : 'Days'}</p>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-950 text-sm">₹{b.totalAmount}</td>
                  <td className="py-3 px-4">
                    <select
                      value={b.bookingStatus}
                      onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-900 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Active">Active (On Ride)</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={b.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(b.id, e.target.value as PaymentStatus)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-900 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg transition-colors"
                      title="Inspect full details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Inspection Modal */}
      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Slip: ${selectedBooking.bookingCode}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold block">
                  {selectedBooking.bookingCode}
                </span>
                <h4 className="font-black text-white text-base">{selectedBooking.bikeName}</h4>
                <p className="text-slate-400 text-xs">{selectedBooking.durationDays} Days Duration</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-400">₹{selectedBooking.totalAmount}</span>
                <p className="text-[10px] text-slate-400">{selectedBooking.paymentMethod}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Rider Name</span>
                <p className="font-bold text-slate-900">{selectedBooking.customerName}</p>
                <p className="text-slate-600">{selectedBooking.customerPhone}</p>
                <p className="text-slate-600">{selectedBooking.customerEmail}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Driving Licence #</span>
                <p className="font-mono font-bold text-amber-800 text-xs mt-1">
                  {selectedBooking.drivingLicenceNumber}
                </p>
                <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ DL Format Verified
                </span>
              </div>
            </div>

            <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup:</span>
                <span className="font-semibold text-slate-900">{selectedBooking.pickupLocationName} ({selectedBooking.pickupDate} {selectedBooking.pickupTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Return:</span>
                <span className="font-semibold text-slate-900">{selectedBooking.returnLocationName} ({selectedBooking.returnDate} {selectedBooking.returnTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Refundable Deposit:</span>
                <span className="font-bold text-emerald-700">₹{selectedBooking.securityDeposit}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedBooking(null)}
              >
                Close Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
