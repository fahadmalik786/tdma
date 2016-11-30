const { FakeDataProgress, Utils } = require('./support');

const TOTAL_TABLES = Utils.getRandom(7500);

class InventoryMigrator extends FakeDataProgress {
  constructor(totalTables, inventory, delay) {
    super(inventory, delay);
    this.totalTables = totalTables;
    this.inventory = inventory;
  }

  tick() {
    this.inventory.addTable();
  }

  get total() {
    return this.totalTables || TOTAL_TABLES;
  }
}

class DataMigrator extends FakeDataProgress {
  constructor(totalTables, inventory, delay) {
    super(inventory, delay);
    this.totalTables = totalTables;
  }

  tick() {
    this.inventory.migrateNext();
  }

  get total() {
    return this.totalTables || TOTAL_TABLES;
  }

  get processedSize() {
    return this.inventory.processedSize;
  }

  get totalSize() {
    return this.inventory.totalSize;
  }
}

module.exports = { InventoryMigrator, DataMigrator };