import React from 'react';

function makeHint(capability) {
  switch (capability.type) {
    case 'number':
      return `${capability.type}, min ${capability.min ?? '-'}, max ${
        capability.max ?? '-'
      }, step ${capability.step ?? '-'}`;
    default:
      return capability.type;
  }
}

function makeDescription(capability) {
  switch (capability.type) {
    case 'enum':
      return JSON.stringify(capability.values, null, 2); //<pre>{JSON.stringify(capability.values, null, 2)}</pre>;
    default:
      return null;
  }
}

export function makeDeviceSections({ value }) {
  const baseKey = `${value.key}-device`;

  return {
    sections: [
      {
        key: baseKey,
        title: 'Capabilities',
        children: Object.entries(value.device.capabilitiesObj)
          .map(([capabilityId, capability]) => {
            return {
              key: `${value.key}-device-${capabilityId}`,
              type: 'capability',
              textValue: capability.title,
              filter: `${capability.id} ${capability.type}`,
              hint: makeHint(capability),
              description: makeDescription(capability),
              device: value.device,
              capability,
            };
          })
          .sort((a, b) => {
            return a.textValue.localeCompare(b.textValue);
          }),
      },
    ],
  };
}
