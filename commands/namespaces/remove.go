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

// Package namespaces provides the namespaces CLI command.
package namespaces

import (
	"errors"
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/percona/everest/pkg/cli"
	"github.com/percona/everest/pkg/cli/namespaces"
	"github.com/percona/everest/pkg/logger"
	"github.com/percona/everest/pkg/output"
)

const forceUninstallHint = "HINT: use --force to remove the namespace and all its resources"

var (
	namespacesRemoveCmd = &cobra.Command{
		Use:     "remove <namespaces> [flags]",
		Args:    cobra.ExactArgs(1),
		Long:    "Remove an existing namespace",
		Short:   "Remove an existing namespace",
		Example: `everestctl namespaces remove ns-1,ns-2 --keep-namespace`,
		PreRun:  namespacesRemovePreRun,
		Run:     namespacesRemoveRun,
	}
	namespacesRemoveCfg = &namespaces.NamespaceRemoveConfig{}
)

func init() {
	// local command flags
	namespacesRemoveCmd.Flags().BoolVar(&namespacesRemoveCfg.KeepNamespace, cli.FlagKeepNamespace, false, "If set, preserves the Kubernetes namespace but removes all resources managed by Everest")
	namespacesRemoveCmd.Flags().BoolVar(&namespacesRemoveCfg.Force, cli.FlagNamespaceForce, false, "If set, forcefully deletes database clusters in the namespace (if any)")
}

func namespacesRemovePreRun(cmd *cobra.Command, args []string) { //nolint:revive
	namespacesRemoveCfg.Namespaces = args[0]

	// Copy global flags to config
	namespacesRemoveCfg.Pretty = !(cmd.Flag(cli.FlagVerbose).Changed || cmd.Flag(cli.FlagJSON).Changed)
	namespacesRemoveCfg.KubeconfigPath = cmd.Flag(cli.FlagKubeconfig).Value.String()
}

func namespacesRemoveRun(cmd *cobra.Command, _ []string) {
	op, err := namespaces.NewNamespaceRemove(*namespacesRemoveCfg, logger.GetLogger())
	if err != nil {
		logger.GetLogger().Error(err)
		os.Exit(1)
	}

	if err := op.Run(cmd.Context()); err != nil {
		if errors.Is(err, namespaces.ErrNamespaceNotEmpty) {
			err = fmt.Errorf("%w. %s", err, forceUninstallHint)
		}
		output.PrintError(err, logger.GetLogger(), namespacesRemoveCfg.Pretty)
		os.Exit(1)
	}
}

// GetNamespacesRemoveCmd returns the command to remove a namespaces.
func GetNamespacesRemoveCmd() *cobra.Command {
	return namespacesRemoveCmd
}
