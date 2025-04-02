import { createContext } from 'react';
import { ScheduleFormDialogContextType } from './schedule-form-dialog-context.types';
import { DbEngineType } from '@percona/types';
import { WizardMode } from 'shared-types/wizard.types';

export const ScheduleFormDialogContext =
  createContext<ScheduleFormDialogContextType>({
    openScheduleModal: false,
    setOpenScheduleModal: () => {},
    handleClose: () => {},
    mode: WizardMode.New,
    externalContext: 'db-wizard-new',
    setMode: () => {},
    selectedScheduleName: '',
    setSelectedScheduleName: () => {},
    isPending: false,
    handleSubmit: () => {},
    dbClusterInfo: {
      dbClusterName: '',
      namespace: '',
      schedules: [],
      defaultSchedules: [],
      activeStorage: '',
      dbEngine: '' as DbEngineType,
    },
  });
