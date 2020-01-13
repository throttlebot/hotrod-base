const quilt = require('@quilt/quilt');
const machineFactory = require('./machines');
const hotrod = require('./hotrod');
const placement = require('./placement.js');
const WorkloadGen = require("./workload.js");
const utils = require("./utils.js");

const namespace = "hotrod-michael-ubuntu1"
const deployment = quilt.createDeployment({namespace: namespace, adminACL: ['0.0.0.0/0']});

var machines = new machineFactory(9);

hotrodApp = new hotrod();
new placement(hotrodApp, machines.getSizes()).affinity_placement();

const workload_count = 2;

// Create additional machines for worker generation
machine_list = []
const baseDiskSize = 20;
for (i=0; i < workload_count; i++) {
    const workloadMachine = new quilt.Machine({
	provider: 'Amazon',
	size: 'c4.xlarge',
	diskSize: baseDiskSize+i, 
	region: 'us-west-1'
    });
    utils.addSshKey(workloadMachine);
    deployment.deploy(workloadMachine.asWorker());
    machine_list.push(workloadMachine);
}

const workload = new WorkloadGen(workload_count);
hotrodApp.ingress.allowFrom(workload.cluster, 80);

workload.cluster[0].placeOn({diskSize: 20});
for(i=0; i < workload_count; i++) {
    workload.cluster[i+1].placeOn({diskSize: 20+i});
    workload.cluster[i+ 1 + workload_count].placeOn({diskSize: 20+i});
    workload.cluster[i + 1 + workload_count*2].placeOn({diskSize: 20+i});
}

deployment.deploy(machines);
deployment.deploy(hotrodApp);
deployment.deploy(workload);
