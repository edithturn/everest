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

import { NetworkNode as NetworkNodeIcon, OverviewCard } from '@percona/ui-lib';
import OverviewSection from '../overview-section';
import { BackupsDetailsOverviewCardProps } from './card.types';
import OverviewSectionRow from '../overview-section-row';
import { Messages } from '../cluster-overview.messages';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link, useMatch } from 'react-router-dom';
import { DBClusterDetailsTabs } from '../../db-cluster-details.types';
import OverviewSectionText from '../overview-section-text/overview-section-text';
import { getTimeSelectionPreviewMessage } from '../../../database-form/database-preview/database.preview.messages';
import { getFormValuesFromCronExpression } from '../../../../components/time-selection/time-selection.utils';
import { useDbBackups, useUpdateDbClusterPITR } from 'hooks';
import { Table } from '@percona/ui-lib';
import { Backup, BackupStatus } from 'shared-types/backups.types';
import { BACKUP_STATUS_TO_BASE_STATUS } from 'pages/db-cluster-details/backups/backups-list/backups-list.constants';
import StatusField from 'components/status-field';
import { useContext, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { DATE_FORMAT } from 'consts';
import { format } from 'date-fns';
import { DbClusterContext } from 'pages/db-cluster-details/dbCluster.context';
import { DbClusterStatus } from 'shared-types/dbCluster.types';
import { PitrEditModal } from './pitr-details/edit-pitr';

export const BackupsDetails = ({
  dbClusterName,
  namespace,
  schedules,
  pitrEnabled,
  pitrStorageName,
  backup,
  loading,
  showStorage = true,
}: BackupsDetailsOverviewCardProps) => {
  const { canUpdateDb, dbCluster } = useContext(DbClusterContext);
  const restoringOrDeleting = [
    DbClusterStatus.restoring,
    DbClusterStatus.deleting,
  ].includes(dbCluster?.status?.status!);
  const editable = canUpdateDb && !restoringOrDeleting;
  const [openEditModal, setOpenEditModal] = useState(false);
  const routeMatch = useMatch('/databases/:namespace/:dbClusterName/:tabs');
  const { data: backups = [] } = useDbBackups(dbClusterName!, namespace!, {
    refetchInterval: 10 * 1000,
  });
  const { mutate: updatePITR } = useUpdateDbClusterPITR();

  const handleCloseModal = () => {
    setOpenEditModal(false);
  };

  const handleSubmit = (enabled: boolean, backupStorageName: string) => {
    updatePITR({
      clusterName: dbCluster!.metadata?.name,
      namespace: dbCluster!.metadata?.namespace,
      dbCluster: dbCluster!,
      enabled: enabled,
      backupStorageName: backupStorageName,
    });
    handleCloseModal();
  };

  const columns = useMemo<MRT_ColumnDef<Backup>[]>(
    () => [
      {
        accessorKey: 'state',
        header: '',
        maxSize: 20,
        Cell: ({ cell }) => (
          <StatusField
            status={cell.getValue<BackupStatus>()}
            statusMap={BACKUP_STATUS_TO_BASE_STATUS}
          />
        ),
      },
      {
        accessorKey: 'created',
        header: '',
        maxSize: 150,
        Cell: ({ cell }) =>
          cell.getValue<Date>()
            ? format(cell.getValue<Date>(), DATE_FORMAT)
            : '',
      },
      {
        accessorKey: 'completed',
        header: '',
        Cell: ({ cell }) =>
          cell.getValue<Date>()
            ? format(cell.getValue<Date>(), DATE_FORMAT)
            : '',
      },
    ],
    []
  );

  return (
    <OverviewCard
      dataTestId="backups-and-pitr"
      cardHeaderProps={{
        title: Messages.titles.backups,
        avatar: <NetworkNodeIcon />,
        action: (
          <Button
            component={Link}
            size="small"
            to={`/databases/${routeMatch?.params?.namespace}/${routeMatch?.params?.dbClusterName}/${DBClusterDetailsTabs.backups}`}
          >
            {Messages.actions.details}
          </Button>
        ),
      }}
    >
      <Stack gap={3}>
        <OverviewSection
          dataTestId="schedules"
          title={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '350px',
              }}
            >
              <Typography
                color="text.primary"
                variant="sectionHeading"
                sx={{ marginLeft: '60px' }}
              >
                Started
              </Typography>
              <Typography color="text.primary" variant="sectionHeading">
                Finished
              </Typography>
            </Box>
          }
          loading={loading}
        >
          <Table
            muiTopToolbarProps={{ sx: { display: 'none' } }}
            muiTableHeadCellProps={{ sx: { display: 'none' } }}
            initialState={{
              pagination: {
                pageSize: 5,
                pageIndex: 0,
              },
              sorting: [
                {
                  id: 'created',
                  desc: true,
                },
              ],
            }}
            tableName="backupList"
            noDataMessage={Messages.titles.noData}
            data={backups}
            columns={columns}
          />
        </OverviewSection>
        <OverviewSection
          dataTestId="schedules"
          title={Messages.titles.schedules}
          loading={loading}
        >
          {Array.isArray(schedules) &&
          schedules?.length > 0 &&
          backup?.enabled ? (
            schedules?.map((item) => (
              <OverviewSectionText key={`${item.name}-${item.schedule}`}>
                {getTimeSelectionPreviewMessage(
                  getFormValuesFromCronExpression(item.schedule)
                )}
              </OverviewSectionText>
            ))
          ) : (
            <OverviewSectionText>
              {Messages.fields.disabled}
            </OverviewSectionText>
          )}
        </OverviewSection>
        <OverviewSection
          dataTestId="pitr"
          title={Messages.titles.pitr}
          loading={loading}
          actionButtonProps={{
            onClick: () => {
              setOpenEditModal(true);
            },
          }}
          editable={editable}
        >
          {/*// TODO EVEREST-1066 the width of the columns on the layouts in different places is limited by a different number (but not by the content), a discussion with Design is required*/}
          <OverviewSectionRow
            labelProps={{ minWidth: '126px' }}
            label={Messages.fields.status}
            contentString={
              pitrEnabled ? Messages.fields.enabled : Messages.fields.disabled
            }
          />
          {showStorage && (
            <OverviewSectionRow
              labelProps={{ minWidth: '126px' }}
              label={Messages.fields.backupStorages}
              contentString={pitrStorageName}
            />
          )}
          {openEditModal && (
            <PitrEditModal
              dbCluster={dbCluster!}
              open={openEditModal}
              handleCloseModal={handleCloseModal}
              handleSubmitModal={handleSubmit}
            />
          )}
        </OverviewSection>
      </Stack>
    </OverviewCard>
  );
};
