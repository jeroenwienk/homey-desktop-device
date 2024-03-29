import { useEffect } from 'react';

import { commander } from '../CommanderApp';
import { cache } from '../cache';

import { makeDevicesSections } from '../sections/devices';

export function useFetchDevices({ inputValue }) {
  useEffect(() => {
    // Only start fetching if on the first path and user started typing.
    if (inputValue.length > 0 && commander.get().path.length === 0) {
      useFetchDevices.invoke({});
    }
  }, [inputValue]);
}

useFetchDevices.clear = () => {};

useFetchDevices.invoke = ({ homeyId }) => {
  const homeys = homeyId == null ? cache.get().homeys.get() : { [homeyId]: cache.get().homeys.get()[homeyId] };

  const state = cache.get();
  for (const [homeyId, homey] of Object.entries(homeys)) {
    const pendingKey = `${homeyId}-devices`;

    if (state.__pending[pendingKey] == null) {
      commander.incrementLoadingCount();
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
            ...cache.get().devices?.sourcesbyHomeyId,
            [homeyId]: {
              ...devices,
            },
          };

          const nextDeviceSectionsByHomeyId = {
            ...cache.get().devices?.sectionsByHomeyId,
            [homeyId]: sections,
          };

          const nextZoneSourcesByHomeyId = {
            ...cache.get().zones?.sourcesbyHomeyId,
            [homeyId]: {
              ...zones,
            },
          };

          const nextZoneSectionsByHomeyId = {
            ...cache.get().zones?.sectionsByHomeyId,
            [homeyId]: [], // TODO
          };

          cache.set({
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
          commander.decrementLoadingCount();
        });
    }
  }
};
