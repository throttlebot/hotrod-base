const quilt = require('@quilt/quilt');
const machineFactory = require('./machines')
const hotrod = require('./hotrod')

// const namespace = "hotrod-app-" + Math.floor(Math.random() * 10000).toString();
const namespace = "hotrod-app"
const deployment = quilt.createDeployment({namespace: namespace, adminACL: ['0.0.0.0/0']});

var machines = new machineFactory(4);

const hotrodApp = new hotrod();
// hotrodApp.placements(machines.getSizes());

deployment.deploy(machines);
deployment.deploy(hotrodApp);
