import dynamic from 'next/dynamic';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ErrorDisplay from '@/lib/ErrorDisplay';
import MapLoading from '@/lib/MapLoading';

import { dropZoneSetCoordinates } from '@/store/actions/dropzone';
import { DROPZONE_ERROR } from '@/store/constants/dropzone';
import { DropZoneState, RootState } from '@/store/types';

import { GeographySelection } from './GeographySelection';

const AreaMapSelectDynamic = dynamic(() => import('./mapbox/AreaMapSelect'), {
  ssr: false,
  loading: () => <MapLoading />,
});

const AreaSelectionDisplayDynamic = dynamic(
  () => import('./mapbox/AreaSelectionDisplay'),
  {
    ssr: false,
    loading: () => <MapLoading />,
  }
);

const AreaDisplayDynamic = dynamic(() => import('./mapbox/AreaDisplay'), {
  ssr: false,
  loading: () => <MapLoading />,
});

const DropZoneMap: React.FC = () => {
  const {
    geographySelection,
    coordinates,
    selectedArea,
    exclusions,
    outlineData,
    error,
  } = useSelector<RootState, DropZoneState>((store) => store.dropZone);

  const dispatch = useDispatch();
  if (
    geographySelection === GeographySelection.Display_Results &&
    selectedArea &&
    exclusions
  ) {
    return (
      <AreaDisplayDynamic coordinates={selectedArea} exclusions={exclusions} />
    );
  }
  if (geographySelection === GeographySelection.Individual) {
    return (
      <div className='h-[calc(85%-1em)]'>
        <AreaMapSelectDynamic
          coordinates={coordinates}
          setCoordinates={(coordinates) => {
            dispatch(dropZoneSetCoordinates(coordinates));
          }}
        />
      </div>
    );
  }
  if (error && error === DROPZONE_ERROR.DROPZONE_OUTLINE_FETCH_ERROR)
    return (
      <ErrorDisplay message='Could not fetch outlines of predefined areas.' />
    );
  if (outlineData?.[geographySelection]) {
    return (
      <div className='h-[calc(85%-1em)]'>
        <AreaSelectionDisplayDynamic
          coordinates={outlineData?.[geographySelection]}
        />
      </div>
    );
  }
  return <></>;
};
export default DropZoneMap;
