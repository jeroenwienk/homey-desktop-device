import { defaultTextValueSort } from '../defaultTextValueSort';
import { store } from '../CommanderApp';

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
              textValue: zone != null ? `${zone.name} - ${device.name}` : `${device.name}`,
              hint: device.virtualClass ?? device.class,
              filter: `${device.virtualClass ?? device.class}`,
              action({ input }) {
                Promise.resolve()
                  .then(async () => {
                    try {
                      store.getState().incrementLoadingCount();
                      // await device.connect();

                      if (device.ui.quickAction == null) return;

                      const capabilityId = device.ui.quickAction;
                      const capability = device.capabilitiesObj?.[capabilityId];

                      if (capability?.type !== 'boolean') return;

                      const current = await device.homey.devices.getDevice({
                        id: device.id,
                      });
                      const currentValue = current.capabilitiesObj?.[capabilityId]?.value;
                      let nextValue = currentValue !== true;

                      if (capability.getable === false) {
                        nextValue = true;
                      }

                      const result = await device.setCapabilityValue({
                        capabilityId: capabilityId,
                        value: nextValue,
                      });

                      console.log(result);
                    } catch (error) {
                      console.log(error);
                    } finally {
                      store.getState().decrementLoadingCount();
                    }
                  })
                  .catch(console.error);
              },
              device,
            };
          })
          .sort(defaultTextValueSort),
      },
    ],
  };
}
