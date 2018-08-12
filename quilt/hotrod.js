const { Container, allow, publicInternet } = require('@quilt/quilt');
const assert = require('assert');
const fs = require("fs");

function hotrod() {

    this.instance_number = 3;

    // Create containers
    this.postgres = new Container('postgres', 'library/postgres:9.4', {
        env: {
            'password': 'temppass',
            'port': '5432',
        }
    });

    this.redis = new Container('redis', 'hantaowang/redis', {
       env: {
           'ROLE': 'master',
       },
    });
   
    this.customer = new Container('hotrod-customer', 'hantaowang/hotrod-customer', {
        env: {
            'POSTGRES_USER': 'postgres',
            'POSTGRES_URL': this.postgres.getHostname() + ':5432',
            'POSTGRES_PASS': 'temppass',
        },
    });

    this.driver = new Container('hotrod-driver', 'hantaowang/hotrod-driver', {
        env: {
            'REDIS_URL': this.redis.getHostname() + ':6379',
        },
    });

    this.route = new Container('hotrod-route', 'hantaowang/hotrod-route');

    this.mapper = new Container('hotrod-mapper', 'hantaowang/hotrod-mapper');

    this.api = new Container('hotrod-api', 'hantaowang/hotrod-api', {
        env: {
            'HOTROD_CUSTOMER_HOST': this.customer.getHostname(),
            'HOTROD_DRIVER_HOST': this.driver.getHostname(),
            'HOTROD_ROUTE_HOST': this.route.getHostname(),
        },
    });

    this.frontend = new Container('hotrod-frontend', 'hantaowang/hotrod-frontend', {
        filepathToContent: {
            '/etc/nginx/conf.d/default.conf': fs.readFileSync('nginx-frontend.conf', 'utf-8'),
        },
    });

    this.ingress = new Container('hotrod-ingress', 'library/nginx:1.7.9', {
        filepathToContent: {
            '/etc/nginx/conf.d/default.conf': fs.readFileSync('nginx-ingress.conf', 'utf-8'),
        },
    });

    this.seed = new Container('seed', 'hantaowang/hotrod-seed', {
         env: {
            'POSTGRES_USER': 'postgres',
            'POSTGRES_URL': this.postgres.getHostname() + ':5432',
            'POSTGRES_PASS': 'temppass',
            'REDIS_URL': this.redis.getHostname() + ':6379',
         },
    });

   // Connect services
   allow(this.api, this.customer, 8081);
   allow(this.customer, this.api, 8081);
   allow(this.api, this.driver, 8082);
   allow(this.driver, this.api, 8082);
   allow(this.api, this.route, 8083);
   allow(this.route, this.api, 8083);
   allow(this.driver, this.redis, 6379);
   allow(this.redis, this.driver, 6379);
   allow(this.customer, this.postgres, 5432);
   allow(this.postgres, this.customer, 5432);
   
   allow(this.ingress, publicInternet, 80);
   allow(publicInternet, this.ingress, 80);
   allow(this.ingress, this.api, 8080);
   allow(this.api, this.ingress, 8080);
   allow(this.ingress, this.frontend, 80);
   allow(this.frontend, this.ingress, 80);
   allow(this.ingress, this.mapper, 8084);
   allow(this.mapper, this.ingress, 8084);

   allow(this.mapper, publicInternet, 80);
   allow(this.mapper, publicInternet, 443);
   allow(this.mapper, publicInternet, 53);
   allow(publicInternet, this.mapper, 80);
   allow(publicInternet, this.mapper, 443);
   allow(publicInternet, this.mapper, 53);

   allow(this.seed, this.redis, 6379);
   allow(this.redis, this.seed, 6379);
   allow(this.seed, this.postgres, 5432);
   allow(this.postgres, this.seed, 5432);

   // placements
   this.placements = function placements(machines) {
       assert(machines.length == 7);
       for (i = 0; i < 3; i++) {
           this.route[i].placeOn({diskSize: diskSizes[i]});
           this.mapper[i].placeOn({diskSize: diskSizes[i]});
           this.api[i].placeOn({diskSize: diskSizes[i]});
           this.frontend[i].placeOn({diskSize: diskSizes[i + 3]});
           this.customer[i].placeOn({diskSize: diskSizes[i + 3]});
           this.driver[i].placeOn({diskSize: diskSizes[i + 3]});
       }
       this.ingress.placeOn({diskSize: diskSizes[6]});
       this.redis.placeOn({diskSize: diskSizes[6]});
       this.postgres.placeOn({diskSize: diskSizes[6]});
   }

   //  deploy services
   this.deploy = function deploy(deployment) {
        deployment.deploy(this.postgres);
        deployment.deploy(this.redis);
        deployment.deploy(this.customer);
        deployment.deploy(this.driver);
        deployment.deploy(this.route);
        deployment.deploy(this.frontend);
        deployment.deploy(this.api);
        deployment.deploy(this.ingress);
        deployment.deploy(this.mapper);
        deployment.deploy(this.seed);
    }
}

module.exports = hotrod;
