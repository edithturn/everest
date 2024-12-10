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
import {
  deleteDbCluster,
  gotoDbClusterBackups,
  gotoDbClusterRestores,
} from '@e2e/utils/db-clusters-list';
import { getTokenFromLocalStorage } from '@e2e/utils/localStorage';
import { getClusterDetailedInfo } from '@e2e/utils/storage-class';
import {
  moveForward,
  submitWizard,
  populateBasicInformation,
  populateResources,
  populateAdvancedConfig,
  populateMonitoringModalForm,
} from '@e2e/utils/db-wizard';
import {
  fillScheduleModalForm,
  ScheduleTimeOptions,
} from '@e2e/pr/db-cluster/db-wizard/db-wizard-utils';
import { EVEREST_CI_NAMESPACES } from '@e2e/constants';
import {
  waitForStatus,
  waitForDelete,
  findRowAndClickActions,
} from '@e2e/utils/table';
import { checkError } from '@e2e/utils/generic';
import {
  deleteMonitoringInstance,
  listMonitoringInstances,
} from '@e2e/utils/monitoring-instance';
import { clickCreateSchedule } from '@e2e/pr/db-cluster-details/utils';
import { prepareTestDB, dropTestDB, queryTestDB } from '@e2e/utils/db-cmd-line';

const {
  MONITORING_URL,
  MONITORING_USER,
  MONITORING_PASSWORD,
  SELECT_DB,
  SELECT_SIZE,
} = process.env;
let token: string;

test.describe.configure({ retries: 0 });

function getNextScheduleMinute(incrementMinutes: number): string {
  const d: number = new Date().getMinutes();
  const minute: number = (d + incrementMinutes) % 60;

  return minute.toString();
}

