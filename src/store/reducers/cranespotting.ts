import { createReducer } from '@reduxjs/toolkit';

import { CraneSpottingState } from '@/store/types';

const initialState: CraneSpottingState = {
  cranes: undefined,
};

const craneSpottingReducer = createReducer(initialState, (builder) => {
  builder
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .addDefaultCase(() => {});
});

export default craneSpottingReducer;
