export const searchAddress = async (query) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    return data.map(result => ({
      displayName: result.display_name,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      address: {
        city: result.address.city || result.address.town || result.address.village,
        state: result.address.state,
        country: result.address.country,
        postcode: result.address.postcode
      }
    }));
  } catch (error) {
    console.error('Location service error:', error);
    return [];
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch reverse geocode data');
    }
    
    const data = await response.json();
    
    return {
      displayName: data.display_name,
      address: {
        city: data.address.city || data.address.town || data.address.village,
        state: data.address.state,
        country: data.address.country,
        postcode: data.address.postcode
      }
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
};
