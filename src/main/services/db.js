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

    this.acceleratorCollection = new DataStore({
      filename: `${app.getPath('userData')}/accelerators`,
      autoload: true,
    });

    this.displayCollection = new DataStore({
      filename: `${app.getPath('userData')}/displays`,
      autoload: true,
    });

    this.inputCollection = new DataStore({
      filename: `${app.getPath('userData')}/inputs`,
      autoload: true,
    });
  }

  async getHistory({ limit = Infinity } = {}) {
    // this.historyCollection.remove({}, { multi: true });

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

  async insertHistoryEntry(args) {
    return new Promise((resolve, reject) => {
      this.historyCollection.insert(args, (error, entry) => {
        if (error) return reject(error);
        resolve(entry);
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
      this.buttonCollection.insert(args, (error, entry) => {
        if (error) return reject(error);
        resolve(entry);
      });
    });
  }

  async updateButton(id, args) {
    return new Promise((resolve, reject) => {
      this.buttonCollection.update({ id }, { $set: args }, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async removeButton(id) {
    return new Promise((resolve, reject) => {
      this.buttonCollection.remove({ id }, {}, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async getAccelerators() {
    return new Promise((resolve, reject) => {
      this.acceleratorCollection.find({}).exec((error, docs) => {
        if (error) return reject(error);
        resolve(docs);
      });
    });
  }

  async insertAccelerator(args) {
    return new Promise((resolve, reject) => {
      this.acceleratorCollection.insert(args, (error, entry) => {
        if (error) return reject(error);
        resolve(entry);
      });
    });
  }

  async updateAccelerator(id, args) {
    return new Promise((resolve, reject) => {
      this.acceleratorCollection.update({ id }, { $set: args }, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async removeAccelerator(id) {
    return new Promise((resolve, reject) => {
      this.acceleratorCollection.remove({ id }, {}, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async getDisplays() {
    return new Promise((resolve, reject) => {
      this.displayCollection.find({}).exec((error, docs) => {
        if (error) return reject(error);
        resolve(docs);
      });
    });
  }

  async insertDisplay(args) {
    return new Promise((resolve, reject) => {
      this.displayCollection.insert(args, (error, entry) => {
        if (error) return reject(error);
        resolve(entry);
      });
    });
  }

  async updateDisplay(id, args) {
    return new Promise((resolve, reject) => {
      this.displayCollection.update({ id }, { $set: args }, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async removeDisplay(id) {
    return new Promise((resolve, reject) => {
      this.displayCollection.remove({ id }, {}, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async getInputs() {
    return new Promise((resolve, reject) => {
      this.inputCollection.find({}).exec((error, docs) => {
        if (error) return reject(error);
        resolve(docs);
      });
    });
  }

  async insertInput(args) {
    return new Promise((resolve, reject) => {
      this.inputCollection.insert(args, (error, entry) => {
        if (error) return reject(error);
        resolve(entry);
      });
    });
  }

  async updateInput(id, args) {
    return new Promise((resolve, reject) => {
      this.inputCollection.update({ id }, { $set: args }, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async removeInput(id) {
    return new Promise((resolve, reject) => {
      this.inputCollection.remove({ id }, {}, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}

module.exports = {
  db: new DataBase(),
};
