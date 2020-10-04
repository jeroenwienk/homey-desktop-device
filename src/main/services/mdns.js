const os = require('os');
const ciao = require('@homebridge/ciao');
const responder = ciao.getResponder();

const service = responder.createService({
  name: 'homey-desktop',
  type: 'homeydesktop',
  port: 3106,
  txt: {
    id: os.hostname(),
    name: os.hostname(),
    port: 3106,
    randomVal: Math.random(),
  },
});

service.advertise().then(() => {
  console.log('Service is published');
});

async function exitHandler(options, exitCode) {
  try {
    await service.end();
    await responder.shutdown();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

// const fetch = require('node-fetch');
// fetch('http://192.168.178.19:80/api/app/nl.jwienk.desktop/', {
//   method: 'POST',
//   body: 'a=1'
// })
// .then(res => res.json()) // expecting a json response
// .then(json => console.log(json));
//
// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
// process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
