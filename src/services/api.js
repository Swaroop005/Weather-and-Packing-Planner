const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches for a city and returns its coordinates and details
 */
export const searchCity = async (query) => {
  if (!query) return null;
  
  try {
    const response = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('City not found');
    }
    
    return data.results[0]; // { id, name, latitude, longitude, timezone, country_code }
  } catch (error) {
    console.error("Geocoding Error:", error);
    throw error;
  }
};

/**
 * Fetches current weather and 3-day forecast for given coordinates
 */
export const getWeather = async (lat, lon) => {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      forecast_days: 8 // Get today + 7 days
    });

    const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};

/**
 * Maps WMO Weather codes to descriptive text and icons
 * https://open-meteo.com/en/docs
 */
export const getWeatherCondition = (code) => {
  if (code === 0) return { text: 'Clear Sky', icon: '☀️', type: 'clear' };
  if (code === 1 || code === 2 || code === 3) return { text: 'Partly Cloudy', icon: '⛅', type: 'clouds' };
  if (code === 45 || code === 48) return { text: 'Fog', icon: '🌫️', type: 'clouds' };
  if (code >= 51 && code <= 57) return { text: 'Drizzle', icon: '🌧️', type: 'rain' };
  if (code >= 61 && code <= 67) return { text: 'Rain', icon: '🌧️', type: 'rain' };
  if (code >= 71 && code <= 77) return { text: 'Snow', icon: '❄️', type: 'snow' };
  if (code >= 80 && code <= 82) return { text: 'Rain Showers', icon: '🌦️', type: 'rain' };
  if (code >= 85 && code <= 86) return { text: 'Snow Showers', icon: '🌨️', type: 'snow' };
  if (code >= 95 && code <= 99) return { text: 'Thunderstorm', icon: '⛈️', type: 'rain' };
  
  return { text: 'Unknown', icon: '🌈', type: 'clear' };
};
