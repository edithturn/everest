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

import { Messages } from '../../cluster-overview.messages';
import OverviewSection from '../../overview-section';
import { ConnectionDetailsOverviewCardProps } from '../card.types';
import OverviewSectionRow from '../../overview-section-row';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { CopyToClipboardButton } from '@percona/ui-lib';
import { HiddenPasswordToggle } from 'components/hidden-row';
import { useContext, useState } from 'react';
import { DbClusterContext } from 'pages/db-cluster-details/dbCluster.context';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { DbType } from '@percona/types';

export const ConnectionDetails = ({
  loading,
  hostname = '',
  username,
  password,
  connectionUrl,
  port,
  type,
}: ConnectionDetailsOverviewCardProps) => {
  const { canReadCredentials } = useContext(DbClusterContext);
  const [showUrl, setShowUrl] = useState(false);

  return (
    <OverviewSection
      title={Messages.titles.connectionDetails}
      loading={loading}
      dataTestId="connection-details"
    >
      <OverviewSectionRow
        label={Messages.fields.host}
        content={hostname.split(',').map((host) => (
          <Box key={host} sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body2">{host}</Typography>
            <CopyToClipboardButton
              buttonProps={{
                color: 'primary',
                size: 'small',
                sx: { mt: -0.5 },
              }}
              textToCopy={host}
            />
          </Box>
        ))}
      />
      <OverviewSectionRow
        label={Messages.fields.port}
        contentString={`${port}`}
      />
      {canReadCredentials && (
        <>
          <OverviewSectionRow
            label={Messages.fields.username}
            contentString={username}
          />
          <OverviewSectionRow
            label={Messages.fields.password}
            content={<HiddenPasswordToggle showCopy value={password} />}
          />
        </>
      )}

      {type !== DbType.Mysql && (
        <TextField
          label={Messages.fields.connectionUrl}
          value={connectionUrl}
          size="small"
          sx={{ maxHeight: '50px', marginTop: '20px', width: '100%' }}
          type={showUrl ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <>
                <IconButton onClick={() => setShowUrl(!showUrl)}>
                  {showUrl ? (
                    <VisibilityOutlinedIcon />
                  ) : (
                    <VisibilityOffOutlinedIcon />
                  )}
                </IconButton>
                <CopyToClipboardButton
                  buttonProps={{
                    sx: { mt: -0.5 },
                    size: 'small',
                  }}
                  textToCopy={connectionUrl}
                />
              </>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />
      )}
    </OverviewSection>
  );
};
