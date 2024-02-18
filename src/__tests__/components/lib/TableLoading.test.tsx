import { render } from '@testing-library/react';
import React from 'react';

import TableLoading from '@/lib/TableLoading';

test('renders TableLoading component correctly', () => {
  const { container } = render(<TableLoading />);
  expect(container).toMatchSnapshot();
});
