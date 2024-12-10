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

import { Messages } from './db-actions.messages';
import { RestoreDbModal } from 'modals';
import DbStatusDetailsDialog from 'modals/db-status-details-dialog';
import { CustomConfirmDialog } from 'components/custom-confirm-dialog';
import { useDbBackups } from 'hooks';
import { DbEngineType } from '@percona/types';
import { DbActionsModalsProps } from './db-actions-modals.types';

export const DbActionsModals = ({
  dbCluster,
  isNewClusterMode,
  openDetailsDialog,
  handleCloseDetailsDialog,
  openRestoreDialog,
  handleCloseRestoreDialog,
  openDeleteDialog,
  handleCloseDeleteDialog,
  handleConfirmDelete,
  deleteMutation: { isPending: deletingCluster },
}: DbActionsModalsProps) => {
  const disableKeepDataCheckbox =
    dbCluster?.spec.engine.type === DbEngineType.POSTGRESQL;
  const { data: backups = [] } = useDbBackups(
    dbCluster?.metadata.name!,
    dbCluster?.metadata.namespace!,
    {
      enabled: !!dbCluster?.metadata.name,
      refetchInterval: 10 * 1000,
    }
  );
  const hideCheckbox = !backups.length;

  return (
    <>
      {openRestoreDialog && (
        <RestoreDbModal
          dbCluster={dbCluster}
          namespace={dbCluster.metadata.namespace}
          isNewClusterMode={isNewClusterMode}
          isOpen={openRestoreDialog}
          closeModal={handleCloseRestoreDialog}
        />
      )}
      {openDetailsDialog && handleCloseDetailsDialog && (
        <DbStatusDetailsDialog
          isOpen={openDetailsDialog}
          closeModal={handleCloseDetailsDialog}
          dbClusterDetails={dbCluster?.status?.details}
        />
      )}
      {openDeleteDialog && (
        <CustomConfirmDialog
          inputLabel={Messages.deleteModal.databaseName}
          inputPlaceholder={Messages.deleteModal.databaseName}
          isOpen={openDeleteDialog}
          closeModal={handleCloseDeleteDialog}
          headerMessage={Messages.deleteModal.header}
          submitting={deletingCluster}
          selectedId={dbCluster.metadata.name || ''}
          handleConfirm={({ dataCheckbox: keepBackupStorageData }) =>
            handleConfirmDelete(keepBackupStorageData)
          }
          alertMessage={Messages.deleteModal.alertMessage}
          dialogContent={Messages.deleteModal.content(dbCluster.metadata.name)}
          submitMessage={Messages.deleteModal.confirmButtom}
          checkboxMessage={Messages.deleteModal.checkboxMessage}
          disableCheckbox={disableKeepDataCheckbox}
          tooltipText={Messages.deleteModal.disabledCheckboxForPGTooltip}
          hideCheckbox={hideCheckbox}
        />
      )}
    </>
  );
};

export default DbActionsModals;
