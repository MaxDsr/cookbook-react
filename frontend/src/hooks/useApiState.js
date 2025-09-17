import { useMemo } from 'react';

/**
 * Custom hook to handle API states with RTK Query
 * Returns standardized state object with loading states
 */
export const useApiState = (queryResult) => {
  return useMemo(() => {
    const { isLoading, isFetching, isSuccess, isError, error, data } = queryResult;

    // Determine the current state
    let state = 'idle';
    if (isLoading || isFetching) {
      state = 'loading';
    } else if (isSuccess) {
      state = 'success';
    } else if (isError) {
      state = 'error';
    }

    return {
      state,
      isIdle: state === 'idle',
      isLoading: state === 'loading',
      isSuccess: state === 'success',
      isError: state === 'error',
      data,
      error: error?.message || error?.data?.message || 'An error occurred',
    };
  }, [queryResult]);
};

/**
 * Custom hook to handle mutation states with RTK Query
 * Returns standardized state object with loading states for mutations
 */
export const useMutationState = (mutationResult) => {
  return useMemo(() => {
    const { isLoading, isSuccess, isError, error, data, reset } = mutationResult;

    // Determine the current state
    let state = 'idle';
    if (isLoading) {
      state = 'loading';
    } else if (isSuccess) {
      state = 'success';
    } else if (isError) {
      state = 'error';
    }

    return {
      state,
      isIdle: state === 'idle',
      isLoading: state === 'loading',
      isSuccess: state === 'success',
      isError: state === 'error',
      data,
      error: error?.message || error?.data?.message || 'An error occurred',
      reset, // Function to reset the mutation state
    };
  }, [mutationResult]);
};
