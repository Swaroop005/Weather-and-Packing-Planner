// Initialize icons
feather.replace();

// API Configuration
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

let currentUnit = 'C';
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// --- DOM Elements ---
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const locationBtn = document.getElementById('location-btn');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');
const dashboard = document.getElementById('dashboard');
const historyContainer = document.getElementById('search-history');
const historyPills = document.getElementById('history-pills');
const weatherBg = document.getElementById('weather-background');

const unitC = document.getElementById('unit-c');
const unitF = document.getElementById('unit-f');

const locNameEl = document.getElementById('location-name');
const curTempEl = document.getElementById('current-temp');
const curCondTextEl = document.getElementById('current-condition-text');
const curCondIconEl = document.getElementById('current-condition-icon');
const curHumEl = document.getElementById('current-humidity');
const curWindEl = document.getElementById('current-wind');

const packingBasedOn = document.getElementById('packing-based-on');
const packingItemsContainer = document.getElementById('packing-items');
const forecastContainer = document.getElementById('forecast-container');

// --- Utilities ---
const celsiusToFahrenheit = (c) => Math.round((c * 9/5) + 32);

const formatTemp = (tempC) => {
    return currentUnit === 'C' ? `${Math.round(tempC)}°C` : `${celsiusToFahrenheit(tempC)}°F`;
};

const getConditionInfo = (code) => {
    if (code <= 1) return { text: 'Clear Sky', icon: '☀️', type: 'clear' };
    if (code <= 3) return { text: 'Cloudy', icon: '☁️', type: 'clouds' };
    if (code <= 48) return { text: 'Fog', icon: '🌫️', type: 'clouds' };
    if (code <= 67) return { text: 'Rain', icon: '🌧️', type: 'rain' };
    if (code <= 77) return { text: 'Snow', icon: '❄️', type: 'snow' };
    if (code <= 82) return { text: 'Heavy Rain', icon: '⛈️', type: 'rain' };
    if (code <= 86) return { text: 'Heavy Snow', icon: '❄️', type: 'snow' };
    if (code <= 99) return { text: 'Thunderstorm', icon: '🌩️', type: 'rain' };
    return { text: 'Unknown', icon: '❓', type: 'clear' };
};

// --- Theme & Background Logic ---
const applyTheme = (bgStart, bgEnd, accentColor) => {
    document.documentElement.style.setProperty('--bg-gradient-start', bgStart);
    document.documentElement.style.setProperty('--bg-gradient-end', bgEnd);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Update SVG icons color where necessary by re-running feather.replace() is slow, 
    // but CSS var(--accent-color) handles it automatically!
};

const updateBackground = (conditionType, tempC) => {
    let bgStart = '#312e81', bgEnd = '#0f172a', accentColor = '#818cf8'; // Default

    if (conditionType === 'clear') {
        if (tempC > 25) {
            bgStart = '#1e3a8a'; bgEnd = '#ea580c'; accentColor = '#fdba74'; // Hot
        } else {
            bgStart = '#0284c7'; bgEnd = '#1e3a8a'; accentColor = '#7dd3fc'; // Cool clear
        }
    } else if (conditionType === 'rain') {
        bgStart = '#334155'; bgEnd = '#0f172a'; accentColor = '#94a3b8'; // Rain
    } else if (conditionType === 'snow') {
        bgStart = '#475569'; bgEnd = '#1e293b'; accentColor = '#cbd5e1'; // Snow
    } else if (conditionType === 'clouds') {
        bgStart = '#4b5563'; bgEnd = '#1f2937'; accentColor = '#9ca3af'; // Clouds
    }
    
    applyTheme(bgStart, bgEnd, accentColor);
    renderBackgroundAnimations(conditionType);
};

