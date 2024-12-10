import { DbType } from '@percona/types';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { ResourcesForm, resourcesFormSchema } from 'components/cluster-form';
import { FormDialog } from 'components/form-dialog';
type Props = {
  handleCloseModal: () => void;
  dbType: DbType;
  shardingEnabled: boolean;
  onSubmit: SubmitHandler<z.infer<ReturnType<typeof resourcesFormSchema>>>;
  defaultValues: z.infer<ReturnType<typeof resourcesFormSchema>>;
};

const ResourcesEditModal = ({
  handleCloseModal,
  dbType,
  shardingEnabled,
  onSubmit,
  defaultValues,
}: Props) => {
  return (
    <FormDialog
      dataTestId="edit-resources"
      size="XXXL"
      isOpen
      closeModal={handleCloseModal}
      headerMessage="Edit Topology"
      submitMessage="Save"
      schema={resourcesFormSchema(defaultValues, false)}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
    >
      <ResourcesForm
        dbType={dbType}
        pairProxiesWithNodes={false}
        showSharding={dbType === DbType.Mongo}
        disableDiskInput
        allowDiskInputUpdate={false}
        hideProxies={dbType === DbType.Mongo && !shardingEnabled}
      />
    </FormDialog>
  );
};

export default ResourcesEditModal;
