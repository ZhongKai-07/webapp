import { render } from '@testing-library/react';
import React from 'react';

import CardLoading from '@/lib/CardLoading';

test('renders CardLoading component correctly', () => {
  const { container } = render(<CardLoading />);
  expect(container).toMatchSnapshot();
});
