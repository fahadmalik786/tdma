const moment = require('moment');

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

  static getRandomMinsAgo(n) {
    return moment().subtract(Utils.getRandom(n), 'minutes');
  }

  static getRandomScheduledSchemas(n) {
    const schemas = [];
    const returnValue = {schemas:undefined};
    for (let i = 0; i < n; i++) {
      const schema = Utils.getRandomSchema();
      const status = Utils.getRandomSchemaStatus();

      let migration_start;
      let migration_completed;

      if (schemas.indexOf(schema) <= -1) {
        if (status === 'RUNNING') {
          migration_start = Utils.getRandomMinsAgo(30);
        } else if (status === 'COMPLETED') {
          migration_start = Utils.getRandomMinsAgo(120);
          migration_completed = moment(migration_start).add(Utils.getRandom(45), 'minutes');
          migration_completed = moment(Math.min(migration_completed, new Date()));
        }

        schemas.push({
          name: schema,
          priority: Utils.getRandom(5),
          scheduled: Utils.fmtDate(new Date()),
          status: status,
          migration_start,
          migration_completed,
        });
      }
    }
    returnValue.schemas = schemas;
    return returnValue;
  }

  static getRandomSchemaStatus() {
    return Utils.getRandomElement(schemaStatus);
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
  'CUSTOMERS1', 'SALES1', 'SALES_ITEMS1', 'CUSTOMER_SALES1', 'USERS1', 'LOCATION1',
  'ORDERS1', 'ORDER_ITEMS1', 'CTD1', 'ACTIONS1', 'ACTION_LOGS1', 'ENTRIES1',
  'DEALERS1', 'STATES1', 'CITIES1', 'COUNTRIES1', 'CONFIGURATION_SETTINGS1',
  'OPPORTUNITIES1', 'PROJECTS1', 'TIME_ENTRIES1', 'TASKS1', 'RESOURCES1',
  'DELIVERABLES1', 'MILESTONES1', 'CUSTOMER_LOG1', 'ORDER_LOG1',
  'CUSTOMER_HISTORY1', 'ORDER_HISTORY1', 'ORDER_LOG_HISTORY1', 'PRODUCT1',
  'PRODUCT_CONFIGURATION1', 'PRODUCT_HISTORY1', 'PRODUCT_CONFIGURATION_HISTORY1',
  'OPPORTUNITIES_HISTORY1',
];

const schemaNames = [
  'HR', 'HUMAN_RESOURCES', 'FINANCE', 'FIN', 'SALES', 'SLS', 'PROD',
  'PRODUCTION', 'TEST', 'INT', 'INTEGRATION', 'STOCK', 'DEV', 'DEVELOPMENT',
  'TOOLS', 'SC42', 'GE_INVENTORY_SCHEMA', 'ABC_SALES', '_HISTORY',
  '_ARCHIVE', 'MIGRATION',
  'HR1', 'HUMAN_RESOURCES1', 'FINANCE1', 'FIN1', 'SALES1', 'SLS1', 'PROD1',
  'PRODUCTION1', 'TEST1', 'INT1', 'INTEGRATION1', 'STOCK1', 'DEV1', 'DEVELOPMENT1',
  'TOOLS1', 'SC421', 'GE_INVENTORY_SCHEMA1', 'ABC_SALES1', '_HISTORY1',
  '_ARCHIVE1', 'MIGRATION1',
  'HR2', 'HUMAN_RESOURCES2', 'FINANCE2', 'FIN2', 'SALES2', 'SLS2', 'PROD2',
  'PRODUCTION2', 'TEST2', 'INT2', 'INTEGRATION2', 'STOCK2', 'DEV2', 'DEVELOPMENT2',
  'TOOLS2', 'SC422', 'GE_INVENTORY_SCHEMA2', 'ABC_SALES2', '_HISTORY2',
  '_ARCHIVE2', 'MIGRATION2',
  'HR3', 'HUMAN_RESOURCES3', 'FINANCE3', 'FIN3', 'SALES3', 'SLS3', 'PROD3',
  'PRODUCTION3', 'TEST3', 'INT3', 'INTEGRATION3', 'STOCK3', 'DEV3', 'DEVELOPMENT3',
  'TOOLS3', 'SC423', 'GE_INVENTORY_SCHEMA3', 'ABC_SALES3', '_HISTORY3',
  '_ARCHIVE3', 'MIGRATION3',
];

const errorMessages = [
  'ORA-12154: TNS:could not resolve the connect identifier specified',
  'ORA-00600: internal error code, arguments: name, value',
  'ORA-1722: Invalid Number',
  'ORA-03113: end-of-file on communication channel',
  'ORA-01000: maximum open cursors exceeded',
];

const schemaStatus = ['SCHEDULED', 'RUNNING', 'COMPLETED'];

module.exports = { FakeDataProgress, Utils };
