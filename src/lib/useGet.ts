import { useEffect, useReducer } from 'react';

export const REQUEST_STARTED = 'REQUEST_STARTED';
export const REQUEST_SUCCESSFUL = 'REQUEST_SUCCESSFUL';
export const REQUEST_FAILED = 'REQUEST_FAILED';
export const RESET_REQUEST = 'RESET_REQUEST';

interface StateType<T> {
  isLoading: boolean;
  data?: T;
  error?: string;
}

interface ActionType<T> {
  type: string;
  data?: T;
  error?: string;
}

export const reducer = <T>(state: StateType<T>, action: ActionType<T>) => {
  // we check the type of each action and return an updated state object accordingly
  switch (action.type) {
    case REQUEST_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case REQUEST_SUCCESSFUL:
      return {
        ...state,
        isLoading: false,
        error: undefined,
        data: action.data,
      };
    case REQUEST_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // usually I ignore the action if its `type` is not matched here, some people prefer throwing errors here - it's really up to you.
    default:
      return state;
  }
};

export const requestStarted = () => ({
  type: REQUEST_STARTED,
});

export function requestSuccessful<T>({ data }: { data: T }) {
  return {
    type: REQUEST_SUCCESSFUL,
    data,
  };
}

export const requestFailed = ({ error }: { error: string }) => ({
  type: REQUEST_FAILED,
  error,
});

export function useGet<T extends object>({ url }: { url: string }) {
  const [state, dispatch] = useReducer<
    (state: StateType<T>, action: ActionType<T>) => StateType<T>
  >(reducer, {
    isLoading: true,
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      dispatch(requestStarted());

      try {
        const response = await fetch(url, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as T;

        dispatch(requestSuccessful({ data }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!abortController.signal.aborted) {
          dispatch(requestFailed({ error: e.message }));
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return state;
}
