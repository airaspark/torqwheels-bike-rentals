import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading bikes & availability...',
}) => {
  const sizeMap = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className={`animate-spin rounded-full border-amber-500 border-t-transparent ${sizeMap[size]}`}
        role="status"
        aria-label="Loading"
      />
      {label && <p className="mt-3 text-sm font-medium text-slate-600">{label}</p>}
    </div>
  );
};
