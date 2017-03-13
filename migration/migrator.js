const InventoryMigrator = require('./migrations').InventoryMigrator;
const DataMigrator = require('./migrations').DataMigrator;
const Inventory = require('./inventory');
const { Utils } = require('./support');

class Migrator {
  constructor() {
  }

  isRunning() {
    return !!this.inventory;
  }

  reset(migrationSize, migrationSpeed = 1000) {
    this.inventory = new Inventory();
    this.invMigrator = new InventoryMigrator(migrationSize, this.inventory, 250);
    this.dataMigrator = new DataMigrator(migrationSize, this.inventory, migrationSpeed);
  }

  start(size, migSpeed) {
    this.reset(size, migSpeed);
    this.invMigrator.start();
    setTimeout(() => { this.dataMigrator.start() }, Utils.getRandom(20) * 1000);
  }

  getInventoryActivities() {
    return this.inventory.activities.filter(a => a.type.indexOf('migrated') < 0 && a.success);
  }

  getDataMigrationActivities() {
    return this.inventory.activities.filter(a => a.type.indexOf('migrated') > -1 && a.success);
  }

  getDataMigrationInProgressActivities() {
    return this.inventory.tablePercentage;
  }

  getErrors() {
    return this.inventory.activities.filter(a => !a.success);
  }

  get invContents() {
    return this.inventory.contents;
  }
}

module.exports = Migrator;
