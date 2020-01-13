#! /bin/bash

kubectl apply -f helm-rbac.yaml
helm init --service-account tiller

sleep 10s

helm install stable/nginx-ingress \
--namespace hotrod --name nginx

helm install stable/redis \
--set cluster.enabled=false \
--set password=keldakelda \
--namespace hotrod \
--name redis

helm install stable/postgresql \
--set postgresUser=hotrod \
--set postgresPassword=keldakelda \
--namespace hotrod \
--name postgres \
--version 0.15.0

cd ../hotrod-customer
kubectl apply -f manifests/configs-staging.yaml
kubectl apply -f manifests/hotrod.yaml

cd ../hotrod-driver
kubectl apply -f manifests/configs-staging.yaml
kubectl apply -f manifests/hotrod.yaml

cd ../hotrod-base

kubectl apply -f seed.yaml

cd ../hotrod-mapper
kubectl apply -f manifests/hotrod.yaml

cd ../hotrod-route
kubectl apply -f manifests/hotrod.yaml

cd ../hotrod-frontend

kubectl apply -f manifests/configs-nginx.yaml
kubectl apply -f manifests/frontend-ingress.yaml
kubectl apply -f manifests/frontend.yaml
kubectl apply -f manifests/nginx.yaml
kubectl apply -f haproxy/api.yaml
kubectl apply -f haproxy/mapper.yaml
