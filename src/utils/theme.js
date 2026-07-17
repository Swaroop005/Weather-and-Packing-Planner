/**
 * Determines CSS variable values based on weather type and temperature
 */
export const getThemeForWeather = (conditionType, tempC) => {
  // Default values
  let bgStart = '#312e81';
  let bgEnd = '#0f172a';
  let accentColor = '#818cf8';
  
  if (conditionType === 'clear') {
    if (tempC > 25) {
      // Hot and sunny -> sunset vibe or deep blue to peach
      bgStart = '#1e3a8a'; // blue-900
      bgEnd = '#ea580c';   // orange-600
      accentColor = '#fdba74'; // orange-300
    } else {
      // Clear but not hot -> beautiful deep sky blue
      bgStart = '#0284c7'; // sky-600
      bgEnd = '#1e3a8a';   // blue-900
      accentColor = '#7dd3fc'; // sky-300
    }
  } else if (conditionType === 'rain') {
    // Rain -> moody dark blues and purples
    bgStart = '#334155'; // slate-700
    bgEnd = '#0f172a';   // slate-900
    accentColor = '#94a3b8'; // slate-400
  } else if (conditionType === 'snow') {
    // Snow -> icy dark blues
    bgStart = '#475569'; // slate-600
    bgEnd = '#1e293b';   // slate-800
    accentColor = '#cbd5e1'; // slate-300
  } else if (conditionType === 'clouds') {
    // Clouds -> neutral sophisticated grays
    bgStart = '#4b5563'; // gray-600
    bgEnd = '#1f2937';   // gray-800
    accentColor = '#9ca3af'; // gray-400
  }

  return { bgStart, bgEnd, accentColor };
};

export const applyTheme = (bgStart, bgEnd, accentColor) => {
  document.documentElement.style.setProperty('--bg-gradient-start', bgStart);
  document.documentElement.style.setProperty('--bg-gradient-end', bgEnd);
  document.documentElement.style.setProperty('--accent-color', accentColor);
};
