logging:
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

monitoring:
    cd monitoring
    kubectl create namespace monitoring
    kubectl create -f prom-config.yaml -n monitoring
    kubectl create -f prom.yaml -n monitoring
    kubectl create -f grafana.yaml -n monitoring
    cd ..
