import { render } from '@testing-library/react';
import React from 'react';

import NavigationBar from '@/lib/NavigationBar';

describe('NavigationBar component', () => {
  it('should render correctly', () => {
    const { container } = render(<NavigationBar />);
    expect(container).toMatchSnapshot();
  });
});
