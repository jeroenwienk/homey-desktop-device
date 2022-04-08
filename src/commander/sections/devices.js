import { defaultTextValueSort } from '../defaultTextValueSort';

export async function makeDevicesSections({ value }) {
  const baseKey = `${value.key}-devices`;

  const devices = await value.homey.api.devices.getDevices();
  const zones = await value.homey.api.zones.getZones();

  return {
    devices,
    zones,
    sections: [
      {
        key: baseKey,
        title: 'Devices',
        children: Object.entries(devices)
          .map(([id, device]) => {
            const zone = zones[device.zone];

            return {
              key: id,
              type: 'device',
              textValue:
                zone != null
                  ? `${zone.name} - ${device.name}`
                  : `${device.name}`,
              hint: device.class,
              filter: `${device.class}`,
              device,
            };
          })
          .sort(defaultTextValueSort),
      },
    ],
  };
}
