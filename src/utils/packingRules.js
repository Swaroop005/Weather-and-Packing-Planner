/**
 * Evaluates weather conditions and returns an array of packing suggestions
 * @param {Object} current_weather - The current weather object from Open-Meteo
 * @param {Object} condition - The parsed condition object { text, icon, type }
 */
export const getPackingSuggestions = (current_weather, condition) => {
  const suggestions = [];
  const tempC = current_weather.temperature_2m;
  const type = condition.type; // 'clear', 'clouds', 'rain', 'snow'
  
  // Rule 1: Rain/Thunderstorm
  if (type === 'rain') {
    suggestions.push({ id: 'umbrella', text: '☔ Pack an umbrella!' });
    suggestions.push({ id: 'raincoat', text: '🧥 Waterproof Rain Coat' });
  }

  // Rule 2: Snow
  if (type === 'snow') {
    suggestions.push({ id: 'boots', text: '🥾 Waterproof boots' });
    suggestions.push({ id: 'scarf', text: '🧣 Warm Scarf' });
  }

  // Rule 3: Cold (< 10°C)
  if (tempC < 10) {
    suggestions.push({ id: 'coat', text: '🧥 Heavy coat' });
    suggestions.push({ id: 'gloves', text: '🧤 Gloves' });
  } else if (tempC >= 10 && tempC < 20) {
    suggestions.push({ id: 'jacket', text: '🧥 Light Jacket or Sweater' });
  }

  // Rule 4: Hot (> 30°C)
  if (tempC >= 30) {
    suggestions.push({ id: 'light_clothes', text: '🩳 Light clothing' });
    suggestions.push({ id: 'sunscreen', text: '🧴 Sunscreen' });
    suggestions.push({ id: 'water', text: '💧 Reusable Water Bottle' });
  }

  // Rule 5: Sunny
  if (type === 'clear' && tempC > 15) {
    suggestions.push({ id: 'sunglasses', text: '🕶️ Sunglasses' });
  }

  // Rule 6: High Wind (> 20 km/h)
  if (current_weather.wind_speed_10m > 20) {
    suggestions.push({ id: 'windbreaker', text: '🪁 Windbreaker' });
  }

  // Default if nothing matches
  if (suggestions.length === 0) {
    suggestions.push({ id: 'comfortable', text: '👕 Comfortable everyday clothes' });
  }

  return suggestions;
};
