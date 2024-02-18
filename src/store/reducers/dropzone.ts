import { createReducer } from '@reduxjs/toolkit';

import {
  dropZoneConfirmSelection,
  dropZoneSetError,
  dropZoneSetExclusions,
  dropZoneSetGeographySelection,
  dropZoneSetMapLoading,
  dropZoneSetOutline,
  dropZoneSetSelectedArea,
  dropZoneSetShouldShowMapControls,
  dropZoneSetVisibilities,
} from '@/store/actions/dropzone';
import { DROPZONE_ERROR } from '@/store/constants/dropzone';
import { DropZoneState } from '@/store/types';

import { GeographySelection } from '@/app/dropzone/GeographySelection';

const initialState: DropZoneState = {
  shouldShowMapControls: false,
  geographySelection: GeographySelection.Individual,
  visibilities: { markers: true, exclusions: false },
  markers: undefined,
  exclusions: undefined,
  coordinates: undefined,
  error: DROPZONE_ERROR.DROPZONE_NO_ERROR,
  selectedArea: undefined,
  mapLoading: false,
};

const dropZoneReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(dropZoneSetGeographySelection, (state, action) => {
      state.geographySelection = action.payload;
      state.visibilities = { markers: true, exclusions: false };
      state.shouldShowMapControls = false;
      state.error = DROPZONE_ERROR.DROPZONE_NO_ERROR;
    })
    .addCase(dropZoneSetVisibilities, (state, action) => {
      state.visibilities = action.payload;
    })
    .addCase(dropZoneSetShouldShowMapControls, (state, action) => {
      state.shouldShowMapControls = action.payload;
    })
    .addCase(dropZoneConfirmSelection, (state, action) => {
      state.geographySelection = action.payload;
    })
    .addCase(dropZoneSetSelectedArea, (state, action) => {
      state.selectedArea = action.payload;
    })
    .addCase(dropZoneSetExclusions, (state, action) => {
      state.exclusions = action.payload;
    })
    .addCase(dropZoneSetMapLoading, (state, action) => {
      state.mapLoading = action.payload;
    })
    .addCase(dropZoneSetError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(dropZoneSetOutline, (state, action) => {
      state.outlineData = action.payload;
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .addDefaultCase(() => {});
});

export default dropZoneReducer;
