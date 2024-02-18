import { cleanup, render } from '@testing-library/react';
import React from 'react';

import MapIcon from '@/lib/MapIcon';

describe('MapIcon', () => {
  afterEach(cleanup);

  it('renders with default props', () => {
    const { container } = render(<MapIcon />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass(
      'h-10 w-10 text-gray-200 dark:text-gray-600'
    );
    expect(svgElement).toHaveAttribute('fill', 'currentColor');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 48 48');
  });

  it('renders with custom color and className', () => {
    const { container } = render(
      <MapIcon color='red' className='custom-class' />
    );
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('h-10 w-10 custom-class');
    expect(svgElement).toHaveAttribute('fill', 'red');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 48 48');
  });

  it('renders with custom color only', () => {
    const { container } = render(<MapIcon color='blue' />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass(
      'h-10 w-10 text-gray-200 dark:text-gray-600'
    );
    expect(svgElement).toHaveAttribute('fill', 'blue');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 48 48');
  });

  it('renders with custom className only', () => {
    const { container } = render(<MapIcon className='custom-class' />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('h-10 w-10 custom-class');
    expect(svgElement).toHaveAttribute('fill', 'currentColor');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 48 48');
  });
});
