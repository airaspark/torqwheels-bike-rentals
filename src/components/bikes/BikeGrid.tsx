import React from 'react';
import { Bike } from '../../types';
import { BikeCard } from './BikeCard';
import { EmptyState } from '../common/EmptyState';

interface BikeGridProps {
  bikes: Bike[];
  isLoading?: boolean;
  onClearFilters?: () => void;
}

export const BikeGrid: React.FC<BikeGridProps> = ({ bikes, isLoading, onClearFilters }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-4 h-96 animate-pulse flex flex-col justify-between"
          >
            <div className="bg-slate-200 rounded-xl h-48 w-full"></div>
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-full mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <EmptyState
        icon="bike"
        title="No bikes match your filters"
        description="We couldn't find any bikes or scooters matching your current filters or selected location. Try widening your price range or exploring other categories."
        actionLabel="Reset All Filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} />
      ))}
    </div>
  );
};
