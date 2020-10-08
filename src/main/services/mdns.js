const os = require('os');
const ciao = require('@homebridge/ciao');

class MDNS {
  constructor() {
    console.log('MDNS:constructor');
    this.responder = ciao.getResponder();
    this.service = this.responder.createService({
      name: 'homey-desktop',
      type: 'homeydesktop',
      port: 3106,
      txt: {
        id: os.hostname(),
        name: os.hostname(),
        port: 3106,
      },
    });
  }

  advertise() {
    this.service.advertise().then(() => {
      console.log('mdns:service:published');
    });
  }

  async close() {
    await this.service.end();
    await this.responder.shutdown();
    console.log('mdns:closed');
  }
}

module.exports = MDNS;
