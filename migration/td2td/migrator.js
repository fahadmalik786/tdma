const { Utils } = require('../support');

const BackupStates = ['Export', 'Compress', 'Encryption', 'Upload'];
const RestoreStates = ['Download', 'Decryption', 'Uncompress', 'Import'];

class Td2TdMigrator {
  constructor(size) {
    this.jobs = [];
  }

  start(runningMode, size) {
    if (size) {
      console.log('Creating', size, 'jobs...');
      for(let i = 0; i < parseInt(size, 10); i++) {
        this.jobs.push({
          id: i + 1,
          name: Utils.getRandomElement(JOB_NAMES),
          created: new Date().toISOString(),
          status: 'Pending',
        });
      }
    }
    console.log('Starting jobs in', runningMode, 'mode (', this.jobs.length, 'in memory)');
    this._runningMode = runningMode;
    this._interval = setInterval(() => {
      this.jobs.forEach(j => {
        if (j.status === 'In Progress') {
          j.state = j.state || states[0];
          j.progress = j.progress || 0;
          j.progress += Utils.getRandom(10);

          if (j.progress >= 100) {
            j.progress = 0;
            if (!this.moveToNextState(j)) {
              j.status = 'Finished';
            }
          }
        }
      });
    }, 500);
  }

  get states() {
    return this._runningMode === 'backup' ? BackupStates : RestoreStates;
  }

  moveToNextState(job) {
    const pos = this.states.indexOf(job.state);
    if (pos === this.states.length - 1) {
      return false
    }
    job.state = this.states[pos + 1];
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

  startJob(incomingJob) {
    const job = this.jobs.find(j => j.id === incomingJob.id);
    if (!job) {
      return;
    }
    job.status = 'In Progress';
    job.state = this.states[0];
    job.progress = 0;
    return job;
  }
}

const JOB_NAMES = [
  'Human Resources',
  'SAP',
  'Sales',
  'Inventory',
  'Employees',
  'Production',
  'Products',
];
//   {
//     id: 1,
//     name: 'Human Resources',
//     created: '2016-12-07T23:40:29.359Z',
//     status: 'In Progress',
//     state: 'Export',
//     progress: 0,
//   },
//   {
//     id: 2,
//     name: 'SAP',
//     created: '2016-12-07T23:40:29.359Z',
//     status: 'In Progress',
//     state: 'Export',
//     progress: 0,
//   },
//   {
//     id: 10,
//     name: 'Sales',
//     created: '2016-12-07T23:40:29.359Z',
//     status: 'Pending',
//     scheduled_time: undefined,
//   },
//   {
//     id: 11,
//     name: 'Inventory',
//     created: '2016-12-07T23:40:29.359Z',
//     status: 'Pending',
//     scheduled_time: undefined,
//   },
//   {
//     id: 20,
//     name: 'Employees',
//     created: '2016-12-07T23:40:29.359Z',
//     status: 'Scheduled',
//     scheduled_time: '2016-12-08T05:30:00Z',
//   },
// ];

module.exports = Td2TdMigrator;