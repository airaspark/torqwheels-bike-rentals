import React from 'react';
import { Bike, Search, CalendarX, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: 'bike' | 'search' | 'calendar' | 'alert';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'bike',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'search':
        return <Search className="w-12 h-12 text-slate-400" />;
      case 'calendar':
        return <CalendarX className="w-12 h-12 text-slate-400" />;
      case 'alert':
        return <AlertCircle className="w-12 h-12 text-amber-500" />;
      case 'bike':
      default:
        return <Bike className="w-12 h-12 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-lg mx-auto my-6">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-md">{description}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="primary" size="md">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline" size="md">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
