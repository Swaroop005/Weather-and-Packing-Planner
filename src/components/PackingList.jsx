import { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import { getPackingSuggestions } from '../utils/packingRules';
import { getWeatherCondition } from '../services/api';

const PackingList = ({ weather }) => {
  const [checkedItems, setCheckedItems] = useState({});

  // Reset checked items when weather changes (new city searched)
  useEffect(() => {
    setCheckedItems({});
  }, [weather]);

  if (!weather) return null;

  const current = weather.current;
  const condition = getWeatherCondition(current.weather_code);
  const suggestions = getPackingSuggestions(current, condition);

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="glass-card packing-list">
      <h3 className="section-title">
        <CheckSquare size={20} /> Packing Recommendations
      </h3>
      <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '16px' }}>
        Based on: {condition.text} & {Math.round(current.temperature_2m)}°C
      </p>
      
      <ul className="packing-items">
        {suggestions.map(item => {
          const isChecked = !!checkedItems[item.id];
          return (
            <li 
              key={item.id} 
              className={`packing-item ${isChecked ? 'checked' : ''}`}
              onClick={() => toggleCheck(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`checkbox ${isChecked ? 'checked' : ''}`}>
                {isChecked && <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
              </div>
              <span>{item.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PackingList;
