import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Middleware } from 'redux';

import craneSpottingReducer from '@/store/reducers/cranespotting';
import { RootState } from '@/store/types';

import dropZoneMiddleware from './middleware/dropzone';
import dropZoneReducer from './reducers/dropzone';
const rootReducer = combineReducers({
  dropZone: dropZoneReducer,
  craneSpotting: craneSpottingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      immutableCheck: false,
    }).concat(
      dropZoneMiddleware as Middleware<
        (action: never, store?: never) => never,
        RootState
      >
    ),
});
export type Store = typeof store;
