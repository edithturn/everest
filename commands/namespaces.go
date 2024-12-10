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

// Package commands ...
package commands

import (
	"github.com/spf13/cobra"
	"go.uber.org/zap"

	"github.com/percona/everest/commands/namespaces"
)

func newNamespacesCommand(l *zap.SugaredLogger) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "namespaces",
		Long:  "Managed Everest database namespaces",
		Short: "Managed Everest database namespaces",
	}
	cmd.AddCommand(namespaces.NewAddCommand(l))
	cmd.AddCommand(namespaces.NewRemoveCommand(l))
	cmd.AddCommand(namespaces.NewUpdateCommand(l))
	return cmd
}
