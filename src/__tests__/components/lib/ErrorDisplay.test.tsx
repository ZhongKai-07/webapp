import { render } from '@testing-library/react';
import React from 'react';

import ErrorDisplay from '@/lib/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('should render correctly', () => {
    const message = 'This is an error message';
    const isMapError = true;

    const { container } = render(
      <ErrorDisplay message={message} isMapError={isMapError} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render a warning message', () => {
    const message = 'This is an error message';
    const isMapError = true;

    const { getByText } = render(
      <ErrorDisplay message={message} isMapError={isMapError} />
    );

    const warningMessage = getByText('Warning');
    expect(warningMessage).toBeInTheDocument();
  });

  it('should render the error message', () => {
    const message = 'This is an error message';
    const isMapError = true;

    const { getByText } = render(
      <ErrorDisplay message={message} isMapError={isMapError} />
    );

    const errorMessage = getByText(message);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should render the MapIcon when isMapError is true', () => {
    const message = 'This is an error message';
    const isMapError = true;

    const { getByTestId } = render(
      <ErrorDisplay message={message} isMapError={isMapError} />
    );

    const mapIcon = getByTestId('map-icon');
    expect(mapIcon).toBeInTheDocument();
  });

  it('should not render the MapIcon when isMapError is false', () => {
    const message = 'This is an error message';
    const isMapError = false;

    const { queryByTestId } = render(
      <ErrorDisplay message={message} isMapError={isMapError} />
    );

    const mapIcon = queryByTestId('map-icon');
    expect(mapIcon).toBeNull();
  });
});
