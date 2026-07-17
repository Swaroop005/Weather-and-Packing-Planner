import { Droplets, Wind } from 'lucide-react';
import { formatTemp } from '../utils/temperature';
import { getWeatherCondition } from '../services/api';

const CurrentWeather = ({ weather, city, unit }) => {
  if (!weather || !city) return null;

  const current = weather.current;
  const condition = getWeatherCondition(current.weather_code);
  const tempDisplay = formatTemp(current.temperature_2m, unit);

  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;

  return (
    <div className="glass-card current-weather">
      <div className="weather-header">
        <div>
          <h2 className="city-name">{city.name}{city.country ? `, ${city.country}` : ''}</h2>
          <div className="weather-status">
            <span>{condition.text}</span>
            <span>{condition.icon}</span>
          </div>
        </div>
      </div>
      
      <div className="weather-temp">
        {tempDisplay}
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <Droplets size={18} />
          <span>{humidity}%</span>
        </div>
        <div className="detail-item">
          <Wind size={18} />
          <span>{windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
