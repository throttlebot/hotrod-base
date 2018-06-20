### Prometheus

    helm install stable/prometheus \
    --namespace monitoring --name monitoring \
    -f monitoring/values.yaml

### Grafana

    kubectl apply -f monitoring/grafana.yaml \
    --namespace monitoring

### EL(F)K

    cd logging
    kubectl create namespace logging
    kubectl create -f es-discovery-svc.yaml -n logging
    kubectl create -f es-svc.yaml -n logging
    kubectl create -f es-master.yaml -n logging
    kubectl rollout status -f es-master.yaml -n logging
    kubectl create -f es-client.yaml -n logging
    kubectl rollout status -f es-client.yaml -n logging
    kubectl create -f es-data.yaml -n logging
    kubectl rollout status -f es-data.yaml -n logging
    kubectl create -f kibana.yaml -n logging
    kubectl create -f kibana-svc.yaml -n logging
    kubectl create -f logstash.yaml -n logging
    kubectl rollout status -f logstash.yaml -n logging
    kubectl create -f filebeat-kubernetes.yaml -n logging
    cd ..

### Redis

#### Staging

    helm install stable/redis \
    --set cluster.slaveCount=2 \
    --set password=$REDIS_PASS \
    --namespace hotrod \
    --name hotrod-redis

#### Production

    Using Google MemoryStore, set up a redis instance in the same region and zone
    Following the 'Connecting from GKE' instructions to set up iptables in your cluster
    Retrieve DB internal ip and password, and set as variables in appropriate places

### Postgres

#### Staging

    helm install stable/postgresql \
    --set postgresUser=$POSTGRES_USER \
    --set postgresPassword=$POSTGRES_PASS \
    --namespace hotrod \
    --name hotrod-postgres

#### Production

    Using Google CouldSQL, boot up a PostgreSql DB in the same region and zone
    Create a user hotrod with password and create a database 'customers'
    Set inbound authorization to 0.0.0.0/0 or some other CIDR that accepts connection from GKE
    Retrieve DB external ip and password for user hotrod
    Set ip and password as variables in appropriate places in all hotrod repos

## Runner

    helm install --repo gitlab-runner \
    --set $RUNNER_REGISTRATION_TOKEN \
    --name gitlab
    Go to Settings->CI/CD->Runners and enable for this project
    Click on the edit and untick the box that locs for this project only, save.