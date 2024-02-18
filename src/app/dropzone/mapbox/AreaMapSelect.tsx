import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Polygon } from 'geojson';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import ErrorDisplay from '@/lib/ErrorDisplay';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || '';

interface AreaMapSelectProps {
  coordinates: Polygon | undefined;
  setCoordinates: (feature: Polygon | undefined) => void;
}

const AreaMapSelect: React.FC<AreaMapSelectProps> = ({
  coordinates,
  setCoordinates,
}) => {
  const [tooManyFeaturesState, setTooManyFeaturesState] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [isInError, setIsInError] = React.useState(false);

  useEffect(() => {
    if (!mapboxgl.accessToken || mapboxgl.accessToken === 'pk.eyTEST') {
      // eslint-disable-next-line no-console
      console.error('Mapbox access token is not set.');
      return; // Handle missing token
    }
    const updateArea = () => {
      try {
        const features = drawRef?.current?.getAll();
        if (features && features.features.length == 0) {
          setTooManyFeaturesState(false);
          setCoordinates(undefined);
        }
        if (features && features.features.length == 1) {
          const coordinates = features.features[0].geometry as Polygon;
          setCoordinates(coordinates);
          setTooManyFeaturesState(false);
        } else if (features?.features && features?.features?.length > 1) {
          setTooManyFeaturesState(true);
          setCoordinates(undefined);
        }
      } catch (e) {
        setIsInError(true);
        return;
      }
    };

    const cleanup = () => {
      mapRef.current?.off('draw.create', updateArea);
      mapRef.current?.off('draw.update', updateArea);
      mapRef.current?.off('draw.delete', updateArea);
      // mapRef.current?.remove();
      // mapRef.current = null;
    };
    try {
      // Reinitialize event handler if map is initialized
      if (mapRef.current) {
        mapRef.current.on('draw.create', updateArea);
        mapRef.current.on('draw.update', updateArea);
        mapRef.current.on('draw.delete', updateArea);
        return cleanup;
      }

      if (mapRef.current || !mapContainerRef.current) return;

      // Initialize map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 51.539],
        zoom: 9,
      });
      // Initialize MapboxDraw
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: 'draw_polygon',
      });

      mapRef.current.addControl(drawRef.current);

      return cleanup;
    } catch (e) {
      setIsInError(true);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsInError]);

  if (mapboxgl.accessToken === 'pk.eyTEST') {
    return (
      <ErrorDisplay
        isMapError={true}
        message='Mapbox access token is not set. Please set it in the .env.local file.'
        // style={{ width: '100%', height: '100%' }}
      />
    );
  }

  if (isInError) {
    return (
      <ErrorDisplay
        isMapError={true}
        message='Could not initialize map.'
        // style={{ width: '100%', height: '100%' }}
      />
    );
  }

  return (
    <div className='h-full w-full'>
      <div
        ref={mapContainerRef}
        className='w-full h-full rounded-lg shadow-box-grey'
      />
      {coordinates && (
        <div className='w-1/3 h-[3em] m-auto bg-apian-yellow text-black mt-[1em] rounded-lg shadow-box-grey text-center py-3 text-lg'>
          <p>Selected coordinates: {coordinates.type}</p>
        </div>
      )}
      {tooManyFeaturesState && (
        <div className='w-1/3 h-[3em] m-auto bg-red-500 mt-[1em] rounded-lg shadow-box-grey text-center py-3 text-lg text-white'>
          <p>
            There are too many polygons. Please select only one (Hint: You can
            use the delete button).
          </p>
        </div>
      )}
    </div>
  );
};

export default AreaMapSelect;
