import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';

import { DROPZONE_ERROR } from '@/store/constants/dropzone';

import { GeographySelection } from '@/app/dropzone/GeographySelection';

export type constant = string;

export interface DropZoneState {
  shouldShowMapControls: boolean;
  geographySelection: GeographySelection;
  visibilities: { markers: boolean; exclusions: boolean };
  markers?: FeatureCollection<Point>;
  exclusions?: FeatureCollection<Polygon>;
  coordinates?: Polygon;
  error: DROPZONE_ERROR;
  selectedArea?: FeatureCollection<Point | Polygon>;
  mapLoading: boolean;
  outlineData?: Record<
    string,
    FeatureCollection<Polygon | MultiPolygon> | Feature<Polygon | MultiPolygon>
  >;
}
export interface CraneSpottingState {
  cranes?: FeatureCollection<Point>;
}

export interface RootState {
  dropZone: DropZoneState;
  craneSpotting: CraneSpottingState;
}
