import bbox from '@turf/bbox';
import union from '@turf/union';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';

import ErrorDisplay from '@/lib/ErrorDisplay';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || '';

interface AreaDisplayProps {
  coordinates:
    | FeatureCollection<Polygon | MultiPolygon>
    | Feature<Polygon | MultiPolygon>;
}

const AreaSelectionDisplay = ({ coordinates }: AreaDisplayProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map>();
  const [isInError, setIsInError] = useState<boolean>(false);

  useEffect(() => {
    const loadHandler = () => {
      try {
        // Add GeoJSON to the map
        const sourceId = 'geojson-polygon';
        try {
          if (map.current?.getSource(sourceId)) {
            map.current?.removeSource(sourceId);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.info("Map Source doesn't exist, proceeding");
        }

        map.current?.addSource(sourceId, {
          type: 'geojson',
          data: coordinates,
        });

        const layerId = 'geojson-polygon-layer';
        if (map.current?.getLayer(layerId)) {
          map.current?.removeLayer(layerId);
        }
        map.current?.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          layout: {},
          paint: {
            'fill-color': '#ffc03a',
            'fill-opacity': 0.5,
          },
        });

        let bounds: mapboxgl.LngLatBoundsLike;

        if (coordinates.type === 'FeatureCollection') {
          // Fit map to polygon bounds
          let combinedFeature: Feature<Polygon | MultiPolygon> | null = null;

          coordinates.features.forEach((feature) => {
            if (
              feature.geometry.type === 'Polygon' ||
              feature.geometry.type === 'MultiPolygon'
            ) {
              combinedFeature = combinedFeature
                ? union(
                    combinedFeature,
                    feature as Feature<Polygon | MultiPolygon>
                  )
                : (feature as Feature<Polygon | MultiPolygon>);
            }
          });

          bounds = mapboxgl.LngLatBounds.convert(
            bbox(combinedFeature) as mapboxgl.LngLatBoundsLike
          );
        } else {
          bounds = mapboxgl.LngLatBounds.convert(
            bbox(coordinates) as LngLatBoundsLike
          );
        }

        map.current?.fitBounds(bounds, { padding: 20, maxDuration: 1 });
      } catch (e) {
        setIsInError(true);
        return;
      }
    };

    if (!mapContainer.current) {
      return;
    }
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0], // Default center
        zoom: 10,
      });
      map.current.on('load', loadHandler);
    } catch (e) {
      setIsInError(true);
      return;
    }

    return () => {
      map.current?.off('load', loadHandler);
      map.current?.remove();
    };
  }, [coordinates]);

  return isInError ||
    !mapboxgl.accessToken ||
    mapboxgl.accessToken === 'pk.eyTEST' ? (
    <ErrorDisplay
      isMapError={true}
      message={
        isInError
          ? 'Could not initialize map.'
          : 'Mapbox access token is not set. Please set it in the .env.local file.'
      }
      // style={{ width: '100%', height: '100%' }}
    />
  ) : (
    <div ref={mapContainer} className='w-full h-full rounded-lg' />
  );
};

export default AreaSelectionDisplay;
