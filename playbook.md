## Helm

    kubectl apply -f istio-0.8.0/install/kubernetes/helm/helm-service-account.yaml

    helm init --service-account tiller

    If Tiller has already been installed to the cluster, you'll need to `helm
    reset --force` before running the `helm init` command.

## Ingress

    helm install stable/nginx-ingress \
    --namespace hotrod --name nginx \
    -f ingress/values.yaml

## Prometheus

    helm install stable/prometheus \
    --version 6.7.2 \
    --namespace monitoring --name monitoring \
    -f monitoring/values-$STAGE.yaml

## Grafana

    kubectl apply -f monitoring/grafana.yaml \
    --namespace monitoring

## EL(F)K

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

## Redis

### Staging

    helm install stable/redis \
    --set cluster.slaveCount=2 \
    --set password=$REDIS_PASS \
    --namespace hotrod \
    --name hotrod-redis

### Production

    Using Google MemoryStore, set up a redis instance in the same region and zone
    Following the 'Connecting from GKE' instructions to set up iptables in your cluster
    Retrieve DB internal ip and password, and set as variables in appropriate places

## Postgres

### Staging

    helm install stable/postgresql \
    --set postgresUser=$POSTGRES_USER \
    --set postgresPassword=$POSTGRES_PASS \
    --namespace hotrod \
    --name hotrod-postgres

### Production

    Using Google CouldSQL, boot up a PostgreSql DB in the same region and zone
    Create a user hotrod with password and create a database 'customers'
    Set inbound authorization to 0.0.0.0/0 or some other CIDR that accepts connection from GKE
    Retrieve DB external ip and password for user hotrod
    Set ip and password as variables in appropriate places in all hotrod repos

## Runner

    helm install ./gitlab-runner \
    --set runnerRegistrationToken=$RUNNER_REGISTRATION_TOKEN \
    --set runners.namespaceOverwrite=".*" \
    --name gitlab
    Go to Settings->CI/CD->Runners and enable for this project
    Click on the edit and untick the box that locks for this project only, save.

## Istio

    curl -L https://github.com/istio/istio/releases/download/0.8.0/istio-0.8.0-osx.tar.gz | tar xz
    helm install istio-*/install/kubernetes/helm/istio --name istio --namespace istio-system \
        --set sidecarInjectorWebhook.enabled=false \
        --set prometheus.enabled=false

    Note that the Istio sidecars must still be deployed. This is done as part
    of the GitLab pipeline for each service.
