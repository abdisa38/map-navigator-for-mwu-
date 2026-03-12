'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCategories, getBuildings, getCampusBoundary, getRoute } from '@/lib/api';
import { Category, Building, CampusBoundary } from '@/lib/types';
import FiltersBar from '@/components/UI/FiltersBar';
import SearchBox from '@/components/UI/SearchBox';
import BuildingList from '@/components/UI/BuildingList';
import BuildingDetails from '@/components/UI/BuildingDetails';
import clsx from 'clsx';
import { Menu, ChevronLeft } from 'lucide-react';

// Dynamic import for Leaflet map (SSO false)
const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Loading Map...</div>
});

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allBuildings, setAllBuildings] = useState<Building[]>([]); // Store ALL buildings
  const [buildings, setBuildings] = useState<Building[]>([]); // Store filtered buildings
  const [campusBoundary, setCampusBoundary] = useState<CampusBoundary | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Initial Load
  useEffect(() => {
    // Check auth
    if (typeof window !== 'undefined') {
        setUserRole(localStorage.getItem('user_role'));
    }

    const fetchData = async () => {
      try {
        const [cats, bound, allB] = await Promise.all([
          getCategories(), 
          getCampusBoundary(),
          getBuildings() // Fetch ALL buildings once
        ]);
        setCategories(cats);
        setAllBuildings(allB);
        setBuildings(allB); // Init filtered with all
        setCampusBoundary(bound);
      } catch (e) {
        console.error("Failed to load init data", e);
        setError("Failed to load initial data. Check backend connection.");
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      setUserRole(null);
      if (router) router.push('/');
  };
  
  // Client-side filtering
  useEffect(() => {
    let result = allBuildings;
    
    if (selectedCategory) {
      result = result.filter(b => b.category?.slug === selectedCategory);
    }
    
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(b => b.name.toLowerCase().includes(lowerQ));
    }
    
    setBuildings(result);
  }, [selectedCategory, searchQuery, allBuildings]);

/*
  // Fetch Buildings when filters change -- REMOVED in favor of client-side filtering
  useEffect(() => {
    const fetchBuildings = async () => {
      setError(null);
      try {
        const data = await getBuildings(selectedCategory || undefined, searchQuery);
        setBuildings(data);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch buildings. Ensure backend is running.");
      }
    };
    fetchBuildings();
  }, [selectedCategory, searchQuery]);
*/

  const handleNavigate = async (mode: 'driving' | 'walking' | 'cycling' = 'driving') => {
    if (!selectedBuilding) return;
    
    setIsNavigating(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsNavigating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // In real OSRM, we need start and end points
          const response = await getRoute(
             [latitude, longitude], 
             [selectedBuilding.latitude, selectedBuilding.longitude],
             mode
          );

          if (response.routes && response.routes.length > 0) {
              setRouteGeoJSON(response.routes[0].geometry);
          } else {
              alert("No route found");
          }
        } catch (error) {
          console.error("Route error", error);
          alert("Failed to calculate route");
        } finally {
          setIsNavigating(false);
        }
      },
      (error) => {
        console.error("Geo error", error);
        alert("Unable to retrieve your location");
        setIsNavigating(false);
      }
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div 
        className={clsx(
            "fixed inset-y-0 left-0 index-20 z-20 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col sm:relative",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0 sm:w-80"
        )}
      >
        {/* Auth Header */}
        <div className="p-3 bg-gray-50 border-b flex justify-between items-center text-sm">
            {userRole ? (
                <div className="flex items-center gap-2 w-full justify-between">
                    <span className="font-semibold truncate text-gray-700 max-w-[100px]">{userRole}</span>
                    <div className="flex gap-2">
                        {userRole === 'admin' && (
                            <a href="/admin" className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Admin</a>
                        )}
                        <button onClick={handleLogout} className="text-xs text-red-600 hover:text-red-800">Logout</button>
                    </div>
                </div>
            ) : (
                <div className="w-full flex justify-between">
                   <span className="text-gray-500">Welcome!</span>
                   <div className="space-x-2">
                     <a href="/login" className="text-blue-600 font-medium hover:underline">Login</a>
                     <a href="/register" className="text-green-600 font-medium hover:underline">Join</a>
                   </div>
                </div>
            )}
        </div>

        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-900">MWU Navigator</h1>
            <button className="sm:hidden" onClick={() => setIsSidebarOpen(false)}>
                <ChevronLeft />
            </button>
        </div>
        
        <div className="p-4 flex flex-col h-full overflow-hidden">
            <SearchBox 
                buildings={allBuildings} 
                onSearch={setSearchQuery} 
                onSelectResult={(b) => {
                    setSelectedBuilding(b);
                    setSearchQuery(b.name);
                    if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
            />
            <FiltersBar 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
            />
            <div className="mt-4 flex-1 overflow-hidden flex flex-col">
                {error ? (
                  <div className="p-4 mr-4 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                    {error}
                  </div>
                ) : (
                  <BuildingList 
                      buildings={buildings} 
                      onSelect={(b) => {
                          setSelectedBuilding(b);
                          if (window.innerWidth < 640) setIsSidebarOpen(false);
                      }}
                      isLoading={false}
                  />
                )}
            </div>
        </div>
      </div>

      {/* Main Content (Map) */}
      <div className="flex-1 relative h-full">
        {/* Mobile Toggle */}
        {!isSidebarOpen && (
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-4 left-4 z-10 bg-white p-2 rounded-md shadow-md sm:hidden"
             >
                <Menu />
             </button>
        )}

        <MapView 
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            onMarkerClick={setSelectedBuilding}
            campusBoundary={campusBoundary}
            routeGeoJSON={routeGeoJSON}
        />
        
        <BuildingDetails 
            building={selectedBuilding} 
            onClose={() => setSelectedBuilding(null)}
            onNavigate={(mode: 'driving' | 'walking' | 'cycling' = 'driving') => handleNavigate(mode)}
            isNavigating={isNavigating}
        />
      </div>
    </div>
  );
}
