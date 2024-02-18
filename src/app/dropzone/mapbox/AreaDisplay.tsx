import bbox from '@turf/bbox';
import centroid from '@turf/centroid';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import mapboxgl, {
  AnyLayer,
  LngLatBoundsLike,
  LngLatLike,
  MapMouseEvent,
} from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import ErrorDisplay from '@/lib/ErrorDisplay';

import { DropZoneState, RootState } from '@/store/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || '';

interface AreaDisplayProps {
  coordinates: FeatureCollection<Point | Polygon>;
  exclusions: FeatureCollection<Polygon>;
}

const AreaDisplay: React.FC<AreaDisplayProps> = ({
  coordinates,
  exclusions,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map>();
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isInError, setIsInError] = React.useState(false);
  const { visibilities } = useSelector<RootState, DropZoneState>(
    (store) => store.dropZone
  );

  const exclusionLayerId = 'exclusions-layer';
  const exclusionsSourceName = 'exclusions';

  useEffect(() => {
    const exclusionLayerOptions: AnyLayer = {
      id: exclusionLayerId,
      type: 'fill',
      source: exclusionsSourceName,
      layout: {},
      paint: {
        'fill-color': 'blue',
        'fill-opacity': 0.75,
      },
    };

    try {
      if (visibilities.exclusions) map.current?.addLayer(exclusionLayerOptions);
      else map.current?.removeLayer(exclusionLayerId);
      if (visibilities.markers) {
        markersRef.current.forEach(
          (marker) => map.current && marker.addTo(map.current)
        );
      } else markersRef.current.forEach((marker) => marker.remove());
    } catch (e) {
      setIsInError(true);
      return;
    }
  }, [visibilities]);

  // Initialize the Mapbox map
  useEffect(() => {
    if (!mapboxgl.accessToken || mapboxgl.accessToken === 'pk.eyTEST') {
      // eslint-disable-next-line no-console
      console.error('Mapbox access token is not set.');
      return; // Handle missing token
    }

    if (map.current || !mapContainer.current) {
      return;
    }

    const updateMapWithLayers = () => {
      try {
        const coordinatesSourceName = 'coordinates';
        map.current?.addSource(coordinatesSourceName, {
          type: 'geojson',
          data: coordinates,
        });

        map.current?.addLayer({
          id: 'coordinates-layer',
          type: 'fill',
          source: coordinatesSourceName,
          layout: {},
          paint: {
            'fill-color': '#888',
          },
        });
        // Add markers for each dropzone
        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Add markers for each dropzone
        coordinates.features.forEach((feature) => {
          // Calculate the centroid of the feature (dropzone)
          const center = centroid(feature as Feature<Point>);
          const centerCoords = center.geometry.coordinates as LngLatLike;

          if (map.current) {
            // Create a new marker and add it to the map
            const marker = new mapboxgl.Marker()
              .setLngLat(centerCoords)
              .addTo(map.current);
            markersRef.current.push(marker);
          }
        });

        const nav = new mapboxgl.NavigationControl({
          visualizePitch: true,
        });
        map.current?.addControl(nav, 'top-left');
        map.current?.addControl(new mapboxgl.FullscreenControl());

        map.current?.addSource(exclusionsSourceName, {
          type: 'geojson',
          data: exclusions,
        });
      } catch (e) {
        setIsInError(true);
        return;
      }
    };

    const layerClickHandler = (e: MapMouseEvent) => {
      try {
        if (e.type === 'click' && map.current) {
          const feature = map.current.queryRenderedFeatures(e.point)[0];
          const dropzoneFeatureType =
            feature.properties?.dropzone_feature_type || 'No feature type';
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`Feature: ${dropzoneFeatureType}`)
            .addTo(map.current);
        }
      } catch (e) {
        setIsInError(true);
        return;
      }
    };

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11', // Base map style
        center: centroid(exclusions).geometry.coordinates as LngLatLike,
        zoom: 9,
      });

      map.current.fitBounds(bbox(exclusions) as LngLatBoundsLike, {
        maxDuration: 0,
      });

      map.current.on('load', updateMapWithLayers);
      map.current.on('click', exclusionLayerId, layerClickHandler);
    } catch (e) {
      setIsInError(true);
      return;
    }

    return () => {
      map.current?.off('load', updateMapWithLayers);
      map.current?.off('click', exclusionLayerId, layerClickHandler);
      map.current?.remove();
      map.current = undefined;
    }; // Clean up map instance on unmount

    // Reasoning: We only want to update the map when the coordinates or exclusions change, exclusionlayer shouldnt trigger a rerender etc.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, exclusions, setIsInError]);

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
    <div
      ref={mapContainer}
      className='w-full h-[calc(85%-1em)] rounded-lg shadow-box-grey'
    />
  );
};

export default AreaDisplay;
