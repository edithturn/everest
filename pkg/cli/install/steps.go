// everest
// Copyright (C) 2023 Percona LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package install

import (
	"context"
	"fmt"

	"github.com/AlekSi/pointer"
	"k8s.io/apimachinery/pkg/util/wait"

	"github.com/percona/everest/pkg/cli/steps"
	"github.com/percona/everest/pkg/common"
	"github.com/percona/everest/pkg/kubernetes"
)

func (o *Install) newStepInstallEverestHelmChart() steps.Step {
	return steps.Step{
		Desc: "Installing Everest Helm chart",
		F: func(ctx context.Context) error {
			return o.installEverestHelmChart(ctx)
		},
	}
}

func (o *Install) newStepEnsureEverestOperator() steps.Step {
	return steps.Step{
		Desc: "Ensuring Everest operator deployment is ready",
		F: func(ctx context.Context) error {
			return o.waitForDeployment(ctx, common.PerconaEverestOperatorDeploymentName, common.SystemNamespace)
		},
	}
}

func (o *Install) newStepEnsureEverestAPI() steps.Step {
	return steps.Step{
		Desc: "Ensuring Everest API deployment is ready",
		F: func(ctx context.Context) error {
			return o.waitForDeployment(ctx, common.PerconaEverestDeploymentName, common.SystemNamespace)
		},
	}
}

func (o *Install) newStepEnsureEverestOLM() steps.Step {
	return steps.Step{
		Desc: "Ensuring OLM components are ready",
		F: func(ctx context.Context) error {
			depls, err := o.kubeClient.ListDeployments(ctx, kubernetes.OLMNamespace)
			if err != nil {
				return err
			}
			for _, depl := range depls.Items {
				if err := o.waitForDeployment(ctx, depl.GetName(), depl.GetNamespace()); err != nil {
					return err
				}
			}
			return nil
		},
	}
}

func (o *Install) newStepEnsureEverestMonitoring() steps.Step {
	return steps.Step{
		Desc: "Ensuring monitoring stack is ready",
		F: func(ctx context.Context) error {
			if err := o.waitForDeployment(ctx, common.VictoriaMetricsOperatorDeploymentName, common.MonitoringNamespace); err != nil {
				return err
			}
			return o.waitForDeployment(ctx, common.KubeStateMetricsDeploymentName, common.MonitoringNamespace)
		},
	}
}

func (o *Install) newStepEnsureCatalogSource() steps.Step {
	return steps.Step{
		Desc: "Ensuring Everest CatalogSource is ready",
		F: func(ctx context.Context) error {
			manifests, err := o.helmInstaller.RenderTemplates(ctx)
			if err != nil {
				return fmt.Errorf("could not get Everest CatalogSource namespace: %w", err)
			}
			catalogNs, err := manifests.GetEverestCatalogNamespace()
			if err != nil {
				return fmt.Errorf("could not get Everest CatalogSource namespace: %w", err)
			}
			return wait.PollUntilContextTimeout(ctx, pollInterval, pollTimeout, false, func(ctx context.Context) (bool, error) {
				cs, err := o.kubeClient.GetCatalogSource(ctx, common.PerconaEverestCatalogName, catalogNs)
				if err != nil {
					return false, fmt.Errorf("cannot get CatalogSource: %w", err)
				}
				return pointer.Get(cs.Status.GRPCConnectionState).LastObservedState == "READY", nil
			})
		},
	}
}

func (o *Install) waitForDeployment(ctx context.Context, name, namespace string) error {
	o.l.Infof("Waiting for Deployment '%s' in namespace '%s'", name, namespace)
	if err := o.kubeClient.WaitForRollout(ctx, name, namespace); err != nil {
		return err
	}
	o.l.Infof("Deployment '%s' in namespace '%s' is ready", name, namespace)
	return nil
}

func (o *Install) installEverestHelmChart(ctx context.Context) error {
	o.l.Info("Installing Everest Helm chart")
	if err := o.helmInstaller.Install(ctx); err != nil {
		return fmt.Errorf("could not install Helm chart: %w", err)
	}
	return nil
}
