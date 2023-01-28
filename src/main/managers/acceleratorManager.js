const EventEmitter = require('events');
const { globalShortcut } = require('electron');

class AcceleratorManager extends EventEmitter {
  constructor() {
    super();
    this.map = new Map();
  }

  registerCommanderShortcutAccelerator(keys, callback) {
    this.map.set('commanderShortcutAccelerator', { keys, callback });
    globalShortcut.unregisterAll();
    this.registerAll();
  }

  registerRendererAccelerators(accelerators) {
    this.map.set('rendererAccelerators', accelerators);
    globalShortcut.unregisterAll();
    this.registerAll();
  }

  registerAll() {
    function transformKeys(keys) {
      return keys.replaceAll(' ', '+')
    }

    const commanderShortcutAccelerator = this.map.get('commanderShortcutAccelerator');

    if (commanderShortcutAccelerator) {
      try {
        globalShortcut.register(transformKeys(commanderShortcutAccelerator.keys), commanderShortcutAccelerator.callback)
      } catch (error) {
        console.log(error);
      }
    }

    const rendererAccelerators = this.map.get('rendererAccelerators');

    if (rendererAccelerators) {
      for (const accelerator of rendererAccelerators) {
        try {
          globalShortcut.register(transformKeys(accelerator.keys), accelerator.callback)
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

}

module.exports = {
  acceleratorManager: new AcceleratorManager(),
};
