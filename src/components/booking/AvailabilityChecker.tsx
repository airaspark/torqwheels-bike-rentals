import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Calendar, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Bike } from '../../types';
import { BikeService } from '../../services/bike.service';
import { Button } from '../common/Button';

interface AvailabilityCheckerProps {
  bike: Bike;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  onDatesChange?: (updates: {
    pickupDate?: string;
    pickupTime?: string;
    returnDate?: string;
    returnTime?: string;
  }) => void;
  className?: string;
}

export const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({
  bike,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  onDatesChange,
  className = '',
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({
    checked: true,
    available: bike.available,
    message: bike.available
      ? `✓ Available for your selected dates`
      : `✕ This bike is unavailable for the selected dates.`,
  });
  const [similarBikes, setSimilarBikes] = useState<Bike[]>([]);

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const res = await BikeService.checkAvailability(
        bike.id,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime
      );
      setStatus({
        checked: true,
        available: res.isAvailable,
        message: res.message,
      });

      if (!res.isAvailable) {
        const similars = await BikeService.getSimilarBikes(bike.id, bike.category, bike.pricePerDay);
        setSimilarBikes(similars);
      } else {
        setSimilarBikes([]);
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${className} ${
      status.available
        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        : 'bg-rose-50/70 border-rose-200 text-rose-950'
    }`}>
      {/* Availability Status Header */}
      <div className="flex items-start gap-3">
        {status.available ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <h4 className="font-bold text-sm">
            {status.available ? 'Bike is Available!' : 'Currently Unavailable'}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">{status.message}</p>
        </div>

        <Button
          onClick={handleCheck}
          variant={status.available ? 'outline' : 'primary'}
          size="sm"
          isLoading={isChecking}
          className="text-xs shrink-0"
        >
          Re-Check
        </Button>
      </div>

      {/* Alternate Suggestions when bike is unavailable */}
      {!status.available && similarBikes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-rose-200/80">
          <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Similar bikes available for your dates:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {similarBikes.map((sim) => (
              <Link
                key={sim.id}
                to={`/bikes/${sim.id}`}
                className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-amber-400 text-slate-900 transition-all hover:shadow-xs group"
              >
                <img
                  src={sim.images[0]}
                  alt={sim.name}
                  className="w-12 h-10 object-cover rounded-lg shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate group-hover:text-amber-600">{sim.name}</p>
                  <p className="text-[10px] text-slate-500">₹{sim.pricePerDay}/day • {sim.engineCC}cc</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
