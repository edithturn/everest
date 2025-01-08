package server

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/percona/everest/api"
	"github.com/percona/everest/pkg/version"
)

// VersionInfo returns the current version information.
func (e *EverestServer) VersionInfo(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, &api.Version{
		ProjectName: version.ProjectName,
		Version:     version.Version,
		FullCommit:  version.FullCommit,
	})
}
