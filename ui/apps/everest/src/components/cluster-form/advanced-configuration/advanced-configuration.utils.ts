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

import { DbType } from '@percona/types';
import { DbCluster, ProxyExposeType } from 'shared-types/dbCluster.types';
import { AdvancedConfigurationFields } from './advanced-configuration.types';
import { AdvancedConfigurationFormType } from './advanced-configuration-schema';
import { isProxy } from 'utils/db';

export const getParamsPlaceholderFromDbType = (dbType: DbType) => {
  let dynamicText = '';

  switch (dbType) {
    case DbType.Mongo:
      dynamicText = 'operationProfiling:\nmode: slowOp\nslowOpThresholdMs: 200';
      break;
    case DbType.Mysql:
      dynamicText =
        '[mysqld]\nkey_buffer_size=16M\nmax_allowed_packet=128M\nmax_connections=250';
      break;
    case DbType.Postresql:
    default:
      dynamicText =
        'log_connections = yes\nsearch_path = \'"$user", public\'\nshared_buffers = 128MB';
      break;
  }

  return dynamicText;
};

export const advancedConfigurationModalDefaultValues = (
  dbCluster: DbCluster
): AdvancedConfigurationFormType => {
  const sourceRangesSource = isProxy(dbCluster?.spec?.proxy)
    ? dbCluster?.spec?.proxy?.expose.ipSourceRanges
    : dbCluster?.spec?.proxy.ipSourceRanges;

  return {
    [AdvancedConfigurationFields.storageClass]:
      dbCluster?.spec?.engine?.storage?.class || null,
    [AdvancedConfigurationFields.externalAccess]: isProxy(
      dbCluster?.spec?.proxy
    )
      ? dbCluster?.spec?.proxy?.expose?.type === ProxyExposeType.external
      : dbCluster?.spec?.proxy.type === ProxyExposeType.external,
    [AdvancedConfigurationFields.engineParametersEnabled]:
      !!dbCluster?.spec?.engine?.config,
    [AdvancedConfigurationFields.engineParameters]:
      dbCluster?.spec?.engine?.config,
    [AdvancedConfigurationFields.sourceRanges]: sourceRangesSource
      ? sourceRangesSource.map((sourceRange) => ({ sourceRange }))
      : [{ sourceRange: '' }],
  };
};
