import React, { useState } from 'react';

interface BikeGalleryProps {
  images: string[];
  bikeName: string;
}

export const BikeGallery: React.FC<BikeGalleryProps> = ({ images, bikeName }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="space-y-3">
      {/* Active Hero Image */}
      <div className="relative h-72 sm:h-96 md:h-[450px] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md">
        <img
          src={displayImages[activeIndex]}
          alt={`${bikeName} view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700">
          Photo {activeIndex + 1} of {displayImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'border-amber-500 scale-105 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${bikeName} thumb ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
