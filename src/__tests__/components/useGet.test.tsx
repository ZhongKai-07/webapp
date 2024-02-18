import { renderHook, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import {
  reducer,
  REQUEST_FAILED,
  REQUEST_STARTED,
  REQUEST_SUCCESSFUL,
  requestFailed,
  requestStarted,
  requestSuccessful,
  useGet,
} from '@/lib/useGet';

describe('reducer', () => {
  const initialState = {
    isLoading: false,
    data: null,
    error: undefined,
  };

  it('handles REQUEST_STARTED action', () => {
    const action = { type: REQUEST_STARTED };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('handles REQUEST_SUCCESSFUL action', () => {
    const testData = { name: 'Test Data' };
    const action = { type: REQUEST_SUCCESSFUL, data: testData };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: testData,
      error: undefined,
    });
  });

  it('handles REQUEST_FAILED action', () => {
    const testError = 'Error occurred';
    const action = { type: REQUEST_FAILED, error: testError };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      error: testError,
    });
  });

  it('returns current state for unknown action type', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(reducer(initialState, action)).toEqual(initialState);
  });
});

describe('action creators', () => {
  it('creates REQUEST_STARTED action', () => {
    const expectedAction = { type: REQUEST_STARTED };
    expect(requestStarted()).toEqual(expectedAction);
  });

  it('creates REQUEST_SUCCESSFUL action', () => {
    const testData = { name: 'Test Data' };
    const expectedAction = { type: REQUEST_SUCCESSFUL, data: testData };
    expect(requestSuccessful({ data: testData })).toEqual(expectedAction);
  });

  it('creates REQUEST_FAILED action', () => {
    const testError = 'Error occurred';
    const expectedAction = { type: REQUEST_FAILED, error: testError };
    expect(requestFailed({ error: testError })).toEqual(expectedAction);
  });
});

fetchMock.enableMocks();

describe('useGet', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('handles successful API call', async () => {
    const mockData = { name: 'Test Data' };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const { result } = renderHook(() => useGet({ url: 'https://example.com' }));
    await waitFor(() =>
      expect(result.current).toEqual({
        isLoading: false,
        data: mockData,
        error: undefined,
      })
    );
  });

  it('handles failed API call', async () => {
    fetchMock.mockReject(new Error('API failure'));

    const { result } = renderHook(() => useGet({ url: 'https://example.com' }));
    await waitFor(() =>
      expect(result.current).toEqual({
        isLoading: false,
        data: undefined,
        error: 'API failure',
      })
    );
  });

  it('handles non ok request', async () => {
    fetchMock.mockResponse(
      JSON.stringify([{ name: 'naruto', average_score: 79 }]),
      { status: 500 }
    );

    const { result } = renderHook(() => useGet({ url: 'https://example.com' }));
    await waitFor(() =>
      expect(result.current).toEqual({
        isLoading: false,
        data: undefined,
        error: '500 Internal Server Error',
      })
    );
  });
});
