const Utils = require('./support').Utils;

let idx = 0;

class Inventory {
  constructor() {
    this.tables = [];
    this.activities = [];
    this.files = [];
    this.invErrors = 0;
    this.migErrors = 0;
    this.length = 0;
    this.currentSchema = undefined;
    this.migPointer = 0;
  }

  addTable() {
    const addNewSchema = !this.currentSchema || Utils.takeChance(10);

    if (addNewSchema) {
      let isError = false;

      if (this.currentSchema) {
        isError = Utils.takeChance(15);
        this.addActivity(isError, 'schema', this.currentSchema);
      }

      if (isError) {
        this.invErrors++;
      } else {
        this.currentSchema = Utils.getRandomSchema();
      }
    }

    const isError = Utils.takeChance(10);
    const table = {
      name: Utils.getRandomTable(),
      schema: this.currentSchema,
      size: Utils.getRandom(250000),
      inventoryAt: new Date(),
      inventorySuccess: !isError,
    };

    if (isError) {
      this.invErrors++;
    }
    this.tables.push(table);
    this.addActivity(isError, 'table-inv', table.name);
  }

  migrateNext() {
    const table = this.tables[this.migPointer];
    const isError = Utils.takeChance(10);

    table.migrationAt = new Date();
    table.migrationSuccess = !isError;
    this.migPointer++;

    if (Utils.takeChance(3)) {
      this.addFile();
    }

    if (isError) {
      this.migErrors++;
    }
    this.addActivity(isError, 'table', table.name, 'migrated');
  }

  addActivity(error, type, content, successSuffix = 'loaded') {
    const timestamp = new Date();
    const success = !error;
    let details = undefined;

    if (error) {
      type += '-error';
      details = Utils.getRandomError();
    } else {
      type += `-${successSuffix}`;
    }

    this.activities.push({ timestamp, type, content, details, success });
  }

  addFile() {
    const timestamp = new Date();
    const table = Utils.getRandomTable().toLowerCase();
    const leftPad = number => number <= 99999 ? (`0000${number}`).slice(-5) : number;
    const num = leftPad(idx);
    const message = Utils.takeChance(3) ? `mig_${num}_${table}.idk` : `inv_${num}_${table}.idk`;

    idx++;

    this.files.push({ timestamp, message });
  }

  get totalSize() {
    const addFn = (acc, t) => acc + t.size;
    return this.tables.reduce(addFn, 0);
  }

  get processedSize() {
    const addFn = (acc, t) => acc + t.size;
    return this.tables.filter(t => t.migrationAt).reduce(addFn, 0);
  }
}

module.exports = Inventory;
