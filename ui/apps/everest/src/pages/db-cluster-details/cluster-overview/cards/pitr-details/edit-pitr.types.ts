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

import { DbCluster } from 'shared-types/dbCluster.types';
import { z } from 'zod';

export enum PitrEditFields {
  enabled = 'enabled',
  storageLocation = 'storageLocation',
}

export const pitrEditDialogDefaultValues = (
  enabled: boolean,
  storageLocation: string | undefined
) => ({
  [PitrEditFields.enabled]: enabled,
  [PitrEditFields.storageLocation]: { name: storageLocation },
});

export const pitrEditDialogPropsSchema = () =>
  z.object({
    [PitrEditFields.enabled]: z.boolean(),
    [PitrEditFields.storageLocation]: z
      .string()
      .or(
        z.object({
          name: z.string(),
        })
      )
      .nullable(),
  });

export interface PitrEditModalProps {
  open: boolean;
  handleCloseModal: () => void;
  handleSubmitModal: (enabled: boolean, storageLocation: string) => void;
  dbCluster: DbCluster;
}

export type PitrEditModalFormType = z.infer<
  ReturnType<typeof pitrEditDialogPropsSchema>
>;
