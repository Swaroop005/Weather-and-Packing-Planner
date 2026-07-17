/**
 * Converts Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9/5) + 32);
};

/**
 * Formats a temperature string based on the selected unit
 */
export const formatTemp = (celsius, unit) => {
  if (unit === 'F') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${Math.round(celsius)}°C`;
};
