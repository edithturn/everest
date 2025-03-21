// everest
// Copyright (C) 2025 Percona LLC
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

package namespaces

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	olmv1alpha1 "github.com/operator-framework/api/pkg/operators/v1alpha1"
	v1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/utils/strings/slices"

	"github.com/percona/everest/pkg/common"
	"github.com/percona/everest/pkg/kubernetes"
)

// Regexp used to validate RFC1035 compatible names.
var rfc1035Regexp = regexp.MustCompile("^[a-z]([-a-z0-9]{0,61}[a-z0-9])?$")

// ParseNamespaceNames parses a comma-separated namespaces string.
// It returns a list of namespaces.
// Note: namespace names are not validated.
// Use validateNamespaceNames to validate them.
func ParseNamespaceNames(namespaces string) []string {
	result := []string{}
	for _, ns := range strings.Split(namespaces, ",") {
		ns = strings.TrimSpace(ns)
		if ns == "" {
			continue
		}

		if !slices.Contains(result, ns) {
			result = append(result, ns)
		}
	}

	return result
}

// validateNamespaceNames validates a list of namespaces parsed by ParseNamespaceNames.
// It validates the names to be:
// - RFC-1035 compatible
// - not reserved by Everest core
func validateNamespaceNames(nsList []string) error {
	if len(nsList) == 0 {
		return ErrNamespaceListEmpty
	}

	for _, ns := range nsList {
		if ns == common.SystemNamespace ||
			ns == common.MonitoringNamespace ||
			ns == kubernetes.OLMNamespace {
			return ErrNamespaceReserved(ns)
		}

		if err := validateRFC1035(ns); err != nil {
			return err
		}
	}
	return nil
}

// validates names to be RFC-1035 compatible  https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#rfc-1035-label-names
func validateRFC1035(s string) error {
	if !rfc1035Regexp.MatchString(s) {
		return ErrNameNotRFC1035Compatible(s)
	}

	return nil
}

// isManagedByEverest checks if the namespace is managed by Everest.
func isManagedByEverest(ns *v1.Namespace) bool {
	val, ok := ns.GetLabels()[common.KubernetesManagedByLabel]
	return ok && val == common.Everest
}

// Returns: [exists, managedByEverest, error].
func namespaceExists(
	ctx context.Context,
	k kubernetes.KubernetesConnector,
	namespace string,
) (bool, bool, error) {
	ns, err := k.GetNamespace(ctx, namespace)
	if err != nil {
		if k8serrors.IsNotFound(err) {
			return false, false, nil
		}
		return false, false, fmt.Errorf("cannot check if namesapce exists: %w", err)
	}
	return true, isManagedByEverest(ns), nil
}

func ensureNoOperatorsRemoved(
	subscriptions []olmv1alpha1.Subscription,
	installPG, installPXC, installPSMDB bool,
) bool {
	for _, subscription := range subscriptions {
		switch subscription.GetName() {
		case common.PostgreSQLOperatorName:
			if !installPG {
				return false
			}
		case common.MongoDBOperatorName:
			if !installPSMDB {
				return false
			}
		case common.MySQLOperatorName:
			if !installPXC {
				return false
			}
		default:
			continue
		}
	}
	return true
}
