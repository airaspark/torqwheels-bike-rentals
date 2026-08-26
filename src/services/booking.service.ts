import { MOCK_BOOKINGS } from '../data/mockData';
import { Booking, BookingAddons, BookingStatus, PaymentMethod, PaymentStatus } from '../types';

const BOOKINGS_STORAGE_KEY = 'torqwheels_bookings_db';

export class BookingService {
  private static getStoredBookings(): Booking[] {
    try {
      const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(MOCK_BOOKINGS));
    return MOCK_BOOKINGS;
  }

  private static saveBookings(bookings: Booking[]): void {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }

  public static calculateDurationInDays(pickupDate: string, returnDate: string): number {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    const diffTime = Math.max(0, end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }

  public static calculatePricing(
    pricePerDay: number,
    securityDeposit: number,
    durationDays: number,
    addons: BookingAddons,
    couponCode?: string
  ) {
    const rentalAmount = pricePerDay * durationDays;
    
    // Addons calculation
    let addonsAmount = 0;
    if (addons.extraHelmet) addonsAmount += 50 * durationDays;
    if (addons.ridingJacket) addonsAmount += 150 * durationDays;
    if (addons.phoneMount) addonsAmount += 30 * durationDays;
    if (addons.luggageCarrier) addonsAmount += 100 * durationDays;
    if (addons.insuranceCover) addonsAmount += 99; // flat coverage fee

    // GST 18% on rental & addons (deposit is tax-free refundable)
    const taxableSubtotal = rentalAmount + addonsAmount;
    const taxAmount = Math.round(taxableSubtotal * 0.18);

    // Coupon discounts
    let discountAmount = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      if (code === 'FREEDOMRIDE') {
        discountAmount = Math.min(300, Math.round(rentalAmount * 0.15));
      } else if (code === 'ADVENTURE500') {
        discountAmount = 500;
      } else if (code === 'FIRST100') {
        discountAmount = 100;
      }
    }

    const totalAmount = rentalAmount + securityDeposit + addonsAmount + taxAmount - discountAmount;

    return {
      rentalAmount,
      securityDeposit,
      addonsAmount,
      taxAmount,
      discountAmount,
      totalAmount,
      durationDays,
    };
  }

  public static async getAllBookings(): Promise<Booking[]> {
    await new Promise((res) => setTimeout(res, 60));
    return this.getStoredBookings();
  }

  public static async getBookingById(id: string): Promise<Booking | null> {
    const bookings = await this.getAllBookings();
    return bookings.find((b) => b.id === id || b.bookingCode === id) || null;
  }

  public static async getCustomerBookings(customerId: string): Promise<Booking[]> {
    const bookings = await this.getAllBookings();
    return bookings.filter((b) => b.customerId === customerId || b.customerEmail.toLowerCase() === customerId.toLowerCase());
  }

  public static async getUserBookings(customerId: string): Promise<Booking[]> {
    return this.getCustomerBookings(customerId);
  }

  public static async createBooking(data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    drivingLicenceNumber: string;
    bikeId: string;
    bikeName: string;
    bikeBrand: string;
    bikeModel: string;
    bikeImage: string;
    bikeCategory: any;
    pickupLocationId: string;
    pickupLocationName: string;
    returnLocationId: string;
    returnLocationName: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    pricePerDay: number;
    securityDeposit: number;
    addons: BookingAddons;
    couponCode?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Promise<Booking> {
    await new Promise((res) => setTimeout(res, 300));
    const durationDays = this.calculateDurationInDays(data.pickupDate, data.returnDate);
    const pricing = this.calculatePricing(
      data.pricePerDay,
      data.securityDeposit,
      durationDays,
      data.addons,
      data.couponCode
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `BR-2026-${randomSuffix}`;
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingCode,
      ...data,
      durationDays,
      rentalAmount: pricing.rentalAmount,
      securityDeposit: pricing.securityDeposit,
      addonsAmount: pricing.addonsAmount,
      taxAmount: pricing.taxAmount,
      discountAmount: pricing.discountAmount,
      totalAmount: pricing.totalAmount,
      paymentStatus: data.paymentMethod === 'Cash on Pickup' ? 'Pending' : 'Paid',
      bookingStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
      transactionId: data.paymentMethod === 'Cash on Pickup' ? undefined : `TXN-${data.paymentMethod.toUpperCase()}-${Date.now().toString().slice(-8)}`,
    };

    const bookings = this.getStoredBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  }

  public static async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const bookings = this.getStoredBookings();
    const index = bookings.findIndex((b) => b.id === id || b.bookingCode === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index].bookingStatus = status;
    this.saveBookings(bookings);
    return bookings[index];
  }

  public static async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Booking> {
    const bookings = this.getStoredBookings();
    const index = bookings.findIndex((b) => b.id === id || b.bookingCode === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index].paymentStatus = status;
    this.saveBookings(bookings);
    return bookings[index];
  }

  public static async cancelBooking(id: string, _reason?: string): Promise<Booking> {
    const bookings = this.getStoredBookings();
    const index = bookings.findIndex((b) => b.id === id || b.bookingCode === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index].bookingStatus = 'Cancelled';
    if (bookings[index].paymentStatus === 'Paid') {
      bookings[index].paymentStatus = 'Refunded';
    }
    this.saveBookings(bookings);
    return bookings[index];
  }
}
