import { render } from '@testing-library/react';
import React from 'react';

import ImageLoading from '@/lib/ImageLoading';

test('renders ImageLoading component correctly', () => {
  const { container } = render(<ImageLoading className='custom-class' />);
  expect(container).toMatchSnapshot();
});
