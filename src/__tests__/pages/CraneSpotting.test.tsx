import { cleanup } from '@testing-library/react';
import { render, waitFor } from '@testing-library/react';

import { cranes } from '@/__mocks__/cranes';
import CranespottingPage from '@/app/cranespotting/page';

jest.mock('@/lib/useGet', () => ({
  __esModule: true, // This is required when mocking a module that has a default export
  useGet: jest.fn(),
}));

describe('CranesPage Data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  // it('renders correctly with data', async () => {
  //   // Access the mock implementation of useGet via require
  //   const { useGet } = require('@/lib/useGet');
  //   useGet.mockReturnValue({ data: cranes, error: null, isLoading: false });
  //   console.log(cranes)
  //   const { getByText, getByAltText } = render(<CranesPage />);

  //   await waitFor(() => {
  //     expect(
  //       getByText(cranes?.features[0]?.properties?.height)
  //     ).toBeInTheDocument();
  //     expect(getByAltText('nature image')).toHaveAttribute(
  //       'src',
  //       cranes?.features[0]?.properties?.image
  //     );
  //   });
  // });

  it('renders error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useGet } = require('@/lib/useGet');
    useGet.mockReturnValue({ data: null, error: 'Houston we have a problem' });

    const { getByText } = render(<CranespottingPage />);

    await waitFor(() => {
      expect(getByText('Houston we have a problem')).toBeInTheDocument();
    });
  });

  it('conforms to snapshot', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useGet } = require('@/lib/useGet');
    useGet.mockReturnValue({ data: cranes, error: null, isLoading: false });

    const { asFragment } = render(<CranespottingPage />);

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe('Crane Page', () => {
  afterEach(cleanup);
  it('renders the Components', () => {
    const { asFragment } = render(<CranespottingPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Cranespotting Page', () => {
  afterEach(cleanup);
  it('renders the Components', () => {
    const { asFragment } = render(<CranespottingPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
