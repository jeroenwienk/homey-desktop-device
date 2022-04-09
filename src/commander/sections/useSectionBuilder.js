import { useMemo } from 'react';

import { useFetchDevices } from '../fetchers/useFetchDevices';
import { makeSystemSections } from './system';

export function useSectionBuilder({ cacheRef, state, forcedUpdate }) {
  const sections = useMemo(() => {
    const cache = cacheRef.current;
    const pathChunk = state.path[state.path.length - 1];

    switch (true) {
      case state.path.length === 0: {
        let result = [];
        if (cache.homeys != null) {
          const sections = cache.homeys.sections;

          if (sections != null) {
            for (const section of sections) {
              result.push(section);
            }
          }
        }

        if (cache.commands != null) {
          const sectionsByHomeyId = cache.commands.sectionsByHomeyId;
          const collectedSectionChildren = [];

          // eslint-disable-next-line no-unused-vars
          for (const [homeyId, sections] of Object.entries(sectionsByHomeyId)) {
            for (const section of sections) {
              collectedSectionChildren.push(section.children);
            }
          }

          result.push({
            key: 'commands',
            title: 'Commands',
            children: Array.prototype.concat.apply(
              [],
              collectedSectionChildren
            ),
          });
        }

        if (cache.devices != null) {
          const sectionsByHomeyId = cache.devices.sectionsByHomeyId;
          const collectedSectionChildren = [];

          // eslint-disable-next-line no-unused-vars
          for (const [homeyId, sections] of Object.entries(sectionsByHomeyId)) {
            for (const section of sections) {
              collectedSectionChildren.push(section.children);
            }
          }

          result.push({
            key: 'devices',
            title: 'Devices',
            children: Array.prototype.concat.apply(
              [],
              collectedSectionChildren
            ),
          });
        }

        if (true) {
          const { sections } = makeSystemSections({});
          result = Array.prototype.concat.apply(result, sections);
        }

        return result;
      }
      case pathChunk.type === 'homey': {
        let result = [];

        if (cache.commands != null) {
          const sections = cache.commands.sectionsByHomeyId[pathChunk.key];
          result = Array.prototype.concat.apply(result, sections);
        }

        useFetchDevices.invoke({ homeyId: pathChunk.key });
        if (cache.devices != null) {
          const sections = cache.devices.sectionsByHomeyId[pathChunk.key];
          result = Array.prototype.concat.apply(result, sections);
        }

        return result;
      }
      default:
        return state.sections;
    }
    // We control it with forcedUpdate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.path, forcedUpdate]);

  return sections;
}
