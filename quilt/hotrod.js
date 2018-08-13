const { Service, Container, allow, publicInternet } = require('@quilt/quilt');
const haproxy = require('@quilt/haproxy');
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
    }).replicate(this.instance_number);

    this.driver = new Container('hotrod-driver', 'hantaowang/hotrod-driver', {
        env: {
            'REDIS_URL': this.redis.getHostname() + ':6379',
        },
    }).replicate(this.instance_number);

    this.route = new Container('hotrod-route', 'hantaowang/hotrod-route').replicate(this.instance_number);

    this.mapper = new Container('hotrod-mapper', 'hantaowang/hotrod-mapper', {
        env: {
            'BUCKET_ROOT': 'http://s3-us-west-1.amazonaws.com/hotrod-app/graph/',
        },
    }).replicate(this.instance_number);

    this.api = []
    for (i = 0; i < this.instance_number; i++) {
        this.api.push(new Container('hotrod-api', 'hantaowang/hotrod-api', {
            env: {
                'HOTROD_CUSTOMER_HOST': this.customer[i].getHostname(),
                'HOTROD_DRIVER_HOST': this.driver[i].getHostname(),
                'HOTROD_ROUTE_HOST': this.route[i].getHostname(),
            },
        }));
    }

    this.api_haproxy = haproxy.simpleLoadBalancer(this.api);
    this.map_haproxy = haproxy.simpleLoadBalancer(this.mapper);

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

   this.allow_apt_get = function allow_apt_get(services) {
       services.forEach(function(c) {
           allow(c, publicInternet, 80);
           allow(c, publicInternet, 443);
           allow(c, publicInternet, 53);
           allow(publicInternet, c, 80);
           allow(publicInternet, c, 443);
           allow(publicInternet, c, 53);
       });
   }

   // Connect services
   for (i = 0; i < this.instance_number; i++) {
       allow(this.api[i], this.customer[i], 8081);
       allow(this.customer[i], this.api[i], 8081);
       allow(this.api[i], this.driver[i], 8082);
       allow(this.driver[i], this.api[i], 8082);
       allow(this.api[i], this.route[i], 8083);
       allow(this.route[i], this.api[i], 8083);
       
       allow(this.driver[i], this.redis, 6379);
       allow(this.redis, this.driver[i], 6379);
       allow(this.customer[i], this.postgres, 5432);
       allow(this.postgres, this.customer[i], 5432);
   
       allow(this.api[i], this.api_haproxy, 80);
       allow(this.mapper[i], this.map_haproxy, 80);
       allow(this.api_haproxy, this.api[i], 80);
       allow(this.map_haproxy, this.mapper[i], 80); 
  }

   this.allow_apt_get(this.mapper);
   
   allow(this.api_haproxy, this.ingress, haproxy.exposedPort);
   allow(this.ingress, this.api_haproxy, haproxy.exposedPort);

   allow(this.map_haproxy, this.ingress, haproxy.exposedPort);
   allow(this.ingress, this.map_haproxy, haproxy.exposedPort);

   allow(this.ingress, publicInternet, 80);
   allow(publicInternet, this.ingress, 80);
   allow(this.ingress, this.frontend, 80);
   allow(this.frontend, this.ingress, 80);

   allow(this.seed, this.redis, 6379);
   allow(this.redis, this.seed, 6379);
   allow(this.seed, this.postgres, 5432);
   allow(this.postgres, this.seed, 5432);

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
        deployment.deploy(this.api_haproxy);
        deployment.deploy(this.map_haproxy);
    }
}

module.exports = hotrod;
