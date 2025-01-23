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

// Package accounts holds commands for accounts command.
package accounts

import (
	"os"

	"github.com/spf13/cobra"

	accountscli "github.com/percona/everest/pkg/accounts/cli"
	"github.com/percona/everest/pkg/cli"
	"github.com/percona/everest/pkg/logger"
)

var (
	accountsDeleteCmd = &cobra.Command{
		Use:     "delete [flags]",
		Args:    cobra.NoArgs,
		Example: "everestctl accounts delete --username user1",
		Short:   "Delete an existing Everest user account",
		Long:    "Delete an existing Everest user account",
		PreRun:  accountsDeletePreRun,
		Run:     accountsDeleteRun,
	}
	accountsDeleteCfg      = &accountscli.Config{}
	accountsDeleteUsername string
)

func init() {
	// local command flags
	accountsDeleteCmd.Flags().StringVarP(&accountsDeleteUsername, cli.FlagAccountsUsername, "u", "", "Username of the account")
}

func accountsDeletePreRun(cmd *cobra.Command, _ []string) { //nolint:revive
	// Copy global flags to config
	accountsDeleteCfg.Pretty = !(cmd.Flag(cli.FlagVerbose).Changed || cmd.Flag(cli.FlagJSON).Changed)
	accountsDeleteCfg.KubeconfigPath = cmd.Flag(cli.FlagKubeconfig).Value.String()
}

func accountsDeleteRun(cmd *cobra.Command, _ []string) { //nolint:revive
	cliA, err := accountscli.NewAccounts(*accountsDeleteCfg, logger.GetLogger())
	if err != nil {
		logger.GetLogger().Error(err)
		os.Exit(1)
	}

	if err := cliA.Delete(cmd.Context(), accountsDeleteUsername); err != nil {
		logger.GetLogger().Error(err)
		os.Exit(1)
	}
}

// GetDeleteCmd returns the command to delete account.
func GetDeleteCmd() *cobra.Command {
	return accountsDeleteCmd
}
