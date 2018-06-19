### Prometheus

    helm install stable/prometheus \
    --tiller-namespace gitlab-managed-apps \
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

    helm install stable/redis \
    --set cluster.slaveCount=2 \
    --set password=$REDIS_PASS \
    --namespace hotrod \
    --name hotrod-redis

### Postgres

    helm install stable/postgresql \
    --set postgresUser=$POSTGRES_USER
    --set postgresPassword=$POSTGRES_PASS
    --namespace hotrod \
    --name hotrod-postgres

### Istio

    curl -L https://github.com/istio/istio/releases/download/0.8.0/istio-0.8.0-osx.tar.gz | tar xz
    helm install istio-*/install/kubernetes/helm/istio --name istio --namespace istio-system \
        --set sidecarInjectorWebhook.enabled=false \
        --set prometheus.enabled=false

    Note that the Istio sidecars must still be deployed. This is done as part
    of the GitLab pipeline for each service.
