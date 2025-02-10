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

// Package common holds common constants used across Everest.
package common

import everestv1alpha1 "github.com/percona/everest-operator/api/v1alpha1"

const (
	// Everest ...
	Everest = "everest"

	// PXCProductName holds the name of the product.
	PXCProductName = "MySQL"
	// PXCOperatorName holds operator name in k8s.
	PXCOperatorName = "percona-xtradb-cluster-operator"

	// PSMDBProductName holds the name of the product.
	PSMDBProductName = "MongoDB"
	// PSMDBOperatorName holds operator name in k8s.
	PSMDBOperatorName = "percona-server-mongodb-operator"

	// PGProductName holds the name of the product.
	PGProductName = "PostgreSQL"
	// PGOperatorName holds operator name in k8s.
	PGOperatorName = "percona-postgresql-operator"

	// DefaultDBNamespaceName is the name of the default DB namespace during installation.
	DefaultDBNamespaceName = "everest"
	// SystemNamespace is the namespace where everest is installed.
	SystemNamespace = "everest-system"
	// MonitoringNamespace is the namespace where monitoring configs are created.
	MonitoringNamespace = "everest-monitoring"
	// PerconaEverestDeploymentName stores the name of everest API Server deployment.
	PerconaEverestDeploymentName = "everest-server"
	// PerconaEverestDeploymentNameLegacy stores the legacy name (> 1.4.0) of everest API Server deployment.
	// This is kept only for backward compatibility.
	PerconaEverestDeploymentNameLegacy = "percona-everest"
	// PerconaEverestCatalogName is the name of the Everest catalog source.
	PerconaEverestCatalogName = "everest-catalog"
	// PerconaEverestOperatorDeploymentName stores the name of everest operator deployment.
	PerconaEverestOperatorDeploymentName = "everest-operator"
	// EverestContainerNameInDeployment is the name of the Everest container in the deployment.
	EverestContainerNameInDeployment = "everest"
	// VictoriaMetricsOperatorDeploymentName stores the name of VictoriaMetrics operator deployment.
	VictoriaMetricsOperatorDeploymentName = "vm-operator"
	// KubeStateMetricsDeploymentName stores the name of kube-state-metrics deployment.
	KubeStateMetricsDeploymentName = "kube-state-metrics"

	// EverestOperatorName holds the name for Everest operator.
	EverestOperatorName = "everest-operator"

	// EverestAccountsSecretName is the name of the secret that holds accounts.
	EverestAccountsSecretName = "everest-accounts"
	// EverestJWTSecretName is the name of the secret that holds JWT secret.
	EverestJWTSecretName = "everest-jwt"
	// EverestJWTPrivateKeyFile is the path to the JWT private key.
	EverestJWTPrivateKeyFile = "/etc/jwt/id_rsa"
	// EverestJWTPublicKeyFile is the path to the JWT public key.
	EverestJWTPublicKeyFile = "/etc/jwt/id_rsa.pub"

	// EverestRBACRolePrefix is the prefix for roles.
	EverestRBACRolePrefix = "role:"
	// EverestAdminUser is the name of the admin user.
	EverestAdminUser = "admin"
	// EverestAdminRole is the name of the admin role.
	EverestAdminRole = EverestRBACRolePrefix + "admin"

	// EverestSettingsConfigMapName is the name of the Everest settings ConfigMap.
	EverestSettingsConfigMapName = "everest-settings"
	// EverestRBACConfigMapName is the name of the Everest RBAC ConfigMap.
	EverestRBACConfigMapName = "everest-rbac"
	// KubernetesManagedByLabel is the label used to identify resources managed by Everest.
	KubernetesManagedByLabel = "app.kubernetes.io/managed-by"
	// ForegroundDeletionFinalizer is the finalizer used to delete resources in foreground.
	ForegroundDeletionFinalizer = "foregroundDeletion"
	// UserCtxKey is the key used to store the user in the context.
	UserCtxKey = "user"

	// EverestAPIExtnResourceName is the name of the Everest API extension header
	// that holds the name of the resource being served by an API endpoint.
	EverestAPIExtnResourceName = "x-everest-resource-name"
)

// OperatorTypeToName maps the engine type to the operator name.
//
//nolint:gochecknoglobals
var OperatorTypeToName = map[everestv1alpha1.EngineType]string{
	everestv1alpha1.DatabaseEnginePXC:        PXCOperatorName,
	everestv1alpha1.DatabaseEnginePSMDB:      PSMDBOperatorName,
	everestv1alpha1.DatabaseEnginePostgresql: PGOperatorName,
}

// InitialPasswordWarningMessage is the message that is shown to the user after the installation/upgrade,
// regarding insecure admin password.
const InitialPasswordWarningMessage = "Run the following command to get the initial admin password:\n\n" +
	"\teverestctl accounts initial-admin-password\n\n" +
	"NOTE: The initial password is stored in plain text. For security, change it immediately using the following command:\n\n" +
	"\teverestctl accounts set-password --username admin"
