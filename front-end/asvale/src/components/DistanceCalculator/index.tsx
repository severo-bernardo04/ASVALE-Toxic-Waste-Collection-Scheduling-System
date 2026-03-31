import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

const ASVALE_ADDRESS = 'R. Zeferino Oliveira, 2 - Belizário, Santiago - RS, 97711-300';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -29.1917, // Aproximação de latitude de Santiago - RS
  lng: -54.8666, // Aproximação de longitude de Santiago - RS
};

const libraries = ['places', 'geometry'] as (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'visualization'
)[];

const DistanceCalculator: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDistance('');
    setDuration('');
    setDirections(null);

    if (!window.google) {
      setError('Google Maps não carregado.');
      setLoading(false);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: ASVALE_ADDRESS,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance?.text || '');
          setDuration(leg.duration?.text || '');
        } else {
          setError('Endereço não encontrado ou erro na API.');
        }
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h2>Calcular Distância até a Asvale</h2>
      <form onSubmit={handleCalculate}>
        <input
          type="text"
          placeholder="Digite seu endereço ou CEP"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
          required
        />
        <button type="submit" disabled={loading || !isLoaded} style={{ width: '100%', padding: 8 }}>
          {loading ? 'Calculando...' : 'Calcular Distância'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {distance && duration && (
        <div style={{ marginTop: 16 }}>
          <strong>Distância:</strong> {distance}<br />
          <strong>Duração estimada:</strong> {duration}
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default DistanceCalculator; 