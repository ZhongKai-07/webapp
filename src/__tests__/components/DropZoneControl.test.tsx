import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DropZoneControls from '@/app/dropzone/DropZoneControls';
import { GeographySelection } from '@/app/dropzone/GeographySelection';

import {
  dropZoneConfirmSelection,
  dropZoneSetGeographySelection,
  dropZoneSetVisibilities,
} from '../../store/actions/dropzone';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('DropZoneControls', () => {
  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockClear();
    (useSelector as unknown as jest.Mock).mockClear();
    cleanup();
  });

  it('renders without crashing', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue({
      visibilities: {},
      geographySelection: GeographySelection.Display_Results,
      outlineData: {},
      error: null,
    });

    render(<DropZoneControls />);

    expect(useSelector).toHaveBeenCalled();
  });

  it('dispatches dropZoneSetGeographySelection action when a predefined selection button is clicked', () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useSelector as unknown as jest.Mock).mockReturnValue({
      visibilities: {},
      geographySelection: GeographySelection.Display_Results,
      outlineData: {},
      error: null,
    });

    const { getByText } = render(<DropZoneControls />);
    const button = getByText('Individual');

    button.click();

    expect(dispatchMock).toHaveBeenCalledWith(
      dropZoneSetGeographySelection(GeographySelection.Individual)
    );
  });

  it('dispatches dropZoneSetGeographySelection action when the individual button is clicked', () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useSelector as unknown as jest.Mock).mockReturnValue({
      visibilities: {},
      geographySelection: GeographySelection.Display_Results,
      outlineData: {},
      error: null,
    });

    const { getByText } = render(<DropZoneControls />);
    const button = getByText('Individual');

    fireEvent.click(button);

    expect(dispatchMock).toHaveBeenCalledWith(
      dropZoneSetGeographySelection(GeographySelection.Individual)
    );
  });

  it('dispatches dropZoneSetVisibilities action when the markers toggle is clicked', () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useSelector as unknown as jest.Mock).mockReturnValue({
      geographySelection: GeographySelection.Display_Results,
      outlineData: {},
      error: null,
      visibilities: { markers: true, exclusions: false },
    });

    const { getByText } = render(<DropZoneControls />);
    const toggleText = getByText('Drop Zone Markers');
    const toggle = toggleText.parentNode?.firstChild;
    if (!toggle) {
      throw new Error('toggle is null');
    }
    fireEvent.click(toggle);

    expect(dispatchMock).toHaveBeenCalledWith(
      dropZoneSetVisibilities({ markers: false, exclusions: false })
    );
  });

  it('dispatches dropZoneSetVisibilities action when the exclusions toggle is clicked', () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useSelector as unknown as jest.Mock).mockReturnValue({
      visibilities: { markers: true, exclusions: false },
      geographySelection: GeographySelection.Display_Results,
      outlineData: {},
      error: null,
    });

    const { getByText } = render(<DropZoneControls />);
    const toggleText = getByText('Exclusion Zones');
    const toggle = toggleText.parentNode?.firstChild;
    if (!toggle) {
      throw new Error('toggle is null');
    }
    fireEvent.click(toggle);

    expect(dispatchMock).toHaveBeenCalledWith(
      dropZoneSetVisibilities({ exclusions: true, markers: true })
    );
  });

  it('dispatches dropZoneConfirmSelection action when the confirm button is clicked', () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useSelector as unknown as jest.Mock).mockReturnValue({
      visibilities: {},
      geographySelection: GeographySelection.Individual,
      outlineData: {},
      error: null,
    });

    const { getByText } = render(<DropZoneControls />);
    const button = getByText('Confirm');

    button.click();

    expect(dispatchMock).toHaveBeenCalledWith(
      dropZoneConfirmSelection(GeographySelection.Individual)
    );
  });
});
