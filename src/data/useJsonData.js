import { useEffect, useState } from 'react';

/**
 * Runs a loader such as fetchMenu once and tracks its result.
 * The loader must be a stable function (defined at module level).
 * The request is aborted if the component unmounts first.
 */
export function useJsonData(loader) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();
    loader(controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error, loading: false });
      });
    return () => controller.abort();
  }, [loader]);

  return state;
}
