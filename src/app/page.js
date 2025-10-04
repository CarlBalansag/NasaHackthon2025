"use client"
import { useState } from 'react';
import { Search, Bell, User, MapPin, Plus, Sun, Moon, Cloud, CloudRain, CloudSnow, ArrowUp, ArrowDown } from 'lucide-react';

export default function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 2) {
      setIsLoadingLocations(true);
      setShowDropdown(true);
      
      try {
        const response = await fetch(
          'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(value) + '&count=10&language=en&format=json'
        );
        const data = await response.json();
        
        if (data.results) {
          const locations = data.results.map(result => ({
            city: result.name,
            state: result.admin1 || '',
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude
          }));
          setFilteredLocations(locations);
        } else {
          setFilteredLocations([]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setFilteredLocations([]);
      } finally {
        setIsLoadingLocations(false);
      }
    } else {
      setShowDropdown(false);
      setFilteredLocations([]);
    }
  };

  const handleLocationSelect = (location) => {
    const locationString = location.city + (location.state ? ', ' + location.state : '') + ', ' + location.country;
    setSearchQuery(locationString);
    setShowDropdown(false);
    setFilteredLocations([]);
  };

  const currentLocation = {
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    temp: 12,
    condition: 'Partly Cloudy',
    time: 'Monday, 07:43 AM',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  };

  const todayHighlights = {
    precipitation: '2%',
    humidity: '87%',
    wind: '0 km/h',
    sunrise: '6:18 am',
    sunset: '7:27 pm'
  };

  const hourlyData = [
    { time: '6 am', temp: 10 },
    { time: '9 am', temp: 14 },
    { time: '12 pm', temp: 18 },
    { time: '03 pm', temp: 22 },
    { time: '06 pm', temp: 19 },
    { time: '09 pm', temp: 14 },
    { time: '12 am', temp: 12 },
    { time: '03 am', temp: 10 }
  ];

  const rainChances = [
    { time: '09 am', chance: 20 },
    { time: '12 pm', chance: 75 },
    { time: '03 pm', chance: 50 },
    { time: '06 pm', chance: 95 },
    { time: '09 pm', chance: 55 },
    { time: '12 am', chance: 15 },
    { time: '03 am', chance: 10 }
  ];

  const threeDayForecast = [
    { day: 'Tuesday', condition: 'Cloudy', icon: 'cloudy', high: 26, low: 11 },
    { day: 'Wednesday', condition: 'Rainy', icon: 'rainy', high: 26, low: 11 },
    { day: 'Thursday', condition: 'Snowfall', icon: 'snow', high: 26, low: 11 }
  ];

  const getWeatherIcon = (condition) => {
    if (condition === 'cloudy') {
      return <Cloud className="w-8 h-8 text-white" />;
    }
    if (condition === 'rainy') {
      return <CloudRain className="w-8 h-8 text-white" />;
    }
    if (condition === 'snow') {
      return <CloudSnow className="w-8 h-8 text-white" />;
    }
    return <Sun className="w-8 h-8 text-white" />;
  };

  const getRainColor = (chance) => {
    if (chance >= 80) {
      return 'bg-indigo-900';
    }
    if (chance >= 50) {
      return 'bg-indigo-600';
    }
    if (chance >= 30) {
      return 'bg-indigo-400';
    }
    return 'bg-indigo-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-2xl flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                placeholder="Search here"
                className="w-full px-4 py-3 pl-4 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isLoadingLocations ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="mt-2">Searching locations...</p>
                    </div>
                  ) : filteredLocations.length > 0 ? (
                    filteredLocations.map((location, index) => (
                      <div
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="font-semibold text-gray-800">{location.city}</p>
                            <p className="text-sm text-gray-500">
                              {location.state ? location.state + ', ' : ''}{location.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span className="font-medium">Search</span>
            </button>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white rounded-xl hover:bg-gray-50">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 bg-white rounded-xl hover:bg-gray-50">
              <User className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Current Location</p>
                  <h2 className="text-xl font-semibold text-gray-800">{currentLocation.city}, {currentLocation.state}, {currentLocation.country}</h2>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-72 mb-6">
                <img 
                  src={currentLocation.image} 
                  alt="Location" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-8 h-8" />
                    <span className="text-6xl font-bold">{currentLocation.temp}°C</span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 text-white text-right">
                  <p className="text-lg">{currentLocation.time}</p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <Cloud className="w-5 h-5" />
                    <span>{currentLocation.condition}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500 hover:text-purple-600 cursor-pointer">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add City</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Today's Highlights</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Precipitation</p>
                  <p className="text-3xl font-bold text-gray-800">{todayHighlights.precipitation}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Humidity</p>
                  <p className="text-3xl font-bold text-gray-800">{todayHighlights.humidity}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Wind</p>
                  <p className="text-3xl font-bold text-gray-800">{todayHighlights.wind}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Sunrise & Sunset</p>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Sun className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-gray-800">{todayHighlights.sunrise}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Moon className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-gray-800">{todayHighlights.sunset}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex gap-4 mb-4">
                  <button className="px-4 py-2 text-sm font-semibold text-gray-800 border-b-2 border-gray-800">Today</button>
                  <button className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-gray-800">Week</button>
                </div>
                
                <div className="relative h-32">
                  <svg className="w-full h-full">
                    <polyline
                      points={hourlyData.map((d, i) => {
                        const x = (i / (hourlyData.length - 1)) * 100;
                        const y = 100 - (d.temp / 25) * 100;
                        return x + ',' + y;
                      }).join(' ')}
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {hourlyData.map((d, i) => {
                      const x = (i / (hourlyData.length - 1)) * 100;
                      const y = 100 - (d.temp / 25) * 100;
                      return (
                        <g key={i}>
                          <circle
                            cx={x + '%'}
                            cy={y + '%'}
                            r="4"
                            fill="#818CF8"
                          />
                          <text
                            x={x + '%'}
                            y={(y - 8) + '%'}
                            textAnchor="middle"
                            className="text-xs fill-gray-700 font-semibold"
                          >
                            {d.temp}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="flex justify-between mt-2">
                    {hourlyData.map((d, i) => (
                      <span key={i} className="text-xs text-gray-500">{d.time}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Chance of Rain</h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                  </div>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {rainChances.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-16">{item.time}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={'h-full rounded-full transition-all duration-500 ' + getRainColor(item.chance)}
                        style={{ width: item.chance + '%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs text-gray-500 px-16">
                <span>Sunny</span>
                <span>Rainy</span>
                <span>Heavy Rain</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">3 Days Forecast</h3>
              
              <div className="space-y-4">
                {threeDayForecast.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white">
                        <ArrowUp className="w-4 h-4" />
                        <span className="text-lg font-semibold">{day.high}°</span>
                        <ArrowDown className="w-4 h-4" />
                        <span className="text-lg font-semibold">{day.low}°</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <div className="bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-xl p-3">
                        {getWeatherIcon(day.icon)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{day.day}</p>
                        <p className="text-sm text-gray-500">{day.condition}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}