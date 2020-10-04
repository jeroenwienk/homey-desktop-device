const { app, ipcMain } = require('electron');
const DataStore = require('nedb');

const commandCollection = new DataStore({
  filename: `${app.getPath('userData')}/commands`,
  autoload: true,
});

// commandCollection.remove({}, { multi: true }, function (err, numRemoved) {
//   console.log(numRemoved);
// });

ipcMain.on('init', (event, args) => {
  commandCollection
    .find({})
    .limit(20)
    .exec((error, docs) => {
      if (error) return console.error(error);
      event.reply('init:commands', docs);
    });
});

module.exports = {
  commandCollection,
};
