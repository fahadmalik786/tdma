const { Utils } = require('../support');

const UploadStates = ['Start', 'Export', 'Compress', 'Encrypt', 'Upload', 'JobComplete'];
const DownloadStates = ['Start', 'Download', 'Decrypt', 'Uncompress', 'Migrate', 'JobComplete'];

class Td2TdMigrator {
  constructor(config) {
    this._config = config;
    this.jobs = [];
    this.reload();
    this.start();
  }

  reload() {
    this.config = this._config.get('td2td-settings', {});
  }

  start(size) {
    if (size) {
      console.log('Creating', size, 'jobs...');
      for(let i = 0; i < parseInt(size, 10); i++) {
        this.jobs.push({
          id: i + 1,
          name: Utils.removeRandomElement(JOB_NAMES),
          created: new Date().toISOString(),
          status: 'Pending',
        });
      }
    }
    console.log('Starting jobs in', this.config.applicationMode, 'mode (', this.jobs.length, 'in memory)');
    this.applicationMode = this.config.applicationMode;
    this.startLoop();
  }

  startLoop() {
    this._interval = setInterval(() => {
      this.jobs.forEach(j => {
        if (j.status === 'In Progress') {
          j.stateStr = j.stateStr || states[0];
          j.progress = j.progress || '0';
          j.progress = '' + (parseInt(j.progress, 10) + Utils.getRandom(10));

          if (parseInt(j.progress, 10) >= 100) {
            j.progress = '0';
            if (!this.moveToNextState(j)) {
              j.status = 'Finished';
            }
          }

          if (j.stateStr === 'Start' || j.stateStr === 'JobComplete') {
            j.progress = '0';
            if (!this.moveToNextState(j)) {
              j.status = 'Finished';
            }
          }
        }
      });
    }, 500);
  }

  get states() {
    let states = this.config.jobMode === 'upload' ? UploadStates : DownloadStates;
    if (this.config.applicationMode === 'tmc') {
      const uploadIdx = states.indexOf('Upload');
      const downloadIdx = states.indexOf('Download');
      if (uploadIdx > -1) {
        states.splice(uploadIdx, 1);
      }
      if (downloadIdx > -1) {
        states.splice(downloadIdx, 1);
      }
    }
    return states;
  }

  moveToNextState(job) {
    const pos = this.states.indexOf(job.stateStr);
    if (pos === this.states.length - 1) {
      return false;
    }
    job.stateStr = this.states[pos + 1];
    return true;
  }

  getJobs() {
    return this.jobs;
  }

  addJob(json) {
    const status = 'Pending';
    const job = Object.assign({ status }, json);

    if (job.scheduleTSUI) {
      job.scheduledTime = job.scheduleTSUI
    }

    this.jobs.push(job);
    return json;
  }

  findJobByName(jobName) {
    return this.jobs.find(j => j.jobName === jobName);
  }

  deleteJob(jobName) {
    const job = this.findJobByName(jobName);

    if (!job) {
      return;
    }

    this.jobs.splice(this.jobs.indexOf(job), 1);

    return job;
  }

  scheduleJob(jobName, scheduledTime) {
    const job = this.findJobByName(jobName);

    if (!job) {
      return;
    }

    job.status = 'Scheduled';
    // job.scheduledTime = scheduledTime;
    job.scheduled_time = scheduledTime;

    return job;
  }

  startJob(jobName) {
    const job = this.findJobByName(jobName);

    if (!job) {
      return;
    }

    job.status = 'In Progress';
    job.stateStr = this.states[0];
    job.progress = '0';

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
  'All Tables',
  'HR Tables',
];

module.exports = Td2TdMigrator;