[
  { db: 'psmdb', size: 3 },
  { db: 'pxc', size: 3 },
  { db: 'postgresql', size: 3 },
].forEach(({ db, size }) => {
  test.describe(
    'Scheduled backup',
    {
      tag: '@release',
    },
    () => {
      test.skip(
        () =>
          (SELECT_DB !== db && !!SELECT_DB) ||
          (SELECT_SIZE !== size.toString() && !!SELECT_SIZE)
      );
      test.describe.configure({ timeout: 720000 });

      const clusterName = `${db}-${size}-schbkp`;

      let storageClasses = [];
      const namespace = EVEREST_CI_NAMESPACES.EVEREST_UI;
      const monitoringName = `${db}-${size}-pmm`;

      test.beforeAll(async ({ request }) => {
        token = await getTokenFromLocalStorage();

        const { storageClassNames = [] } = await getClusterDetailedInfo(
          token,
          request
        );
        storageClasses = storageClassNames;
      });

      test.afterAll(async ({ request }) => {
        // we try to delete all monitoring instances because cluster creation expects that none exist
        // (monitoring instance is added in the form where the warning that none exist is visible)
        const monitoringInstances = await listMonitoringInstances(
          request,
          namespace,
          token
        );
        for (const instance of monitoringInstances) {
          await deleteMonitoringInstance(
            request,
            namespace,
            instance.name,
            token
          );
        }
      });

      test(`Create cluster [${db} size ${size}]`, async ({ page, request }) => {
        expect(storageClasses.length).toBeGreaterThan(0);

        await page.goto('/databases');
        await page.getByTestId('add-db-cluster-button').waitFor();
        await page.getByTestId('add-db-cluster-button').click();
        await page.getByTestId(`add-db-cluster-button-${db}`).click();

        await test.step('Populate basic information', async () => {
          await populateBasicInformation(
            page,
            namespace,
            clusterName,
            db,
            storageClasses[0],
            false
          );
          await moveForward(page);
        });

        await test.step('Populate resources', async () => {
          await page
            .getByRole('button')
            .getByText(size + ' node')
            .click();

          await expect(page.getByText('Nº nodes: ' + size)).toBeVisible();
          await populateResources(page, 0.6, 1, 1, size);
          await moveForward(page);
        });

        await test.step('Populate backups', async () => {
          await moveForward(page);
        });

        await test.step('Populate advanced db config', async () => {
          await populateAdvancedConfig(page, db, '', true, '');
          await moveForward(page);
        });

        await test.step('Populate monitoring', async () => {
          await populateMonitoringModalForm(
            page,
            monitoringName,
            namespace,
            MONITORING_URL,
            MONITORING_USER,
            MONITORING_PASSWORD,
            false
          );
          await page.getByTestId('switch-input-monitoring').click();
          await expect(
            page.getByTestId('text-input-monitoring-instance')
          ).toHaveValue(monitoringName);
        });

        await test.step('Submit wizard', async () => {
          await submitWizard(page);

          await expect(
            page.getByText('Awesome! Your database is being created!')
          ).toBeVisible();
        });

        await test.step('Check db list and status', async () => {
          await page.goto('/databases');
          await waitForStatus(page, clusterName, 'Initializing', 15000);
          await waitForStatus(page, clusterName, 'Up', 600000);
        });

        await test.step('Check db cluster k8s object options', async () => {
          const response = await request.get(
            `/v1/namespaces/${namespace}/database-clusters`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          await checkError(response);

          // TODO: replace with correct payload typings from GET DB Clusters
          const { items: clusters } = await response.json();

          const addedCluster = clusters.find(
            (cluster) => cluster.metadata.name === clusterName
          );

          expect(addedCluster).not.toBeUndefined();
          expect(addedCluster?.spec.engine.type).toBe(db);
          expect(addedCluster?.spec.engine.replicas).toBe(size);
          expect(['600m', '0.6']).toContain(
            addedCluster?.spec.engine.resources?.cpu.toString()
          );
          expect(addedCluster?.spec.engine.resources?.memory.toString()).toBe(
            '1G'
          );
          expect(addedCluster?.spec.engine.storage.size.toString()).toBe('1Gi');
          expect(addedCluster?.spec.proxy.expose.type).toBe('internal');
          if (db != 'psmdb') {
            expect(addedCluster?.spec.proxy.replicas).toBe(size);
          }
        });
      });

      test(`Add data [${db} size ${size}]`, async () => {
        await prepareTestDB(clusterName, namespace);
      });

      test(`Create backup schedules [${db} size ${size}]`, async ({ page }) => {
        test.setTimeout(30 * 1000);

        const scheduleMinute1 = getNextScheduleMinute(2);
        const timeOption1: ScheduleTimeOptions = {
          frequency: 'hour',
          day: null,
          amPm: null,
          hour: null,
          minute: scheduleMinute1,
        };

        await test.step('Create first schedule', async () => {
          await gotoDbClusterBackups(page, clusterName);
          await clickCreateSchedule(page);
          await fillScheduleModalForm(
            page,
            timeOption1,
            'first-schedule',
            false,
            '0'
          );
          await page.getByTestId('form-dialog-create').click();
        });

        const scheduleMinute2 = getNextScheduleMinute(3);
        const timeOption2: ScheduleTimeOptions = {
          frequency: 'hour',
          day: null,
          amPm: null,
          hour: null,
          minute: scheduleMinute2,
        };

        await test.step('Create second schedule', async () => {
          await gotoDbClusterBackups(page, clusterName);
          await clickCreateSchedule(page);
          await fillScheduleModalForm(
            page,
            timeOption2,
            'second-schedule',
            false,
            '0'
          );
          await page.getByTestId('form-dialog-create').click();
        });

        await test.step('Check schedules text in page', async () => {
          expect(
            page.getByText(`Every hour at minute ${scheduleMinute1}`)
          ).toBeTruthy();
          expect(
            page.getByText(`Every hour at minute ${scheduleMinute2}`)
          ).toBeTruthy();
          expect(page.getByText('2 active schedules')).toBeTruthy();
        });
      });

      test(`Wait for two backups to succeeded [${db} size ${size}]`, async ({
        page,
      }) => {
        await gotoDbClusterBackups(page, clusterName);
        await expect(page.getByText(`${db}-${size}-schbkp-`)).toHaveCount(2, {
          timeout: 360000,
        });
        await expect(page.getByText('Succeeded')).toHaveCount(2, {
          timeout: 360000,
        });
      });

      test(`Delete schedules [${db} size ${size}]`, async ({ page }) => {
        test.setTimeout(30 * 1000);

        await gotoDbClusterBackups(page, clusterName);

        await test.step('Delete first schedule', async () => {
          await page.getByTestId('scheduled-backups').click();

          const scheduleForDeleteBtn = await page
            .getByTestId('delete-schedule-button')
            .first();
          await scheduleForDeleteBtn.click();
          await page.getByTestId('confirm-dialog-delete').click();
          expect(page.getByText('1 active schedule')).toBeTruthy();
        });

        await test.step('Delete second schedule', async () => {
          await page.reload();
          await page.getByTestId('scheduled-backups').click();
          const scheduleForDeleteBtn2 = await page
            .getByTestId('delete-schedule-button')
            .first();
          await scheduleForDeleteBtn2.click();
          await page.getByTestId('confirm-dialog-delete').click();
          await expect(page.getByText('1 active schedule')).toBeHidden({
            timeout: 5000,
          });
        });
      });

      test(`Delete data [${db} size ${size}]`, async () => {
        await dropTestDB(clusterName, namespace);
      });

      test(`Restore cluster [${db} size ${size}]`, async ({ page }) => {
        await gotoDbClusterBackups(page, clusterName);
        const firstBackup = await page
          .getByText(`${db}-${size}-schbkp-`)
          .first()
          .textContent();

        await findRowAndClickActions(page, firstBackup, 'Restore to this DB');
        await expect(
          page.getByTestId('select-input-backup-name')
        ).not.toBeEmpty();
        await page.getByTestId('form-dialog-restore').click();

        await page.goto('/databases');
        await waitForStatus(page, clusterName, 'Restoring', 30000);
        await waitForStatus(page, clusterName, 'Up', 600000);

        await gotoDbClusterRestores(page, clusterName);
        // we select based on backup source since restores cannot be named and we don't know
        // in advance what will be the name
        await waitForStatus(page, firstBackup, 'Succeeded', 120000);
      });

      test(`Check data after restore [${db} size ${size}]`, async () => {
        const result = await queryTestDB(clusterName, namespace);
        switch (db) {
          case 'pxc':
            expect(result.trim()).toBe('1\n2\n3');
            break;
          case 'psmdb':
            expect(result.trim()).toBe('[ { a: 1 }, { a: 2 }, { a: 3 } ]');
            break;
          case 'postgresql':
            expect(result.trim()).toBe('1\n 2\n 3');
            break;
        }
      });

      test(`Delete restore [${db} size ${size}]`, async ({ page }) => {
        await gotoDbClusterRestores(page, clusterName);
        await findRowAndClickActions(page, `${db}-${size}-schbkp-`, 'Delete');
        await expect(page.getByLabel('Delete restore')).toBeVisible();
        await page.getByTestId('confirm-dialog-delete').click();
        await waitForDelete(page, `${db}-${size}-schbkp-`, 15000);
      });

      test(`Delete backup [${db} size ${size}]`, async ({ page }) => {
        await gotoDbClusterBackups(page, clusterName);

        await test.step('Delete first backup', async () => {
          const firstBackup = await page
            .getByText(`${db}-${size}-schbkp-`)
            .first()
            .textContent();

          await findRowAndClickActions(page, firstBackup, 'Delete');
          await expect(page.getByLabel('Delete backup')).toBeVisible();
          await page.getByTestId('form-dialog-delete').click();
          await waitForDelete(page, firstBackup, 30000);
        });

        await test.step('Delete second backup', async () => {
          const secondBackup = await page
            .getByText(`${db}-${size}-schbkp-`)
            .first()
            .textContent();

          await findRowAndClickActions(page, secondBackup, 'Delete');
          await expect(page.getByLabel('Delete backup')).toBeVisible();
          await page.getByTestId('form-dialog-delete').click();
          await waitForDelete(page, secondBackup, 30000);
        });
      });

      test(`Delete cluster [${db} size ${size}]`, async ({ page }) => {
        await deleteDbCluster(page, clusterName);
        await waitForStatus(page, clusterName, 'Deleting', 15000);
        await waitForDelete(page, clusterName, 240000);
      });
    }
  );
});
