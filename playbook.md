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
