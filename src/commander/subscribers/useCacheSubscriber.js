import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { cacheStore } from '../CommanderApp';

export function useCacheSubscriber({ key, cacheRef, forceUpdate }) {
  useEffect(() => {
    const options = { fireImmediately: true, equalityFn: shallow };

    function selectKey(state) {
      return state[key];
    }

    function handler(value) {
      cacheRef.current[key] = value;

      if (cacheStore.getState().__timeout == null) {
        cacheStore.getState().__timeout = setTimeout(() => {
          cacheStore.getState().__timeout = null;
          forceUpdate({});
        }, 100);
      }
    }

    const unsubscribe = cacheStore.subscribe(selectKey, handler, options);

    return function () {
      // cacheRef.current[key] = null;
      // forceUpdate({});
      unsubscribe();
    };
  }, [key, cacheRef, forceUpdate]);
}
