const assert = require('assert');

// INFO:root:IMR Aware Service Placement is {0: ['hantaowang/hotrod-mapper:log', 'hantaowang/hotrod-customer:log', 'hantaowang/hotrod-customer:log', 'hantaowang/hotrod-customer:log', 'haproxy:1.7', 'haproxy:1.7', 'library/postgres:9.4', 'hantaowang/redis', 'hantaowang/hotrod-driver:log', 'hantaowang/hotrod-driver:log'], 1: ['hantaowang/hotrod-driver:log', 'hantaowang/hotrod-frontend', 'nginx:1.7.9', 'hantaowang/hotrod-api:log'], 2: ['hantaowang/hotrod-mapper:log', 'hantaowang/hotrod-api:log', 'hantaowang/hotrod-api:log'], 3: ['hantaowang/hotrod-route:log', 'hantaowang/hotrod-route:log', 'hantaowang/hotrod-route:log'], 4: ['hantaowang/hotrod-mapper:log']}

// Original
//hotrod.customer[0].placeOn({diskSize: diskSizes[0]});
//hotrod.customer[1].placeOn({diskSize: diskSizes[0]});
//hotrod.customer[2].placeOn({diskSize: diskSizes[0]});
//hotrod.api_haproxy.placeOn({diskSize: diskSizes[0]});
//hotrod.map_haproxy.placeOn({diskSize: diskSizes[0]});
//hotrod.redis.placeOn({diskSize: diskSizes[0]});
//hotrod.postgres.placeOn({diskSize: diskSizes[0]});
//hotrod.ingress.placeOn({diskSize: diskSizes[0]});
//hotrod.frontend.placeOn({diskSize: diskSizes[0]});
//hotrod.route[0].placeOn({diskSize: diskSizes[0]});

//hotrod.mapper[1].placeOn({diskSize: diskSizes[1]});
//hotrod.route[1].placeOn({diskSize: diskSizes[1]});
//hotrod.route[2].placeOn({diskSize: diskSizes[1]});

//hotrod.driver[0].placeOn({diskSize: diskSizes[2]});
//hotrod.driver[2].placeOn({diskSize: diskSizes[2]});
//hotrod.driver[1].placeOn({diskSize: diskSizes[2]});

//hotrod.mapper[2].placeOn({diskSize: diskSizes[3]});
//hotrod.api[0].placeOn({diskSize: diskSizes[3]});

//hotrod.api[1].placeOn({diskSize: diskSizes[4]});
//hotrod.api[2].placeOn({diskSize: diskSizes[4]});

//hotrod.mapper[0].placeOn({diskSize: diskSizes[5]});

function placements(hotrod, diskSizes) {

    this.num_instances = 6;

    this.special_placement = function special_placement() {
	hotrod.customer[0].placeOn({diskSize: diskSizes[0]});
	hotrod.customer[1].placeOn({diskSize: diskSizes[0]});
	hotrod.customer[2].placeOn({diskSize: diskSizes[0]});
	hotrod.api_haproxy.placeOn({diskSize: diskSizes[0]});
	hotrod.map_haproxy.placeOn({diskSize: diskSizes[0]});
	hotrod.postgres.placeOn({diskSize: diskSizes[0]});
	hotrod.ingress.placeOn({diskSize: diskSizes[0]});
	hotrod.frontend.placeOn({diskSize: diskSizes[0]});
	
	hotrod.route[0].placeOn({diskSize: diskSizes[6]});
	hotrod.redis.placeOn({diskSize: diskSizes[6]});

	hotrod.mapper[1].placeOn({diskSize: diskSizes[1]});
	hotrod.route[1].placeOn({diskSize: diskSizes[1]});
	hotrod.route[2].placeOn({diskSize: diskSizes[8]});

	hotrod.driver[0].placeOn({diskSize: diskSizes[2]});
	hotrod.driver[2].placeOn({diskSize: diskSizes[2]});
	
	hotrod.driver[1].placeOn({diskSize: diskSizes[7]});

	hotrod.mapper[2].placeOn({diskSize: diskSizes[3]});
	hotrod.api[0].placeOn({diskSize: diskSizes[3]});

	hotrod.api[1].placeOn({diskSize: diskSizes[4]});
	hotrod.api[2].placeOn({diskSize: diskSizes[4]});

	hotrod.mapper[0].placeOn({diskSize: diskSizes[5]});
    } 
}

module.exports = placements;
