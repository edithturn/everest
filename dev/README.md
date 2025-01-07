# Setting up a development environment

This directory holds the configuration files for creating a development
environment for everest.

[tilt.dev](https://docs.tilt.dev/install.html) builds and deploys all
components to a local kubernetes cluster and also watches for changes in each
of the components' repo in order to trigger a rebuild/redeploy of the affected
components.

Build and runtime logs can be easily accessed using tilt's web UI.

## Prerequisites

1. Install [k3d](https://k3d.io)

2. Install [tilt.dev](https://docs.tilt.dev/install.html)
NOTE: for MacOS tilt needs to have installed and runing `docker-desktop` tool. This is not required and can be skiped since we use `k3d` instead.
 
3. Clone [everest-operator](https://github.com/percona/everest-operator).

4. Clone [percona-helm-charts](https://github.com/percona/percona-helm-charts).

## Set up the environment

### 1. Set up k8s & registry   
#### Option A: Local  
```sh
k3d cluster create everest-dev --registry-create k3d-registry
```  
#### Option B: Remote (GKE)  
1. Setup your default gcloud project, e.g.  
```sh
export CLOUDSDK_CORE_PROJECT=percona-everest
```  
2. Create GKE cluster  
```sh
gcloud container clusters create <NAME> --cluster-version 1.27 --preemptible --machine-type n1-standard-4  --num-nodes=3 --zone=europe-west1-c --labels delete-cluster-after-hours=12 --no-enable-autoupgrade
```  
3. Create Artifacts registry accodring to [instructions](https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images#create)  
4. Configure access  
```sh
gcloud auth configure-docker <REGISTRY_REGION>-docker.pkg.dev
```
5. Uncomment and edit `allow_k8s_contexts` and `default_registry` in the Tiltfile

⚠️ To avoid extra costs do not forget to:
- Destroy external cluster when not used
- Cleanup the registry periodically since tilt pushes a new image each time something is changed in the project. 


### 2. Run tilt
1. Set the following environment variables:
```sh
export EVEREST_OPERATOR_DIR=</path/to/everest-operator>
export EVEREST_CHART_DIR=</path/to/percona-helm-charts>/charts/everest
```

2. (Optional) If you want to test a specific version of a given DB operator you can set the following environment variables
```sh
export PXC_OPERATOR_VERSION=1.13.0
export PSMDB_OPERATOR_VERSION=1.15.0
export PG_OPERATOR_VERSION=2.3.1
```

3. Run tilt
```sh
tilt up
```

The everest UI/API will be available at http://localhost:8080.

## Tear down the environment

1. Tear down tilt
```sh
tilt down
```

2. Tear down local k8s cluster
```sh
k3d cluster delete everest-dev
```

## Notes for frontend development

Rebuilding the frontend takes ~30s which makes this strategy not very efficient
for frontend development. Therefore, we recommend frontend developers to run
tilt as described in [Set up the environment](#set-up-the-environment) section
but then run a local dev instance of the frontend by running `make dev` from
the frontend repo. This dev instance will be available at http://localhost:3000
while still connecting to the everest API server running inside k8s.
