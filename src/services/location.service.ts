import { MOCK_LOCATIONS } from '../data/mockData';
import { LocationHub } from '../types';

const LOCATIONS_STORAGE_KEY = 'torqwheels_locations_db';

export class LocationService {
  private static getStoredLocations(): LocationHub[] {
    try {
      const data = localStorage.getItem(LOCATIONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(MOCK_LOCATIONS));
    return MOCK_LOCATIONS;
  }

  private static saveLocations(locations: LocationHub[]): void {
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(locations));
  }

  public static async getAllLocations(): Promise<LocationHub[]> {
    await new Promise((res) => setTimeout(res, 60));
    return this.getStoredLocations();
  }

  public static async getActiveLocations(): Promise<LocationHub[]> {
    const locs = await this.getAllLocations();
    return locs.filter((l) => l.isActive !== false && l.active !== false);
  }

  public static async createLocation(data: Omit<LocationHub, 'id'>): Promise<LocationHub> {
    return this.addLocation(data);
  }

  public static async getLocationById(id: string): Promise<LocationHub | null> {
    const locs = await this.getAllLocations();
    return locs.find((l) => l.id === id) || null;
  }

  public static async getCities(): Promise<string[]> {
    const locs = await this.getActiveLocations();
    const citySet = new Set(locs.map((l) => l.city));
    return Array.from(citySet);
  }

  public static async addLocation(data: Omit<LocationHub, 'id'>): Promise<LocationHub> {
    const locs = this.getStoredLocations();
    const newLoc: LocationHub = {
      ...data,
      id: `loc-${Date.now().toString().slice(-6)}`,
      bikeCount: 10,
    };
    locs.push(newLoc);
    this.saveLocations(locs);
    return newLoc;
  }

  public static async updateLocation(id: string, updates: Partial<LocationHub>): Promise<LocationHub> {
    const locs = this.getStoredLocations();
    const index = locs.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Location not found');
    locs[index] = { ...locs[index], ...updates };
    this.saveLocations(locs);
    return locs[index];
  }

  public static async toggleActive(id: string): Promise<LocationHub> {
    const locs = this.getStoredLocations();
    const index = locs.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Location not found');
    locs[index].isActive = !locs[index].isActive;
    this.saveLocations(locs);
    return locs[index];
  }
}
