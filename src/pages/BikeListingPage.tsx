import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, Bike as BikeIcon } from 'lucide-react';
import { BikeService } from '../services/bike.service';
import { LocationService } from '../services/location.service';
import { Bike, LocationHub, SearchFilterState } from '../types';
import { BikeGrid } from '../components/bikes/BikeGrid';
import { BikeFilters } from '../components/bikes/BikeFilters';
import { Button } from '../components/common/Button';

export const BikeListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [locations, setLocations] = useState<LocationHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const initialFilters: SearchFilterState = {
    searchQuery: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    city: searchParams.get('city') || 'all',
    locationId: searchParams.get('location') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 10000,
    engineCCRange: searchParams.get('engine') || 'all',
    transmission: searchParams.get('transmission') || 'all',
    fuelType: searchParams.get('fuel') || 'all',
    availableOnly: searchParams.get('available') === 'true',
    sortBy: (searchParams.get('sortBy') as any) || 'recommended',
  };

  const [filters, setFilters] = useState<SearchFilterState>(initialFilters);

  useEffect(() => {
    window.scrollTo(0, 0);
    LocationService.getActiveLocations().then(setLocations);
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== filters.category) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    BikeService.filterAndSearch(filters)
      .then((data) => {
        setBikes(data);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const updateFilters = (updates: Partial<SearchFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      city: 'all',
      locationId: 'all',
      minPrice: 0,
      maxPrice: 10000,
      engineCCRange: 'all',
      transmission: 'all',
      fuelType: 'all',
      availableOnly: false,
      sortBy: 'recommended',
    });
    setSearchParams({});
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.locationId !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000 ||
    filters.engineCCRange !== 'all' ||
    filters.transmission !== 'all' ||
    filters.fuelType !== 'all' ||
    filters.availableOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Karnataka Fleet Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Explore All Bikes & Scooters
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showing <strong className="text-white">{bikes.length}</strong> rental options across Bangalore, Mysuru & Chamarajanagara.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, brand..."
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-[#161B22] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilters({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="recommended" className="bg-[#161B22] text-white">Sort: Recommended</option>
              <option value="price-low" className="bg-[#161B22] text-white">Price: Low to High</option>
              <option value="price-high" className="bg-[#161B22] text-white">Price: High to Low</option>
              <option value="rating" className="bg-[#161B22] text-white">Top Rated (4.8+)</option>
              <option value="popular" className="bg-[#161B22] text-white">Most Popular Trips</option>
            </select>
          </div>

          {/* Mobile Filters Trigger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-[#F59E0B] text-black px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Active filters:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
              Category: {filters.category}
              <button onClick={() => updateFilters({ category: 'all' })}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.locationId !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
              Hub Filtered
              <button onClick={() => updateFilters({ locationId: 'all' })}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.availableOnly && (
            <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
              Available Only
              <button onClick={() => updateFilters({ availableOnly: false })}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-rose-400 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <BikeFilters
            filters={filters}
            locations={locations}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* Mobile Filters Drawer Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative min-h-screen flex items-end justify-center p-0">
              <div className="relative w-full bg-[#161B22] text-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4 border-t border-white/10">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-lg text-white">Filter Fleet</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-lg bg-[#0B0C11] text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <BikeFilters
                  filters={filters}
                  locations={locations}
                  onChange={updateFilters}
                  onReset={resetFilters}
                />
                <Button
                  onClick={() => setMobileFiltersOpen(false)}
                  variant="primary"
                  className="w-full font-bold"
                >
                  Apply Filters ({bikes.length} bikes)
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bike Grid Listing */}
        <main className="lg:col-span-9">
          <BikeGrid
            bikes={bikes}
            isLoading={loading}
            onClearFilters={resetFilters}
          />
        </main>
      </div>
    </div>
  );
};