const renderBackgroundAnimations = (type) => {
    weatherBg.innerHTML = ''; // Clear existing
    if (!type || type === 'clear') {
        const colors = ['rgba(147, 51, 234, 0.4)', 'rgba(59, 130, 246, 0.4)', 'rgba(236, 72, 153, 0.3)', 'rgba(16, 185, 129, 0.2)'];
        for (let i = 0; i < 4; i++) {
            const el = document.createElement('div');
            el.className = 'aurora-orb';
            el.style.top = `${Math.random() * 60 - 10}vh`;
            el.style.left = `${Math.random() * 80 - 10}vw`;
            el.style.width = `${Math.random() * 30 + 40}vw`;
            el.style.height = `${Math.random() * 30 + 40}vw`;
            el.style.background = colors[i];
            el.style.animationDuration = `${15 + Math.random() * 10}s`;
            el.style.animationDelay = `-${Math.random() * 10}s`;
            weatherBg.appendChild(el);
        }
    } else if (type === 'rain') {
        for (let i = 0; i < 60; i++) {
            const el = document.createElement('div');
            el.className = 'rain-drop';
            el.style.left = `${Math.random() * 100}vw`;
            el.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            el.style.animationDelay = `${Math.random() * 2}s`;
            el.style.opacity = 0.3 + Math.random() * 0.4;
            weatherBg.appendChild(el);
        }
    } else if (type === 'snow') {
        for (let i = 0; i < 50; i++) {
            const el = document.createElement('div');
            el.className = 'snow-flake';
            const size = Math.random() * 6 + 4;
            el.style.left = `${Math.random() * 100}vw`;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.animationDuration = `${5 + Math.random() * 5}s`;
            el.style.animationDelay = `${Math.random() * 5}s`;
            el.style.opacity = 0.4 + Math.random() * 0.5;
            weatherBg.appendChild(el);
        }
    } else if (type === 'clouds') {
        for (let i = 0; i < 5; i++) {
            const el = document.createElement('div');
            el.className = 'cloud-shape';
            const size = Math.random() * 200 + 200;
            el.style.top = `${Math.random() * 40}vh`;
            el.style.width = `${size}px`;
            el.style.height = `${size * 0.6}px`;
            el.style.animationDuration = `${30 + Math.random() * 30}s`;
            el.style.animationDelay = `-${Math.random() * 30}s`;
            weatherBg.appendChild(el);
        }
    }
};

// --- Packing Logic ---
const getPackingSuggestions = (tempC, conditionType) => {
    const items = [];
    items.push({ id: 'id-phone', label: 'Smartphone & Charger', icon: 'smartphone' });
    if (tempC > 25) {
        items.push({ id: 'id-sunscreen', label: 'Sunscreen', icon: 'sun' });
        items.push({ id: 'id-water', label: 'Reusable Water Bottle', icon: 'droplet' });
        items.push({ id: 'id-light', label: 'Light clothing', icon: 'wind' });
    } else if (tempC < 10) {
        items.push({ id: 'id-coat', label: 'Heavy Coat', icon: 'cloud' });
        items.push({ id: 'id-gloves', label: 'Gloves & Beanie', icon: 'thermometer' });
    } else {
        items.push({ id: 'id-jacket', label: 'Light Jacket', icon: 'wind' });
    }
    
    if (conditionType === 'rain') {
        items.push({ id: 'id-umbrella', label: 'Umbrella', icon: 'umbrella' });
        items.push({ id: 'id-boots', label: 'Waterproof Boots', icon: 'droplet' });
    }
    return items;
};

// --- Core App Logic ---
let currentWeatherData = null; // Store for unit toggling

const renderHistory = () => {
    if (searchHistory.length === 0) {
        historyContainer.style.display = 'none';
        return;
    }
    historyContainer.style.display = 'flex';
    historyPills.innerHTML = '';
    searchHistory.forEach(city => {
        const pill = document.createElement('span');
        pill.className = 'history-pill';
        pill.textContent = city;
        pill.onclick = () => doSearch(city);
        historyPills.appendChild(pill);
    });
};

