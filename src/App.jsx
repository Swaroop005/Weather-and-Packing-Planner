import { useState, useEffect } from 'react';
import { CloudRain } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import PackingList from './components/PackingList';
import SearchHistory from './components/SearchHistory';
import WeatherBackground from './components/WeatherBackground';
import { searchCity, getWeather, getWeatherCondition } from './services/api';
import { getThemeForWeather, applyTheme } from './utils/theme';

function App() {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('weatherSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    if (weather) return; // Stop demo if we have actual weather data
    
    const interval = setInterval(() => {
      setDemoIndex(prev => (prev + 1) % 4); // 4 states: aurora, heat, snow, rain
    }, 3000);
    
    return () => clearInterval(interval);
  }, [weather]);

  useEffect(() => {
    if (weather) return;
    
    const demoStates = [
      { condition: null, temp: 20 },      // Aurora
      { condition: 'clear', temp: 35 },   // Heat
      { condition: 'snow', temp: -5 },    // Cool/Snow
      { condition: 'rain', temp: 15 }     // Rain
    ];
    
    const currentDemo = demoStates[demoIndex];
    
    if (currentDemo.condition === null) {
      applyTheme('#312e81', '#0f172a', '#818cf8');
    } else {
      const { bgStart, bgEnd, accentColor } = getThemeForWeather(currentDemo.condition, currentDemo.temp);
      applyTheme(bgStart, bgEnd, accentColor);
    }
  }, [demoIndex, weather]);

  const saveToHistory = (cityName) => {
    setHistory(prev => {
      const newHistory = [cityName, ...prev.filter(c => c !== cityName)].slice(0, 5);
      localStorage.setItem('weatherSearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = async (query, isLatLon = false) => {
    setIsLoading(true);
    setError(null);
    setWeather(null); // Clear old data to prevent stale UI during fetch

    try {
      let locationData;
      let displayCityName;

      if (isLatLon) {
        // Query is in format lat:X,lon:Y
        const parts = query.split(',');
        const lat = parseFloat(parts[0].split(':')[1]);
        const lon = parseFloat(parts[1].split(':')[1]);
        locationData = { latitude: lat, longitude: lon, name: "Your Location", country: "" };
        displayCityName = "Your Location";
      } else {
        locationData = await searchCity(query);
        displayCityName = locationData.name;
      }

      const weatherData = await getWeather(locationData.latitude, locationData.longitude);
      
      setCity(locationData);
      setWeather(weatherData);

      // Add to history if it's a real city search
      if (!isLatLon) {
        saveToHistory(locationData.name);
      }

      // Update Theme dynamically
      const condition = getWeatherCondition(weatherData.current.weather_code);
      const tempC = weatherData.current.temperature_2m;
      const { bgStart, bgEnd, accentColor } = getThemeForWeather(condition.type, tempC);
      applyTheme(bgStart, bgEnd, accentColor);

    } catch (err) {
      setError(err.message || 'Something went wrong');
      // Reset theme on error
      applyTheme('#e0c3fc', '#8ec5fc', '#4f46e5');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const currentConditionType = weather 
    ? getWeatherCondition(weather.current.weather_code).type 
    : [null, 'clear', 'snow', 'rain'][demoIndex];

  return (
    <div className="app-container">
      <WeatherBackground conditionType={currentConditionType} />
      <header>
        <h1><CloudRain size={32} color="var(--accent-color)" /> Weather & Packing Planner</h1>
      </header>

      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div className="unit-toggle" style={{ display: 'inline-flex' }} onClick={toggleUnit}>
          <span className={unit === 'C' ? 'active' : 'inactive'}>°C</span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span className={unit === 'F' ? 'active' : 'inactive'}>°F</span>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      
      <SearchHistory history={history} onSelect={(city) => handleSearch(city)} />

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}. Please try again.
        </div>
      )}

      {isLoading && <div className="loading-spinner"></div>}

      {!isLoading && weather && city && (
        <>
          <div className="dashboard-grid">
            <CurrentWeather weather={weather} city={city} unit={unit} />
            <PackingList weather={weather} />
          </div>
          <Forecast weather={weather} unit={unit} />
        </>
      )}
    </div>
  );
}

export default App;
