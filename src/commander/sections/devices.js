import { defaultTextValueSort } from '../defaultTextValueSort';
import { commander } from '../CommanderApp';
import { consoleManager } from '../Console';

export async function makeDevicesSections({ value }) {
  const baseKey = `${value.key}-devices`;
  const { homey } = value.context;

  const devices = await homey.api.devices.getDevices();
  const zones = await homey.api.zones.getZones();

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
              inputModeHint: 'quick action',
              action({ input }) {
                Promise.resolve()
                  .then(async () => {
                    try {
                      commander.incrementLoadingCount();
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

                      await device.setCapabilityValue({
                        capabilityId: capabilityId,
                        value: nextValue,
                      });
                    } catch (error) {
                      consoleManager.addError(error);
                    } finally {
                      commander.decrementLoadingCount();
                    }
                  })
                  .catch((error) => {
                    consoleManager.addError(error);
                  });
              },
              context: {
                device,
              },
            };
          })
          .sort(defaultTextValueSort),
      },
    ],
  };
}
