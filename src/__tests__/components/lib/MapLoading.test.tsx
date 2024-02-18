import { render } from '@testing-library/react';

import MapLoading from '@/lib/MapLoading';

test('renders MapLoading component correctly', () => {
  const { container } = render(<MapLoading />);
  expect(container).toMatchSnapshot();
});
