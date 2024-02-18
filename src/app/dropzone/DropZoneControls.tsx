import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ToggleSlider from '@/lib/ToggleSlider';

import {
  dropZoneConfirmSelection,
  dropZoneSetGeographySelection,
  dropZoneSetVisibilities,
} from '@/store/actions/dropzone';
import { DROPZONE_ERROR } from '@/store/constants/dropzone';
import { DropZoneState, RootState } from '@/store/types';

import { GeographySelection } from './GeographySelection';
import { GeographySelectionButtons } from './GeographySelectionButtons';

const DropZoneControls: React.FC = () => {
  const { visibilities, geographySelection, outlineData, error } = useSelector<
    RootState,
    DropZoneState
  >((state) => state.dropZone);
  const dispatch = useDispatch();

  const onPredefinedSelectionButtonClick = (selection: string) => {
    dispatch(
      dropZoneSetGeographySelection(selection as unknown as GeographySelection)
    );
  };

  const onIndividualButtonClick = () => {
    dispatch(dropZoneSetGeographySelection(GeographySelection.Individual));
  };
  const shouldShowMapControls =
    geographySelection === GeographySelection.Display_Results;
  return (
    <div className='flex justify-between'>
      <GeographySelectionButtons
        onIndividualButtonClick={onIndividualButtonClick}
        onPredefinedSelectionButtonClick={onPredefinedSelectionButtonClick}
        geographySelection={geographySelection}
        renderPreSelected={
          !!outlineData && error != DROPZONE_ERROR.DROPZONE_OUTLINE_FETCH_ERROR
        }
      />
      {shouldShowMapControls && (
        <div className='flex gap-[2em] items-center mt-[1em]'>
          <div className='flex'>
            <ToggleSlider
              onClick={() => {
                dispatch(
                  dropZoneSetVisibilities({
                    ...visibilities,
                    markers: !visibilities.markers,
                  })
                );
              }}
              checked={visibilities.markers}
            />
            <p className='text-black text-xl mt-[-2px]'>Drop Zone Markers</p>
          </div>
          <div className='flex'>
            <ToggleSlider
              onClick={() => {
                dispatch(
                  dropZoneSetVisibilities({
                    ...visibilities,
                    exclusions: !visibilities.exclusions,
                  })
                );
              }}
              checked={visibilities.exclusions}
            />
            <p className='text-black text-xl mt-[-2px]'>Exclusion Zones</p>
          </div>
        </div>
      )}
      {!shouldShowMapControls && (
        <button
          className='rounded-full px-5 py-1 text-base font-medium text-gray-700 bg-apian-yellow border-2 border-apian-yellow mt-[1em]'
          onClick={() => {
            dispatch(dropZoneConfirmSelection(geographySelection));
          }}
        >
          Confirm
        </button>
      )}
    </div>
  );
};
export default DropZoneControls;
