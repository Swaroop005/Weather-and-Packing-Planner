import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app we might reverse-geocode here, but for this we can 
        // fetch weather directly or try to reverse geocode via another API.
        // Open-Meteo doesn't have a direct reverse geocoding to city name.
        // Let's mock a reverse geocode by just passing coordinates up if needed, 
        // but our main API needs a city name. Actually, open-meteo weather API takes lat/lon directly!
        // We can just pass the coordinates to a special onLocation prop.
        onSearch(`lat:${latitude},lon:${longitude}`, true); // Hack to pass lat/lon
      },
      (error) => {
        alert('Unable to retrieve your location');
      }
    );
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flex: 1 }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city... (e.g., London)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="btn" disabled={isLoading || !query.trim()}>
          {isLoading ? '...' : <><Search size={18} /> Search</>}
        </button>
      </form>
      <button 
        type="button" 
        className="btn btn-icon" 
        onClick={handleGeolocation}
        title="Use my location"
        disabled={isLoading}
      >
        <MapPin size={18} />
      </button>
    </div>
  );
};

export default SearchBar;
