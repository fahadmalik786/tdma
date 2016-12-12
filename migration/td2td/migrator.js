const { Utils } = require('../support');

const States = ['Export', 'Compress', 'Encryption', 'Upload', 'Finished'];

class Td2TdMigrator {
  constructor() {
    this.jobs = JOBS;
    this.start();
  }

  start() {
    this._interval = setInterval(() => {
      this.jobs.forEach(j => {
        if (j.status === 'In Progress') {
          j.state = j.state || 'Export';
          j.progress = j.progress || 0;
          j.progress += Utils.getRandom(10);

          if (j.progress >= 100) {
            j.progress = 0;
            this.moveToNextState(j);
          }
        }
      });
    }, 500);
  }

  moveToNextState(job) {
    const pos = States.indexOf(job.state);
    if (pos === States.length - 1) {
      return false
    }
    job.state = States[pos + 1];
    return true;
  }

  getJobs() {
    return this.jobs;
  }

  addJob(json) {
    json.id = this.jobs[this.jobs.length - 1].id + 1;
    this.jobs.push(json);
    return json;
  }
}

const JOBS = [
  {
    id: 1,
    name: 'Human Resources',
    created: '2016-12-07T23:40:29.359Z',
    status: 'In Progress',
    state: 'Export',
    progress: 0,
  },
  {
    id: 2,
    name: 'SAP',
    created: '2016-12-07T23:40:29.359Z',
    status: 'In Progress',
    state: 'Export',
    progress: 0,
  },
  {
    id: 10,
    name: 'Sales',
    created: '2016-12-07T23:40:29.359Z',
    status: 'Pending',
    scheduled_time: undefined,
  },
  {
    id: 11,
    name: 'Inventory',
    created: '2016-12-07T23:40:29.359Z',
    status: 'Pending',
    scheduled_time: undefined,
  },
  {
    id: 20,
    name: 'Employees',
    created: '2016-12-07T23:40:29.359Z',
    status: 'Scheduled',
    scheduled_time: '2016-12-08T05:30:00Z',
  },
];

module.exports = Td2TdMigrator;