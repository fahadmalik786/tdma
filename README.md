# TDMA Mock API Server

## Node.js install

```
curl --silent --location https://rpm.nodesource.com/setup_7.x | sudo bash -
sudo yum -y install nodejs
```

## Mock API install

```
cd ~
git clone git@github.com:gistia/teradata-tdma-mock-api.git tdma-mock-api
sudo npm install -g yarn forever forever-service
yarn
sudo forever-service install tdma-mock-api --script server.js
```

### Commands to interact with service tdma-mock-api

```
Start   - "sudo service tdma-mock-api start"
Stop    - "sudo service tdma-mock-api stop"
Status  - "sudo service tdma-mock-api status"
Restart - "sudo service tdma-mock-api restart"
```
