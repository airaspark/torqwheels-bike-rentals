import { MOCK_BIKES } from '../data/mockData';
import { Bike, SearchFilterState } from '../types';

const BIKES_STORAGE_KEY = 'torqwheels_bikes_db';

export class BikeService {
  private static getStoredBikes(): Bike[] {
    try {
      const data = localStorage.getItem(BIKES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(BIKES_STORAGE_KEY, JSON.stringify(MOCK_BIKES));
    return MOCK_BIKES;
  }

  private static saveBikes(bikes: Bike[]): void {
    localStorage.setItem(BIKES_STORAGE_KEY, JSON.stringify(bikes));
  }

  public static async getAllBikes(): Promise<Bike[]> {
    await new Promise((res) => setTimeout(res, 80));
    return this.getStoredBikes();
  }

  public static async getFeaturedBikes(): Promise<Bike[]> {
    const bikes = await this.getAllBikes();
    return bikes.filter((b) => b.featured || b.rating >= 4.8).slice(0, 6);
  }

  public static async getBikeById(id: string): Promise<Bike | null> {
    const bikes = await this.getAllBikes();
    return bikes.find((b) => b.id === id) || null;
  }

  public static async checkAvailability(
    bikeId: string,
    pickupDate: string,
    pickupTime: string,
    returnDate: string,
    returnTime: string
  ): Promise<{ isAvailable: boolean; message: string; conflictingReason?: string }> {
    await new Promise((res) => setTimeout(res, 200));
    const bike = await this.getBikeById(bikeId);
    if (!bike) {
      return { isAvailable: false, message: 'Bike not found in fleet catalog.' };
    }

    if (!bike.available) {
      return {
        isAvailable: false,
        message: 'This bike is currently booked or scheduled for routine maintenance.',
        conflictingReason: 'Fleet maintenance / active rental block',
      };
    }

    // In a production system with Firestore, queries check overlapping booking ranges:
    // (startA <= endB) and (endA >= startB)
    return {
      isAvailable: true,
      message: `✓ Available for your selected dates (${pickupDate} ${pickupTime} to ${returnDate} ${returnTime})`,
    };
  }

  public static async getSimilarBikes(currentBikeId: string, category: string, maxPrice?: number): Promise<Bike[]> {
    const bikes = await this.getAllBikes();
    return bikes
      .filter((b) => b.id !== currentBikeId && b.available && (b.category === category || (maxPrice && Math.abs(b.pricePerDay - maxPrice) <= 300)))
      .slice(0, 3);
  }

  public static async filterAndSearch(filters: Partial<SearchFilterState>): Promise<Bike[]> {
    let bikes = await this.getAllBikes();

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      bikes = bikes.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.brand.toLowerCase().includes(q) ||
          b.model.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.locationName.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      bikes = bikes.filter((b) => b.category === filters.category);
    }

    if (filters.city && filters.city !== 'all') {
      // Match by location name or city
      const city = filters.city.toLowerCase();
      bikes = bikes.filter((b) => b.locationName.toLowerCase().includes(city));
    }

    if (filters.locationId && filters.locationId !== 'all') {
      bikes = bikes.filter((b) => b.locationId === filters.locationId);
    }

    if (filters.minPrice !== undefined) {
      bikes = bikes.filter((b) => b.pricePerDay >= (filters.minPrice ?? 0));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      bikes = bikes.filter((b) => b.pricePerDay <= (filters.maxPrice ?? 10000));
    }

    if (filters.engineCCRange && filters.engineCCRange !== 'all') {
      if (filters.engineCCRange === '100-125') {
        bikes = bikes.filter((b) => b.engineCC >= 100 && b.engineCC <= 125);
      } else if (filters.engineCCRange === '150-200') {
        bikes = bikes.filter((b) => b.engineCC >= 150 && b.engineCC <= 200);
      } else if (filters.engineCCRange === '250-400') {
        bikes = bikes.filter((b) => b.engineCC >= 250 && b.engineCC <= 400);
      } else if (filters.engineCCRange === '400+') {
        bikes = bikes.filter((b) => b.engineCC > 400);
      } else if (filters.engineCCRange === 'ev') {
        bikes = bikes.filter((b) => b.fuelType === 'Electric');
      }
    }

    if (filters.transmission && filters.transmission !== 'all') {
      bikes = bikes.filter((b) => b.transmission.toLowerCase() === filters.transmission?.toLowerCase());
    }

    if (filters.fuelType && filters.fuelType !== 'all') {
      bikes = bikes.filter((b) => b.fuelType.toLowerCase() === filters.fuelType?.toLowerCase());
    }

    if (filters.availableOnly) {
      bikes = bikes.filter((b) => b.available);
    }

    // Sorting
    if (filters.sortBy === 'price-low') {
      bikes.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sortBy === 'price-high') {
      bikes.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (filters.sortBy === 'rating') {
      bikes.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'popular') {
      bikes.sort((a, b) => b.totalTrips - a.totalTrips);
    }

    return bikes;
  }

  public static async addBike(bikeData: Omit<Bike, 'id' | 'rating' | 'reviewCount' | 'totalTrips'>): Promise<Bike> {
    const bikes = this.getStoredBikes();
    const newBike: Bike = {
      ...bikeData,
      id: `bike-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      totalTrips: 0,
    };
    bikes.unshift(newBike);
    this.saveBikes(bikes);
    return newBike;
  }

  public static async updateBike(id: string, updates: Partial<Bike>): Promise<Bike> {
    const bikes = this.getStoredBikes();
    const index = bikes.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Bike not found');
    bikes[index] = { ...bikes[index], ...updates };
    this.saveBikes(bikes);
    return bikes[index];
  }

  public static async deleteBike(id: string): Promise<void> {
    let bikes = this.getStoredBikes();
    bikes = bikes.filter((b) => b.id !== id);
    this.saveBikes(bikes);
  }

  public static async createBike(bikeData: Omit<Bike, 'id' | 'rating' | 'reviewCount' | 'totalTrips'>): Promise<Bike> {
    return this.addBike(bikeData);
  }

  public static async toggleAvailability(id: string, forcedState?: boolean): Promise<Bike> {
    const bikes = this.getStoredBikes();
    const index = bikes.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Bike not found');
    bikes[index].available = forcedState !== undefined ? forcedState : !bikes[index].available;
    this.saveBikes(bikes);
    return bikes[index];
  }
}
