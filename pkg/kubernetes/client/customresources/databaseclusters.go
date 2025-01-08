// Package customresources ...
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
package customresources

import (
	"context"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"

	everestv1alpha1 "github.com/percona/everest-operator/api/v1alpha1"
)

const (
	dbClustersAPIKind = "databaseclusters"
)

// DBClusters returns a db cluster client.
func (c *Client) DBClusters(namespace string) DBClusterInterface { //nolint:ireturn
	return &dbClusterClient{
		restClient: c.restClient,
		namespace:  namespace,
	}
}

type dbClusterClient struct {
	restClient rest.Interface
	namespace  string
}

// DBClusterInterface supports list, get and watch methods.
type DBClusterInterface interface {
	List(ctx context.Context, opts metav1.ListOptions) (*everestv1alpha1.DatabaseClusterList, error)
	Get(ctx context.Context, name string, options metav1.GetOptions) (*everestv1alpha1.DatabaseCluster, error)
	Watch(ctx context.Context, opts metav1.ListOptions) (watch.Interface, error)
	Update(ctx context.Context, cluster *everestv1alpha1.DatabaseCluster, opts metav1.UpdateOptions) (*everestv1alpha1.DatabaseCluster, error)
	Create(ctx context.Context, cluster *everestv1alpha1.DatabaseCluster, opts metav1.CreateOptions) (*everestv1alpha1.DatabaseCluster, error)
	Delete(ctx context.Context, name string, opts metav1.DeleteOptions) error
}

// Create creates a resource.
func (c *dbClusterClient) Create(
	ctx context.Context,
	cluster *everestv1alpha1.DatabaseCluster,
	opts metav1.CreateOptions,
) (*everestv1alpha1.DatabaseCluster, error) {
	result := &everestv1alpha1.DatabaseCluster{}
	err := c.restClient.
		Post().
		Namespace(c.namespace).
		Resource(dbClustersAPIKind).
		VersionedParams(&opts, scheme.ParameterCodec).
		Body(cluster).
		Do(ctx).
		Into(result)
	return result, err
}

// Update creates a resource.
func (c *dbClusterClient) Update(
	ctx context.Context,
	cluster *everestv1alpha1.DatabaseCluster,
	opts metav1.UpdateOptions,
) (*everestv1alpha1.DatabaseCluster, error) {
	result := &everestv1alpha1.DatabaseCluster{}
	err := c.restClient.
		Put().
		Namespace(c.namespace).Name(cluster.GetName()).
		Resource(dbClustersAPIKind).
		VersionedParams(&opts, scheme.ParameterCodec).
		Body(cluster).
		Do(ctx).
		Into(result)
	return result, err
}

// Delete creates a resource.
func (c *dbClusterClient) Delete(
	ctx context.Context,
	name string,
	opts metav1.DeleteOptions,
) error {
	return c.restClient.
		Delete().
		Namespace(c.namespace).
		Resource(dbClustersAPIKind).
		Name(name).
		VersionedParams(&opts, scheme.ParameterCodec).
		Do(ctx).
		Error()
}

// List lists database clusters based on opts.
func (c *dbClusterClient) List(ctx context.Context, opts metav1.ListOptions) (*everestv1alpha1.DatabaseClusterList, error) {
	result := &everestv1alpha1.DatabaseClusterList{}
	err := c.restClient.
		Get().
		Namespace(c.namespace).
		Resource(dbClustersAPIKind).
		VersionedParams(&opts, scheme.ParameterCodec).
		Do(ctx).
		Into(result)
	return result, err
}

// Get retrieves database cluster based on opts.
func (c *dbClusterClient) Get(
	ctx context.Context,
	name string,
	opts metav1.GetOptions,
) (*everestv1alpha1.DatabaseCluster, error) {
	result := &everestv1alpha1.DatabaseCluster{}
	err := c.restClient.
		Get().
		Namespace(c.namespace).
		Resource(dbClustersAPIKind).
		VersionedParams(&opts, scheme.ParameterCodec).
		Name(name).
		Do(ctx).
		Into(result)
	return result, err
}

// Watch starts a watch based on opts.
func (c *dbClusterClient) Watch( //nolint:ireturn
	ctx context.Context,
	opts metav1.ListOptions,
) (watch.Interface, error) {
	opts.Watch = true
	return c.restClient.
		Get().
		Namespace(c.namespace).
		Resource(dbClustersAPIKind).
		VersionedParams(&opts, scheme.ParameterCodec).
		Watch(ctx)
}
