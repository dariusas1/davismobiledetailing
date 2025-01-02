import axios from 'axios';

// Create axios instance with default configuration
const weatherAPI = axios.create({
  baseURL: process.env.REACT_APP_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
  timeout: 5000,
  params: {
    appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
    units: 'imperial'
  }
});

const getWeather = async (location = 'Santa Cruz') => {
  try {
    const response = await weatherAPI.get('/weather', {
      params: { q: location }
    });
    
    if (response.status !== 200) {
      throw new Error(`Weather API returned status ${response.status}`);
    }
    
    return {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      location: response.data.name,
      source: 'OpenWeather API'
    };
  } catch (error) {
    console.error('Weather service error:', error.message);
    // Return fallback data if API fails
    return {
      temperature: 65,
      description: 'Partly Cloudy',
      location: location || 'Santa Cruz',
      source: 'Fallback Data'
    };
  }
};

const getWeatherRecommendations = (weather) => {
  const recommendations = [];
  
  if (weather.temperature > 85) { // > 85°F
    recommendations.push('Consider interior detailing to protect from heat');
  }
  
  if (weather.description.toLowerCase().includes('rain')) {
    recommendations.push('Opt for water-resistant treatments');
  }
  
  if (weather.temperature < 40) { // < 40°F
    recommendations.push('Choose waxing services for cold weather protection');
  }
  
  return recommendations.length > 0 ? recommendations : [
    'Great day for a complete detailing package!'
  ];
};

export { getWeather, getWeatherRecommendations };
