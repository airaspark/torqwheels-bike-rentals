import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bike, Booking, BookingAddons, LocationHub, PaymentMethod } from '../types';
import { BookingService } from '../services/booking.service';
import { LocationService } from '../services/location.service';

export interface BookingDraft {
  bike: Bike | null;
  pickupLocationId: string;
  pickupLocationName: string;
  returnLocationId: string;
  returnLocationName: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  drivingLicenceNumber: string;
  addons: BookingAddons;
  couponCode: string;
  notes: string;
}

interface BookingContextType {
  draft: BookingDraft;
  locations: LocationHub[];
  updateDraft: (updates: Partial<BookingDraft>) => void;
  selectBike: (bike: Bike) => void;
  toggleAddon: (addonKey: keyof BookingAddons) => void;
  applyCoupon: (code: string) => void;
  resetDraft: () => void;
  selectedPaymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  createFinalBooking: (customerId?: string) => Promise<Booking | null>;
  isSubmitting: boolean;
  pricing: {
    durationDays: number;
    rentalAmount: number;
    securityDeposit: number;
    addonsAmount: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
  };
}

const getDefaultDates = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pickupStr = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  const returnStr = dayAfter.toISOString().split('T')[0];

  return {
    pickupDate: pickupStr,
    pickupTime: '09:00 AM',
    returnDate: returnStr,
    returnTime: '08:00 PM',
  };
};

const initialAddons: BookingAddons = {
  extraHelmet: false,
  ridingJacket: false,
  phoneMount: true,
  luggageCarrier: false,
  insuranceCover: true,
};

const initialDraft: BookingDraft = {
  bike: null,
  pickupLocationId: 'loc-blr-kor',
  pickupLocationName: 'Koramangala Mobility Hub',
  returnLocationId: 'loc-blr-kor',
  returnLocationName: 'Koramangala Mobility Hub',
  ...getDefaultDates(),
  customerName: 'Rohan Deshmukh',
  customerEmail: 'rohan.deshmukh@gmail.com',
  customerPhone: '+91 98451 22345',
  drivingLicenceNumber: 'KA-01-2021-0089241',
  addons: initialAddons,
  couponCode: '',
  notes: '',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draft, setDraft] = useState<BookingDraft>(() => {
    try {
      const stored = sessionStorage.getItem('torqwheels_booking_draft');
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialDraft;
  });

  const [locations, setLocations] = useState<LocationHub[]>([]);
  const [selectedPaymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    LocationService.getActiveLocations().then((locs) => {
      setLocations(locs);
      if (locs.length > 0 && !draft.pickupLocationId) {
        setDraft((prev) => ({
          ...prev,
          pickupLocationId: locs[0].id,
          pickupLocationName: locs[0].name,
          returnLocationId: locs[0].id,
          returnLocationName: locs[0].name,
        }));
      }
    });
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('torqwheels_booking_draft', JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const updateDraft = (updates: Partial<BookingDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...updates };
      if (updates.pickupLocationId && updates.pickupLocationId !== prev.pickupLocationId) {
        const found = locations.find((l) => l.id === updates.pickupLocationId);
        if (found) next.pickupLocationName = found.name;
      }
      if (updates.returnLocationId && updates.returnLocationId !== prev.returnLocationId) {
        const found = locations.find((l) => l.id === updates.returnLocationId);
        if (found) next.returnLocationName = found.name;
      }
      return next;
    });
  };

  const selectBike = (bike: Bike) => {
    setDraft((prev) => ({
      ...prev,
      bike,
      pickupLocationId: bike.locationId || prev.pickupLocationId,
      pickupLocationName: bike.locationName || prev.pickupLocationName,
      returnLocationId: bike.locationId || prev.returnLocationId,
      returnLocationName: bike.locationName || prev.returnLocationName,
    }));
  };

  const toggleAddon = (addonKey: keyof BookingAddons) => {
    setDraft((prev) => ({
      ...prev,
      addons: {
        ...prev.addons,
        [addonKey]: !prev.addons[addonKey],
      },
    }));
  };

  const applyCoupon = (code: string) => {
    setDraft((prev) => ({ ...prev, couponCode: code }));
  };

  const resetDraft = () => {
    setDraft(initialDraft);
    sessionStorage.removeItem('torqwheels_booking_draft');
  };

  const durationDays = BookingService.calculateDurationInDays(draft.pickupDate, draft.returnDate);
  const pricing = BookingService.calculatePricing(
    draft.bike?.pricePerDay || 899,
    draft.bike?.securityDeposit || 1500,
    durationDays,
    draft.addons,
    draft.couponCode
  );

  const createFinalBooking = async (customerId?: string): Promise<Booking | null> => {
    if (!draft.bike) return null;
    setIsSubmitting(true);
    try {
      const b = await BookingService.createBooking({
        customerId: customerId || 'cust-1',
        customerName: draft.customerName,
        customerEmail: draft.customerEmail,
        customerPhone: draft.customerPhone,
        drivingLicenceNumber: draft.drivingLicenceNumber,
        bikeId: draft.bike.id,
        bikeName: draft.bike.name,
        bikeBrand: draft.bike.brand,
        bikeModel: draft.bike.model,
        bikeImage: draft.bike.images[0],
        bikeCategory: draft.bike.category,
        pickupLocationId: draft.pickupLocationId,
        pickupLocationName: draft.pickupLocationName,
        returnLocationId: draft.returnLocationId,
        returnLocationName: draft.returnLocationName,
        pickupDate: draft.pickupDate,
        pickupTime: draft.pickupTime,
        returnDate: draft.returnDate,
        returnTime: draft.returnTime,
        pricePerDay: draft.bike.pricePerDay,
        securityDeposit: draft.bike.securityDeposit,
        addons: draft.addons,
        couponCode: draft.couponCode,
        paymentMethod: selectedPaymentMethod,
        notes: draft.notes,
      });
      return b;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        draft,
        locations,
        updateDraft,
        selectBike,
        toggleAddon,
        applyCoupon,
        resetDraft,
        selectedPaymentMethod,
        setPaymentMethod,
        createFinalBooking,
        isSubmitting,
        pricing,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
