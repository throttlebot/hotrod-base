const quilt = require('@quilt/quilt');
const machineFactory = require('./machines');
const hotrod = require('./hotrod');
const placement = require('./placements');

const namespace = "hotrod-app-" + Math.floor(Math.random() * 10000).toString();
//const namespace = "hotrod-app"
const deployment = quilt.createDeployment({namespace: namespace, adminACL: ['0.0.0.0/0']});

var machines = new machineFactory(7);
// for one per, use 21 machines
// var machines = new machineFactory(21);

hotrodApp = new hotrod();

new placement(hotrodApp, machines.getSizes()).three_per();
// for one per, comment out the three per line

deployment.deploy(machines);
deployment.deploy(hotrodApp);
