import { createAction } from '@reduxjs/toolkit';
import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';

import type { DROPZONE_ERROR } from '@/store/constants/dropzone';
import {
  DROPZONE_CONFIRM_SELECTION,
  DROPZONE_LOAD_OUTLINE,
  DROPZONE_MAP_LOADING,
  DROPZONE_SET_COORDINATES,
  DROPZONE_SET_ERROR,
  DROPZONE_SET_EXCLUSIONS,
  DROPZONE_SET_GEOGRAPHY_SELECTION,
  DROPZONE_SET_OUTLINE,
  DROPZONE_SET_SELECTED_AREA,
  DROPZONE_SET_SHOULD_SHOW_MAP_CONTROLS,
  DROPZONE_SET_VISIBILITIES,
} from '@/store/constants/dropzone';

import { GeographySelection } from '@/app/dropzone/GeographySelection';

export const dropZoneSetGeographySelection = createAction<GeographySelection>(
  DROPZONE_SET_GEOGRAPHY_SELECTION
);

export const dropZoneSetShouldShowMapControls = createAction<boolean>(
  DROPZONE_SET_SHOULD_SHOW_MAP_CONTROLS
);

export const dropZoneSetVisibilities = createAction<{
  markers: boolean;
  exclusions: boolean;
}>(DROPZONE_SET_VISIBILITIES);

export const dropZoneConfirmSelection = createAction<GeographySelection>(
  DROPZONE_CONFIRM_SELECTION
);

export const dropZoneSetSelectedArea = createAction<
  FeatureCollection<Point | Polygon> | undefined
>(DROPZONE_SET_SELECTED_AREA);

export const dropZoneSetExclusions = createAction<
  FeatureCollection<Polygon> | undefined
>(DROPZONE_SET_EXCLUSIONS);

export const dropZoneSetCoordinates = createAction<Polygon | undefined>(
  DROPZONE_SET_COORDINATES
);

export const dropZoneSetOutline =
  createAction<
    Record<
      string,
      | FeatureCollection<Polygon | MultiPolygon>
      | Feature<Polygon | MultiPolygon>
    >
  >(DROPZONE_SET_OUTLINE);

export const dropZoneLoadOutline = createAction(DROPZONE_LOAD_OUTLINE);

export const dropZoneSetError =
  createAction<DROPZONE_ERROR>(DROPZONE_SET_ERROR);

export const dropZoneSetMapLoading =
  createAction<boolean>(DROPZONE_MAP_LOADING);
