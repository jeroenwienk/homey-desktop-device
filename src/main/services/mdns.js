const os = require('os');
const ciao = require('@homebridge/ciao');
const macaddress = require('macaddress');

class MDNS {
  constructor() {
    console.log('mdns:constructor');
    this.mac = null;
    this.responder = null;
    this.service = null;
    this.port = 3106;
  }

  async init() {
    console.log('mdns:init');
    this.mac = await macaddress.one();

    this.responder = ciao.getResponder();
    this.service = this.responder.createService({
      name: `homey-desktop-device-${this.mac}`,
      type: 'homeydesktop',
      port: this.port,
      txt: {
        id: `${this.mac}:${os.platform()}`,
        hostname: os.hostname(),
        platform: os.platform(),
        port: this.port,
        mac: this.mac,
      },
    });
  }

  async advertise() {
    await this.service.advertise();
    console.log('mdns:service:published');
  }

  async close() {
    await this.service.end();
    console.log('mdns:service:end');
    await this.responder.shutdown();
    console.log('mdns:responder:shutdown');
  }
}

module.exports = new MDNS();
