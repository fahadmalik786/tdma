class FakeDataProgress {
  constructor(inventory, updateFreq) {
    this.inventory = inventory;
    this.updateFreq = updateFreq;

    this.current = 0;
    this.startedAt = null;
    this.finishedAt = null;
  }

  get total() {
    return this.inventory.length;
  }

  start() {
    this.startedAt = new Date();
    this._interval = setInterval(() => {
      if (this.current >= this.total) {
        clearInterval(this._interval);
        this.finishedAt = new Date();
      } else {
        this.current += 1;
        if (this.tick) {
          this.tick(this.current);
        }
      }
    }, this.updateFreq);
  }
}

class Utils {
  static getRandomTable() {
    return Utils.getRandomElement(tableNames);
  }

  static getRandomTables(n) {
    const tables = [];
    for (let i = 0; i < n; i++) {
      const table = Utils.getRandomTable();
      if (tables.indexOf(table) <= -1) {
        tables.push(table);
      }
    }
    return tables;
  }

  static getRandomSchema() {
    return Utils.getRandomElement(schemaNames);
  }

  static getRandomSchemas(n) {
    const schemas = [];
    for (let i = 0; i < n; i++) {
      const schema = Utils.getRandomSchema();
      if (schemas.indexOf(schema) <= -1) {
        schemas.push(schema);
      }
    }
    return schemas;
  }

  static getRandomError() {
    return Utils.getRandomElement(errorMessages);
  }

  static getRandom(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  static getRandomElement(array) {
    return array[this.getRandom(array.length) - 1];
  }

  static getRandomElements(n, array) {
    const source = _.cloneDeep(array);
    const res = [];
    for (let i = 0; i < n; i++) {
      res.push(removeRandomElement(source));
    }
    return res;
  }

  static removeRandomElement(array) {
    return array.splice(Utils.getRandom(array.length - 1), 1);
  }

  static getRandomElementWithProbability(array) {
    let result = [];
    array.forEach(v => {
      for (let i = 0; i < v.probability; i++) {
        result.push(v);
      }
    });
    return this.getRandomElement(result);
  }

  static takeChance(prob) {
    return this.getRandom(prob) === 1;
  }

  static fmtDate(date) {
    return date ? date.toISOString() : null;
  };
}

const tableNames = [
  'CUSTOMERS', 'SALES', 'SALES_ITEMS', 'CUSTOMER_SALES', 'USERS', 'LOCATION',
  'ORDERS', 'ORDER_ITEMS', 'CTD', 'ACTIONS', 'ACTION_LOGS', 'ENTRIES',
  'DEALERS', 'STATES', 'CITIES', 'COUNTRIES', 'CONFIGURATION_SETTINGS',
  'OPPORTUNITIES', 'PROJECTS', 'TIME_ENTRIES', 'TASKS', 'RESOURCES',
  'DELIVERABLES', 'MILESTONES', 'CUSTOMER_LOG', 'ORDER_LOG',
  'CUSTOMER_HISTORY', 'ORDER_HISTORY', 'ORDER_LOG_HISTORY', 'PRODUCT',
  'PRODUCT_CONFIGURATION', 'PRODUCT_HISTORY', 'PRODUCT_CONFIGURATION_HISTORY',
  'OPPORTUNITIES_HISTORY',
];

const schemaNames = [
  'HR', 'HUMAN_RESOURCES', 'FINANCE', 'FIN', 'SALES', 'SLS', 'PROD',
  'PRODUCTION', 'TEST', 'INT', 'INTEGRATION', 'STOCK', 'DEV', 'DEVELOPMENT',
  'TOOLS', 'SC42', 'GE_INVENTORY_SCHEMA', 'ABC_SALES', '_HISTORY',
  '_ARCHIVE', 'MIGRATION',
];

const errorMessages = [
  'ORA-12154: TNS:could not resolve the connect identifier specified',
  'ORA-00600: internal error code, arguments: name, value',
  'ORA-1722: Invalid Number',
  'ORA-03113: end-of-file on communication channel',
  'ORA-01000: maximum open cursors exceeded',
];

module.exports = { FakeDataProgress, Utils };