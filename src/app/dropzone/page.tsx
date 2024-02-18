'use client';
import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';

import ErrorDisplay from '@/lib/ErrorDisplay';
import NavigationBar from '@/lib/NavigationBar';

import { dropZoneLoadOutline } from '@/store/actions/dropzone';
import { store } from '@/store/store';
import { DropZoneState, RootState } from '@/store/types';

import DropZoneControls from './DropZoneControls';
import DropZoneMap from './DropZoneMap';

const DropZonePage: React.FC = () => {
  const { error } = useSelector<RootState, DropZoneState>(
    (state) => state.dropZone
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dropZoneLoadOutline());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <div className='overflow-hidden w-full h-[calc(100vh)]'>
        <NavigationBar />

        <div className='h-full w-[calc(100%-3em)] flex flex-col gap-[1em] m-auto'>
          <DropZoneControls />
          {error === 'DROPZONE_DATA_FETCH_ERROR' && (
            <ErrorDisplay
              message='Could not fetch data.'
              // style={{ width: '100%', height: '100%' }}
            />
          )}
          <DropZoneMap />
        </div>
      </div>
    </Provider>
  );
};
export default DropZonePage;
