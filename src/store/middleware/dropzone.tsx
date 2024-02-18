import { Action, MiddlewareAPI } from '@reduxjs/toolkit';
import centerOfMass from '@turf/center-of-mass';
import circle from '@turf/circle';
import { feature, featureCollection } from '@turf/helpers';
import axios from 'axios';

import {
  DROPZONE_CONFIRM_SELECTION,
  DROPZONE_ERROR,
  DROPZONE_LOAD_OUTLINE,
} from '@/store/constants/dropzone';

import { GeographySelection } from '@/app/dropzone/GeographySelection';

import {
  dropZoneSetCoordinates,
  dropZoneSetError,
  dropZoneSetExclusions,
  dropZoneSetGeographySelection,
  dropZoneSetMapLoading,
  dropZoneSetOutline,
  dropZoneSetSelectedArea,
} from '../actions/dropzone';

const DROPZONE_API = process.env.NEXT_PUBLIC_DROPZONE_API as string;

const dropZoneMiddleware =
  (api: MiddlewareAPI) =>
  (next: (action: Action) => void) =>
  (action: Action) => {
    next(action);

    if (action.type === DROPZONE_CONFIRM_SELECTION) {
      api.dispatch(dropZoneSetMapLoading(true));
      const { geographySelection, coordinates } = api.getState().dropZone;

      api.dispatch(dropZoneSetExclusions(undefined));
      api.dispatch(dropZoneSetSelectedArea(undefined));
      api.dispatch(dropZoneSetCoordinates(undefined));

      if (geographySelection === GeographySelection.Individual && coordinates) {
        const polygonFeature = feature(coordinates);
        api.dispatch(
          dropZoneSetSelectedArea(featureCollection([polygonFeature]))
        );
        api.dispatch(
          dropZoneSetExclusions(
            featureCollection([
              circle(centerOfMass(polygonFeature), 0.5, {
                units: 'kilometers',
              }),
            ])
          )
        );
        api.dispatch(dropZoneSetCoordinates(undefined));
      } else {
        axios
          .get(`${DROPZONE_API}/${geographySelection}`)
          .then((res) => {
            const featureData = res.data;
            api.dispatch(dropZoneSetError(DROPZONE_ERROR.DROPZONE_NO_ERROR));
            api.dispatch(dropZoneSetSelectedArea(featureData));
          })
          .catch(() => {
            api.dispatch(
              dropZoneSetError(DROPZONE_ERROR.DROPZONE_DATA_FETCH_ERROR)
            );
          });

        axios
          .get(`${DROPZONE_API}/${geographySelection}/excluded`)
          .then((res) => {
            const featureData = res.data;
            api.dispatch(dropZoneSetExclusions(featureData));
            api.dispatch(dropZoneSetError(DROPZONE_ERROR.DROPZONE_NO_ERROR));
          })
          .catch(() => {
            api.dispatch(
              dropZoneSetError(DROPZONE_ERROR.DROPZONE_DATA_FETCH_ERROR)
            );
          });

        api.dispatch(dropZoneSetCoordinates(coordinates));
      }

      api.dispatch(
        dropZoneSetGeographySelection(GeographySelection.Display_Results)
      );
      api.dispatch(dropZoneSetMapLoading(false));
    } else if (action.type === DROPZONE_LOAD_OUTLINE) {
      axios
        .get(DROPZONE_API)
        .then((res) => {
          const outlineData = res.data;
          api.dispatch(dropZoneSetError(DROPZONE_ERROR.DROPZONE_NO_ERROR));
          api.dispatch(dropZoneSetOutline(outlineData));
        })
        .catch(() => {
          api.dispatch(
            dropZoneSetError(DROPZONE_ERROR.DROPZONE_OUTLINE_FETCH_ERROR)
          );
        });
    }
  };

export default dropZoneMiddleware;
