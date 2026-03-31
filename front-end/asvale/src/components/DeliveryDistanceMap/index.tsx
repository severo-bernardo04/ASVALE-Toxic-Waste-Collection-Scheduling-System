import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

interface DistanceData {
  distance: string;
  duration: string;
  polyline: string;
  price: number;
}

interface Props {
  destination: string;
  onPriceChange?: (price: number) => void;
  onError?: (error: string) => void;
}

const containerStyle = {
  width: '300px',
  height: '200px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
};

const center = {
  lat: -29.1917,
  lng: -54.8666,
};

const libraries = ['places'] as (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'visualization'
)[];

const DeliveryDistanceMap: React.FC<Props> = ({ destination, onPriceChange, onError }) => {
  const [data, setData] = useState<DistanceData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  React.useEffect(() => {
    if (!destination) {
      setData(null);
      setError('');
      if (onError) onError('');
      return;
    }
    setLoading(true);
    setError('');
    if (onError) onError('');
    fetch('http://localhost:8080/api/distance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination }),
    })
      .then(res => {
        console.log('[DeliveryDistanceMap] Status da resposta:', res.status);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Endpoint de distância não encontrado. Contate o suporte.');
          throw new Error('Erro ao calcular distância.');
        }
        return res.json();
      })
      .then((res: DistanceData) => {
        console.log('[DeliveryDistanceMap] Corpo da resposta:', res);
        setData(res);
        if (onPriceChange) onPriceChange(res.price);
        if (onError) onError('');
      })
      .catch((err) => {
        setError(err.message || 'Erro ao calcular distância.');
        if (onError) onError(err.message || 'Erro ao calcular distância.');
      })
      .finally(() => setLoading(false));
  }, [destination, onPriceChange, onError]);

  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', marginTop: 24 }}>
      <h4 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>Resumo da Entrega</h4>
      {loading && <div>Calculando...</div>}
      {data && (
        <>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            <strong>Distância:</strong> {data.distance}<br />
            <strong>Duração:</strong> {data.duration}<br />
            <strong>Valor:</strong> R$ {data.price.toFixed(2)}
          </div>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              options={{ disableDefaultUI: true }}
            >
              {data.polyline && (
                <DirectionsRenderer
                  directions={{
                    routes: [{
                      overview_polyline: { points: data.polyline },
                      legs: [{ distance: { text: data.distance }, duration: { text: data.duration } }],
                    }],
                  } as any}
                />
              )}
            </GoogleMap>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryDistanceMap; 