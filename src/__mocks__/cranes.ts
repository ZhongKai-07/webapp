import { FeatureCollection, Point } from 'geojson';

export const cranes: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        craneId: 1,
        height: 50,
        radius: 10,
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
    },
    {
      type: 'Feature',
      properties: {
        craneId: 2,
        height: 40,
        radius: 8,
      },
      geometry: {
        type: 'Point',
        coordinates: [1, 1],
      },
    },
  ],
};
