const fs = require('fs');
const path = require('path');

class Config {
  constructor(savePath) {
    this.savePath = savePath || path.join(__dirname, 'data');
  }
  get(setting, fallbackValue) {
    const file = path.join(this.savePath, `${setting}.json`);
    let json;

    if (fs.existsSync(file)) {
      json = JSON.parse(fs.readFileSync(file, 'utf8'));
    }

    return json || fallbackValue;
  }

  set(setting, json) {
    const file = path.join(this.savePath, `${setting}.json`);
    fs.writeFileSync(file, JSON.stringify(json), 'utf8');
  }
}

module.exports = Config;