import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { cache } from '../cache';

export function useCacheSubscriber({ key, cacheRef, forceUpdate }) {
  useEffect(() => {
    const options = { fireImmediately: true, equalityFn: shallow };

    function selectKey(state) {
      return state[key];
    }

    function handler(value) {
      cacheRef.current[key] = value;

      if (cache.get().__timeout == null) {
        cache.get().__timeout = setTimeout(() => {
          cache.get().__timeout = null;
          forceUpdate({});
        }, 100);
      }
    }

    const unsubscribe = cache.store.subscribe(selectKey, handler, options);

    return function () {
      // cacheRef.current[key] = null;
      // forceUpdate({});
      unsubscribe();
    };
  }, [key, cacheRef, forceUpdate]);
}
