import { useEffect } from 'react';

import { debounce } from '../../shared/debounce';

import { apiStore } from '../index';
import { cache } from '../cache';

import { defaultTextValueSort } from '../defaultTextValueSort';

export function useHomeys() {
  useEffect(() => {
    const options = { fireImmediately: true };

    function selector(state) {
      return state;
    }

    const handler = debounce(function handler(state) {
      const apis = Object.entries(state)
        .map(([homeyId, { name, api }]) => {
          return {
            key: homeyId,
            type: 'homey',
            textValue: name,
            homey: api,
          };
        })
        .sort(defaultTextValueSort);

      cache.set({
        homeys: {
          get() {
            return apiStore.getState();
          },
          sections: [
            {
              key: 'apis',
              title: 'Homey',
              children: apis,
            },
          ],
        },
      });
    }, 100);

    const unsubscribe = apiStore.subscribe(selector, handler, options);

    return function () {
      unsubscribe();
    };
  }, []);
}
