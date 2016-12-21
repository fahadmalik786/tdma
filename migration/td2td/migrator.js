const { Utils } = require('../support');

const UploadStates = ['Export', 'Compress', 'Encryption', 'Upload'];
const DownloadStates = ['Download', 'Decryption', 'Uncompress', 'Import'];

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
    const pos = this.states.indexOf(job.state);
    if (pos === this.states.length - 1) {
      return false;
    }
    job.state = this.states[pos + 1];
    return true;
  }

  getJobs() {
    return this.jobs;
  }

  addJob(json) {
    const status = 'Pending';
    const job = Object.assign({ status }, json);

    this.jobs.push(job);
    return json;
  }

  scheduleJob(jobName, scheduledTime) {
    console.log('this.jobs', this.jobs);
    
    const job = this.jobs.find(j => j.name === jobName);

    if (!job) {
      return;
    }    

    job.status = 'Scheduled';
    job.scheduled_time = scheduledTime;

    return job;
  }

  startJob(jobName) {
    const job = this.jobs.find(j => j.name === jobName);
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
  'All Tables',
  'HR Tables',
];

module.exports = Td2TdMigrator;