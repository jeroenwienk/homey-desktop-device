import { useEffect } from 'react';

import { commander } from '../CommanderApp';
import { cache } from '../cache';

import { makeInsightsSections } from '../sections/insights';

export function useFetchLogs({ inputValue }) {
  useEffect(() => {
    // Only start fetching if on the first path and user started typing.
    if (inputValue.length > 0 && commander.get().path.length === 0) {
      useFetchLogs.invoke({});
    }
  }, [inputValue]);
}

useFetchLogs.clear = () => {};

useFetchLogs.invoke = ({ homeyId }) => {
  const homeys = homeyId == null ? cache.get().homeys.get() : { [homeyId]: cache.get().homeys.get()[homeyId] };

  const state = cache.get();
  for (const [homeyId, homey] of Object.entries(homeys)) {
    const pendingKey = `${homeyId}-logs`;

    if (state.__pending[pendingKey] == null) {
      commander.incrementLoadingCount();
      state.__pending[pendingKey] = Promise.resolve()
        .then(async () => {
          const { sections, logs } = await makeInsightsSections({
            value: {
              key: pendingKey,
              context: {
                homey,
              },
            },
          });

          const nextLogSourcesByHomeyId = {
            ...cache.get().logs?.sourcesbyHomeyId,
            [homeyId]: {
              ...logs,
            },
          };

          const nextLogSectionsByHomeyId = {
            ...cache.get().logs?.sectionsByHomeyId,
            [homeyId]: sections,
          };

          cache.set({
            logs: {
              sourcesbyHomeyId: nextLogSourcesByHomeyId,
              sectionsByHomeyId: nextLogSectionsByHomeyId,
            },
          });

          state.__pending[pendingKey] = true;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          commander.decrementLoadingCount();
        });
    }
  }
};