const doSearch = async (query, isLatLon = false) => {
    errorMessage.style.display = 'none';
    dashboard.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {
        let lat, lon, name;
        if (isLatLon) {
            const parts = query.split(',');
            lat = parseFloat(parts[0].split(':')[1]);
            lon = parseFloat(parts[1].split(':')[1]);
            name = "Your Location";
        } else {
            const geoRes = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();
            if (!geoData.results || geoData.results.length === 0) throw new Error('City not found');
            lat = geoData.results[0].latitude;
            lon = geoData.results[0].longitude;
            name = geoData.results[0].name;
            
            // Update History
            searchHistory = [name, ...searchHistory.filter(c => c !== name)].slice(0, 5);
            localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
            renderHistory();
        }

        const weatherRes = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=8`);
        currentWeatherData = await weatherRes.json();
        
        renderDashboard(name);

    } catch (err) {
        errorMessage.textContent = `Error: ${err.message}`;
        errorMessage.style.display = 'flex';
        // Reset to aurora
        updateBackground(null, 20);
    } finally {
        loadingSpinner.style.display = 'none';
    }
};

const renderDashboard = (cityName) => {
    if (!currentWeatherData) return;
    const current = currentWeatherData.current;
    const cond = getConditionInfo(current.weather_code);
    
    // Update theme and bg
    updateBackground(cond.type, current.temperature_2m);
    
    // Update current weather UI
    locNameEl.textContent = cityName;
    curTempEl.textContent = formatTemp(current.temperature_2m);
    curCondTextEl.textContent = cond.text;
    curCondIconEl.textContent = cond.icon;
    curHumEl.textContent = `${current.relative_humidity_2m}%`;
    curWindEl.textContent = `${current.wind_speed_10m} km/h`;
    
    // Update packing list
    packingBasedOn.textContent = `${cond.text} & ${Math.round(current.temperature_2m)}°C`;
    const packingItems = getPackingSuggestions(current.temperature_2m, cond.type);
    packingItemsContainer.innerHTML = '';
    packingItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'packing-item';
        div.innerHTML = `
            <div class="checkbox" onclick="this.classList.toggle('checked')"><i data-feather="check" style="width: 14px; color: white;"></i></div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <i data-feather="${item.icon}" style="width: 16px; color: var(--accent-color);"></i>
                ${item.label}
            </div>
        `;
        packingItemsContainer.appendChild(div);
    });
    
    // Update forecast
    forecastContainer.innerHTML = '';
    for(let i=1; i<8; i++) {
        const dateStr = currentWeatherData.daily.time[i];
        const dateObj = new Date(dateStr);
        // Correct timezone issue
        dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
        const dayName = i === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        
        const fCond = getConditionInfo(currentWeatherData.daily.weather_code[i]);
        
        const card = document.createElement('div');
        card.className = 'forecast-card glass-card';
        card.style.background = 'rgba(0,0,0,0.2)';
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon">${fCond.icon}</div>
            <div class="forecast-temps">
                <span class="temp-max">${formatTemp(currentWeatherData.daily.temperature_2m_max[i])}</span>
                <span class="temp-min" style="color: rgba(255,255,255,0.5)">/ ${formatTemp(currentWeatherData.daily.temperature_2m_min[i])}</span>
            </div>
            <div class="forecast-condition" style="font-size: 0.85rem; color: rgba(255,255,255,0.7)">${fCond.text}</div>
        `;
        forecastContainer.appendChild(card);
    }
    
    feather.replace(); // refresh icons
    dashboard.style.display = 'block';
};

// --- Event Listeners ---
searchForm.onsubmit = (e) => {
    e.preventDefault();
    if(searchInput.value.trim()) doSearch(searchInput.value.trim());
};

locationBtn.onclick = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            doSearch(`lat:${pos.coords.latitude},lon:${pos.coords.longitude}`, true);
        }, () => alert("Could not get location."));
    }
};

const setUnit = (unit) => {
    currentUnit = unit;
    if (unit === 'C') {
        unitC.className = 'active';
        unitF.className = 'inactive';
    } else {
        unitC.className = 'inactive';
        unitF.className = 'active';
    }
    if (currentWeatherData) renderDashboard(locNameEl.textContent);
};
document.getElementById('unit-toggle').onclick = () => setUnit(currentUnit === 'C' ? 'F' : 'C');

// --- Initialization ---
renderHistory();
renderBackgroundAnimations(); // Start with aurora
