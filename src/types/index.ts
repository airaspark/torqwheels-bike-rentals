export type BikeCategory =
  | 'scooter'
  | 'commuter'
  | 'sports'
  | 'cruiser'
  | 'adventure'
  | 'premium'
  | 'electric_scooter'
  | 'electric_bike';

export type FuelType = 'Petrol' | 'Electric';
export type TransmissionType = 'Manual' | 'Automatic';
export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Ready for Pickup'
  | 'Active'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'Cash on Pickup';
export type UserRole = 'customer' | 'admin';

export interface LocationHub {
  id: string;
  name: string;
  city: string;
  state?: string;
  address: string;
  landmark?: string;
  openingHours: string;
  contactNumber?: string;
  contactPhone?: string;
  email?: string;
  isActive?: boolean;
  active?: boolean;
  bikeCount?: number;
}

export interface Bike {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: BikeCategory;
  engineCC: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  mileage: string;
  seatingCapacity: number;
  year: number;
  pricePerDay: number;
  securityDeposit: number;
  locationId: string;
  locationName: string;
  available: boolean;
  images: string[];
  featured?: boolean;
  rating: number;
  reviewCount: number;
  totalTrips: number;
  description: string;
  features: string[];
  rules: string[];
  tag?: string;
}

export interface BookingAddons {
  extraHelmet: boolean; // ₹50/day
  ridingJacket: boolean; // ₹150/day
  phoneMount: boolean; // ₹30/day
  luggageCarrier: boolean; // ₹100/day
  insuranceCover: boolean; // ₹99 flat
}

export interface Booking {
  id: string;
  bookingCode: string;
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
  bikeCategory: BikeCategory;
  pickupLocationId: string;
  pickupLocationName: string;
  returnLocationId: string;
  returnLocationName: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  durationDays: number;
  pricePerDay: number;
  rentalAmount: number;
  securityDeposit: number;
  addons: BookingAddons;
  addonsAmount: number;
  taxAmount: number; // GST 18%
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  notes?: string;
  transactionId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  drivingLicenceNumber: string;
  avatar?: string;
  registeredDate?: string;
  totalBookings?: number;
  totalRentals?: number;
  totalSpent: number;
  activeBookingId?: string;
  status?: 'Active' | 'Blocked';
  role?: UserRole;
  verified?: boolean;
  savedLocations?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  transactionId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  timestamp: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingCode: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  gatewayRef?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  drivingLicenceNumber?: string;
  avatar?: string;
}

export interface SearchFilterState {
  searchQuery: string;
  category: string;
  city: string;
  locationId: string;
  minPrice: number;
  maxPrice: number;
  engineCCRange: string; // 'all' | '100-125' | '150-200' | '250-400' | '400+'
  transmission: string; // 'all' | 'Manual' | 'Automatic'
  fuelType: string; // 'all' | 'Petrol' | 'Electric'
  availableOnly: boolean;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating' | 'popular';
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
}

export interface AdminStats {
  totalBikes: number;
  availableBikes: number;
  activeRentals: number;
  todayBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingReturns: number;
  pendingPickups: number;
}
