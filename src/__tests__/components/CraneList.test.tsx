import { render } from '@testing-library/react';

import { cranes } from '@/__mocks__/cranes';
import CraneList from '@/app/cranespotting/CraneList';

test('renders the list of cranes correctly', () => {
  const { asFragment } = render(<CraneList cranes={cranes} />);
  expect(asFragment()).toMatchSnapshot();
});
