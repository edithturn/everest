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

import { expect, test } from '@playwright/test';
import { Messages } from '../../../src/modals/restore-db-modal/restore-db-modal.messages';
import { createDbClusterFn, deleteDbClusterFn } from '@e2e/utils/db-cluster';
import {
  findDbAndClickActions,
  findDbAndClickRow,
} from '@e2e/utils/db-clusters-list';
import { getBucketNamespacesMap } from '@e2e/constants';

const dbClusterName = 'restore-to-new-cluster';

test.describe('DB Cluster Restore to the new cluster', () => {
  test.beforeAll(async ({ request }) => {
    await createDbClusterFn(request, {
      dbName: dbClusterName,
      dbType: 'mysql',
      dbVersion: '8.0.36-28.1',
      numberOfNodes: '1',
      backup: {
        enabled: true,
        schedules: [
          {
            backupStorageName: getBucketNamespacesMap()[0][0],
            enabled: true,
            name: 'backup-1',
            schedule: '0 * * * *',
          },
        ],
      },
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/databases');
  });

  test.afterAll(async ({ request }) => {
    await deleteDbClusterFn(request, dbClusterName);
  });
  test('DB cluster list restore action', async ({ page }) => {
    await findDbAndClickActions(page, dbClusterName, 'Create DB from a backup');

    await expect(
      page
        .getByTestId('select-backup-name-button')
        .getByText(Messages.selectBackup)
    ).toBeVisible();
  });

  test('DB cluster detail restore action', async ({ page }) => {
    await page.route(
      '/v1/namespaces/**/database-clusters/**/backups',
      async (route) => {
        await route.fulfill({
          json: {
            items: [
              {
                metadata: {
                  name: 'backup-1',
                },
                spec: {
                  dbClusterName,
                  backupStorageName: getBucketNamespacesMap()[0][0],
                },
                status: {
                  state: 'Succeeded',
                  created: '2024-12-20T11:57:41Z',
                  completed: '2024-12-20T11:58:07Z',
                },
              },
            ],
          },
        });
      }
    );
    await findDbAndClickRow(page, dbClusterName);
    const actionButton = page.getByTestId('actions-button');
    await actionButton.click();

    const restoreButton = page.getByTestId(
      `${dbClusterName}-create-new-db-from-backup`
    );
    await restoreButton.click();

    await expect(
      page
        .getByTestId('select-backup-name-button')
        .getByText(Messages.selectBackup)
    ).toBeVisible();
    await page.getByTestId('select-backup-name-button').click();
    await page.getByText('backup-1').click();
    await page.getByText('Create', { exact: true }).click();
    await expect(
      page.getByText('Basic information', { exact: true })
    ).toBeVisible();
    await expect(page.getByTestId('select-input-db-version')).toBeDisabled();
    await expect(page.getByTestId('select-input-db-version')).toHaveValue(
      '8.0.36-28.1'
    );
  });
});
