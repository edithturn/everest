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

// Package oidc provides OIDC settings CLI commands.
package oidc

import (
	"os"
	"strings"

	"github.com/spf13/cobra"

	"github.com/percona/everest/pkg/cli"
	"github.com/percona/everest/pkg/common"
	"github.com/percona/everest/pkg/logger"
	"github.com/percona/everest/pkg/oidc"
	"github.com/percona/everest/pkg/output"
)

var (
	settingsOIDCConfigureCmd = &cobra.Command{
		Use:     "configure [flags]",
		Args:    cobra.NoArgs,
		Long:    "Configure OIDC settings",
		Short:   "Configure OIDC settings",
		Example: `everestctl settings oidc configure --issuer-url https://example.com --client-id 123456 --scopes openid,profile,email,groups`,
		PreRun:  settingsOIDCConfigurePreRun,
		Run:     settingsOIDCConfigureRun,
	}
	settingsOIDCConfigureCfg = &oidc.Config{}
)

func init() {
	// local command flags
	settingsOIDCConfigureCmd.Flags().StringVar(&settingsOIDCConfigureCfg.IssuerURL, cli.FlagOIDCIssuerURL, "", "OIDC issuer url")
	settingsOIDCConfigureCmd.Flags().StringVar(&settingsOIDCConfigureCfg.ClientID, cli.FlagOIDCClientID, "", "OIDC application client ID")
	settingsOIDCConfigureCmd.Flags().StringVar(&settingsOIDCConfigureCfg.Scopes, cli.FlagOIDCScopes, strings.Join(common.DefaultOIDCScopes, ","), "Comma-separated list of scopes")
}

func settingsOIDCConfigurePreRun(cmd *cobra.Command, _ []string) { //nolint:revive
	// Copy global flags to config
	settingsOIDCConfigureCfg.Pretty = !(cmd.Flag(cli.FlagVerbose).Changed || cmd.Flag(cli.FlagJSON).Changed)
	settingsOIDCConfigureCfg.KubeconfigPath = cmd.Flag(cli.FlagKubeconfig).Value.String()
}

func settingsOIDCConfigureRun(cmd *cobra.Command, _ []string) {
	op, err := oidc.NewOIDC(*settingsOIDCConfigureCfg, logger.GetLogger())
	if err != nil {
		logger.GetLogger().Error(err)
		os.Exit(1)
	}

	if err := op.Run(cmd.Context()); err != nil {
		output.PrintError(err, logger.GetLogger(), settingsOIDCConfigureCfg.Pretty)
		os.Exit(1)
	}
}

// GetSettingsOIDCConfigureCmd returns the command to configure OIDC settings.
func GetSettingsOIDCConfigureCmd() *cobra.Command {
	return settingsOIDCConfigureCmd
}
