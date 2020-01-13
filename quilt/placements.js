const assert = require('assert');

function placements(hotrod, diskSizes) {

    this.num_instances = 6 + 5 * hotrod.instance_number;
    
    this.three_per = function three_per() { 
        requiredMachines = Math.ceil(this.num_instances / 3);
        assert(diskSizes.length >= requiredMachines);
      
        for (i = 0; i < hotrod.instance_number; i++) {
           hotrod.route[i].placeOn({diskSize: diskSizes[i + 3]});
           hotrod.mapper[i].placeOn({diskSize: diskSizes[i]});
           hotrod.api[i].placeOn({diskSize: diskSizes[i]});
           hotrod.customer[i].placeOn({diskSize: diskSizes[i]});
           hotrod.driver[i].placeOn({diskSize: diskSizes[i + 3]});
        }
        hotrod.frontend.placeOn({diskSize: diskSizes[3]});
        hotrod.api_haproxy.placeOn({diskSize: diskSizes[4]});
        hotrod.map_haproxy.placeOn({diskSize: diskSizes[5]});        

        hotrod.ingress.placeOn({diskSize: diskSizes[6]});
        hotrod.redis.placeOn({diskSize: diskSizes[6]});
        hotrod.postgres.placeOn({diskSize: diskSizes[6]});
	hotrod.seed.placeOn({diskSize: diskSizes[6]});
    } 
}

module.exports = placements;
