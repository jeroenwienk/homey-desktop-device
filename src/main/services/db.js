const { app } = require('electron');
const DataStore = require('nedb');

class DataBase {
  constructor() {
    this.historyCollection = new DataStore({
      filename: `${app.getPath('userData')}/history`,
      autoload: true,
    });

    this.buttonCollection = new DataStore({
      filename: `${app.getPath('userData')}/buttons`,
      autoload: true,
    });
  }

  async getHistory({ limit = Infinity } = {}) {
    return new Promise((resolve, reject) => {
      this.historyCollection
        .find({})
        .sort({ date: -1 })
        .limit(limit)
        .exec((error, docs) => {
          if (error) return reject(error);
          resolve(docs);
        });
    });
  }

  async getButtons() {
    return new Promise((resolve, reject) => {
      this.buttonCollection.find({}).exec((error, docs) => {
        if (error) return reject(error);
        resolve(docs);
      });
    });
  }

  async insertButton(args) {
    return new Promise((resolve, reject) => {
      this.buttonCollection.insert(args, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}

// commandCollection.remove({}, { multi: true }, function (err, numRemoved) {
//   console.log(numRemoved);
// });

module.exports = new DataBase();
