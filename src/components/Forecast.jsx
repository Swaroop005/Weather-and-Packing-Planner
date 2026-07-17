import { formatTemp } from '../utils/temperature';
import { getWeatherCondition } from '../services/api';
import { format, addDays } from 'date-fns';

const Forecast = ({ weather, unit }) => {
  if (!weather || !weather.daily) return null;

  // weather.daily.time is an array of dates, we want the next 7 days.
  // The first item (index 0) is today.
  const forecastDays = [1, 2, 3, 4, 5, 6, 7].map(index => {
    return {
      date: weather.daily.time[index],
      maxTemp: weather.daily.temperature_2m_max[index],
      minTemp: weather.daily.temperature_2m_min[index],
      condition: getWeatherCondition(weather.daily.weather_code[index])
    };
  });

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', overflow: 'hidden' }}>
      <h3 className="section-title" style={{ marginBottom: '20px' }}>7-Day Extended Forecast</h3>
      <div className="forecast-container">
        {forecastDays.map((day, idx) => (
          <div key={day.date} className="forecast-card glass-card" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--card-border)' }}>
            <div className="forecast-day">
              {idx === 0 ? 'Tomorrow' : format(addDays(new Date(), idx + 1), 'EEEE')}
            </div>
            <div className="forecast-icon">
              {day.condition.icon}
            </div>
            <div className="forecast-temps">
              <span className="temp-max">{formatTemp(day.maxTemp, unit)}</span>
              <span className="temp-min" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/ {formatTemp(day.minTemp, unit)}</span>
            </div>
            <div className="forecast-condition" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {day.condition.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
