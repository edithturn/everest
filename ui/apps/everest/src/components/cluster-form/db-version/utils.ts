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

import { gt, coerce } from 'semver';
import { DbEngine, DbEngineType } from 'shared-types/dbEngines.types';

export const filterAvailableDbVersionsForDbEngineEdition = (
  dbEngine: DbEngine,
  currentVersion: string
) => {
  let versions = dbEngine.availableVersions.engine || [];
  const currentSemverVersion = coerce(currentVersion);
  const dbType = dbEngine.type;

  if (!currentSemverVersion) {
    return versions;
  }

  const currentMajor = currentSemverVersion.major;

  // Filter out downgrades
  versions = versions.filter(({ version }) => {
    const semverVersion = coerce(version);
    return semverVersion ? gt(semverVersion, currentSemverVersion) : true;
  });

  // If the engine is PXC or PG, major version upgrades are also ruled out
  if ([DbEngineType.PXC, DbEngineType.POSTGRESQL].includes(dbType)) {
    versions = versions.filter(({ version }) => {
      const semverVersion = coerce(version);
      return semverVersion ? semverVersion.major === currentMajor : true;
    });
  }

  // Rule out skipping major versions
  versions = versions.filter(({ version }) => {
    const semverVersion = coerce(version);
    return semverVersion ? semverVersion.major - currentMajor <= 1 : true;
  });

  return versions;
};
