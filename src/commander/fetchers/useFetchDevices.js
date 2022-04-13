import { useEffect } from 'react';

import { cacheStore, commanderManager } from '../CommanderApp';

import { makeDevicesSections } from '../sections/devices';

export function useFetchDevices({ inputValue }) {
  useEffect(() => {
    // Only start fetching if on the first path and user started typing.
    if (inputValue.length > 0 && commanderManager.get().path.length === 0) {
      useFetchDevices.invoke({});
    }
  }, [inputValue]);
}

useFetchDevices.clear = function clear() {};

useFetchDevices.invoke = function invoke({ homeyId }) {
  const homeys =
    homeyId == null ? cacheStore.getState().homeys.get() : { [homeyId]: cacheStore.getState().homeys.get()[homeyId] };

  const state = cacheStore.getState();
  for (const [homeyId, homey] of Object.entries(homeys)) {
    const pendingKey = `${homeyId}-devices`;

    if (state.__pending[pendingKey] == null) {
      commanderManager.incrementLoadingCount();
      state.__pending[pendingKey] = Promise.resolve()
        .then(async () => {
          const { sections, zones, devices } = await makeDevicesSections({
            value: {
              key: pendingKey,
              context: {
                homey,
              },
            },
          });

          const nextDeviceSourcesByHomeyId = {
            ...cacheStore.getState().devices?.sourcesbyHomeyId,
            [homeyId]: {
              ...devices,
            },
          };

          const nextDeviceSectionsByHomeyId = {
            ...cacheStore.getState().devices?.sectionsByHomeyId,
            [homeyId]: sections,
          };

          const nextZoneSourcesByHomeyId = {
            ...cacheStore.getState().zones?.sourcesbyHomeyId,
            [homeyId]: {
              ...zones,
            },
          };

          const nextZoneSectionsByHomeyId = {
            ...cacheStore.getState().zones?.sectionsByHomeyId,
            [homeyId]: [], // TODO
          };

          cacheStore.setState({
            devices: {
              sourcesbyHomeyId: nextDeviceSourcesByHomeyId,
              sectionsByHomeyId: nextDeviceSectionsByHomeyId,
            },
            zones: {
              sourcesbyHomeyId: nextZoneSourcesByHomeyId,
              sectionsByHomeyId: nextZoneSectionsByHomeyId,
            },
          });

          state.__pending[pendingKey] = true;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          commanderManager.decrementLoadingCount();
        });
    }
  }
};
