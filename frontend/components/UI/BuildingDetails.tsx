import React, { useState } from 'react';
import { Building } from '@/lib/types';
import { Navigation, Menu as MenuIcon, X, Footprints, Car, Bike } from 'lucide-react';

interface BuildingDetailsProps {
  building: Building | null;
  onClose: () => void;
  onNavigate: (mode: 'driving' | 'walking' | 'cycling') => void;
  isNavigating: boolean;
}

export default function BuildingDetails({ building, onClose, onNavigate, isNavigating }: BuildingDetailsProps) {
  if (!building) return null;

  const [mode, setMode] = useState<'driving' | 'walking' | 'cycling'>('walking');

  return (
    <div className="absolute bottom-0 left-0 right-0 sm:top-20 sm:left-auto sm:right-4 sm:bottom-auto sm:w-96 bg-white shadow-xl rounded-t-xl sm:rounded-xl z-[1000] p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-gray-900">{building.name}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
         {building.image_url ? (
            <img src={building.image_url} alt={building.name} className="w-full h-full object-cover" />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
         )}
      </div>

      <p className="text-gray-600 text-sm mb-4">
        {building.description || "No description available."}
      </p>

      {/* Mode Selector */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
        <button 
          onClick={() => setMode('walking')} 
          className={`flex-1 flex items-center justify-center py-1 rounded-md text-sm transition ${mode === 'walking' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Footprints size={16} className="mr-1" /> Walk
        </button>
        <button 
          onClick={() => setMode('driving')} 
          className={`flex-1 flex items-center justify-center py-1 rounded-md text-sm transition ${mode === 'driving' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Car size={16} className="mr-1" /> Drive
        </button>
        <button 
          onClick={() => setMode('cycling')} 
          className={`flex-1 flex items-center justify-center py-1 rounded-md text-sm transition ${mode === 'cycling' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Bike size={16} className="mr-1" /> Cycle
        </button>
      </div>

      <button 
        onClick={() => onNavigate(mode)}
        disabled={isNavigating}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-blue-400"
      >
        <Navigation className="h-5 w-5" />
        {isNavigating ? 'Calculating Route...' : `Navigate (${mode.charAt(0).toUpperCase() + mode.slice(1)})`}
      </button>
    </div>
  );
}
