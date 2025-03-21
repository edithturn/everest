#!/usr/bin/env bash

# deploy VS and get it's internal IP
SERVICE_IP=$(./vs.sh)

kubectl port-forward svc/percona-version-service 8081:80 &

# sleep for 2 seconds to make sure the port-forward is ready
sleep 2

os=$(uname -s | tr '[:upper:]' '[:lower:]')
arch=$(uname -m | tr '[:upper:]' '[:lower:]')

if [[ ($os == "linux" || $os == "darwin") && $arch == "x86_64" ]]
then
	arch="amd64"
elif [[ $os == "linux" && $arch == "aarch64" ]]
then
	arch="arm64"
fi

# run everest installation with everest CLI
"./everestctl-$os-$arch" install --chart-dir "helm-chart" --version "$(cat version.txt)" --version-metadata-url http://localhost:8081  --operator.mysql=true --operator.mongodb=true --operator.postgresql=true --skip-wizard --namespaces everest -v --helm.set "versionMetadataURL=http://$SERVICE_IP"
