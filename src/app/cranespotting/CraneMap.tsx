import { Feature, FeatureCollection, LineString, Point } from 'geojson';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';

import ErrorDisplay from '@/lib/ErrorDisplay';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || '';

interface CraneMapProps {
  cranes?: FeatureCollection<Point>;
}

const CraneMap: React.FC<CraneMapProps> = ({ cranes }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map>();

  const [isInError, setIsInError] = React.useState(false);

  useEffect(() => {
    if (!mapboxgl.accessToken || mapboxgl.accessToken === 'pk.eyTEST') {
      // eslint-disable-next-line no-console
      console.error('Mapbox access token is not set.');
      return; // Handle missing token
    }
    if (!mapContainerRef.current || !cranes) return;
    const guysHospitalCoords: [number, number] = [-0.086852, 51.503162];
    const stThomasHospitalCoords: [number, number] = [-0.118011, 51.498016];
    const onLoad = () => {
      try {
        if (mapRef?.current?.getLayer('cranes')) {
          mapRef.current.removeLayer('cranes');
          mapRef.current.removeSource('cranes');
        }

        const hospitalFeature: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [guysHospitalCoords, stThomasHospitalCoords],
          },
        };

        mapRef.current?.addSource('route', {
          type: 'geojson',
          data: hospitalFeature,
        });

        mapRef.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': 'blue',
            'line-width': 3,
            'line-dasharray': [5, 10],
          },
        });

        mapRef.current?.addSource('cranes', {
          type: 'geojson',
          data: cranes,
          cluster: true,
        });

        mapRef.current?.addLayer({
          id: 'clustered-cranes',
          type: 'circle',
          interactive: true,
          source: 'cranes',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              2,
              '#ffc03a',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });

        mapRef.current?.addLayer({
          id: 'clustered-cranes-count',
          type: 'symbol',
          source: 'cranes',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
        });
        mapRef.current?.addLayer({
          id: 'unclustered-crane-id',
          type: 'symbol',
          source: 'cranes',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'text-field': ['get', 'craneId'],
            'text-size': 16,
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-offset': [0, 1.5],
            'text-allow-overlap': true,
          },
        });
        mapRef.current?.addLayer({
          id: 'unclustered-crane',
          type: 'circle',
          source: 'cranes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 10,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        });
      } catch (e) {
        setIsInError(true);
      }
    };

    try {
      // Initialize the map
      if (!mapRef.current) {
        // Hospital coordinates

        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-0.1, 51.5],
          zoom: 12,
        });

        const el = document.createElement('div');
        el.className = 'hospital-marker guys';

        // Add hospital markers
        new mapboxgl.Marker({ color: 'red', element: el })
          .setLngLat(guysHospitalCoords)
          .setPopup(new mapboxgl.Popup().setText("Guy's Hospital"))
          .addTo(mapRef.current);

        const elT = document.createElement('div');
        elT.className = 'hospital-marker tommy';

        new mapboxgl.Marker({ color: 'red', element: elT })
          .setLngLat(stThomasHospitalCoords)
          .setPopup(new mapboxgl.Popup().setText("St Thomas' Hospital"))
          .addTo(mapRef.current);

        // Add dotted line between hospitals
        mapRef.current.on('load', onLoad);

        // Add scale control
        mapRef.current.addControl(new mapboxgl.ScaleControl());
      }
    } catch (e) {
      setIsInError(true);
    }

    return () => {
      mapRef.current?.off('load', onLoad);
      mapRef.current?.remove();
      mapRef.current = undefined;
    };
  }, [cranes, setIsInError]);

  if (!mapboxgl.accessToken || mapboxgl.accessToken === 'pk.eyTEST') {
    return (
      <ErrorDisplay
        isMapError={true}
        message='Mapbox access token is not set. Please set it in the .env.local file.'
        // style={{ width: '45vw', height: '45vh' }}
      />
    );
  }

  if (isInError) {
    return (
      <ErrorDisplay
        isMapError={true}
        message='Could not initialize map.'
        // style={{ width: '45vw', height: '45vh' }}
      />
    );
  }

  return <div className='w-full h-full rounded-lg' ref={mapContainerRef} />;
};

export default CraneMap;
