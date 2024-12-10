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
import { moveForward } from '@e2e/utils/db-wizard';
import { EVEREST_CI_NAMESPACES } from '@e2e/constants';
import { deleteMonitoringInstance } from '@e2e/utils/monitoring-instance';
import { setNamespace } from '@e2e/utils/namespaces';
import { selectDbEngine } from '../db-cluster/db-wizard/db-wizard-utils';

const { MONITORING_URL, MONITORING_USER, MONITORING_PASSWORD } = process.env;

test.describe('Namespaces: Monitoring availability', () => {
  // const pxcStorageLocationName = 'storage-location-pxc';
  const pxcMonitoringEndpoint = 'pxc-monitoring';
  const token = '';

  // test.beforeAll(async ({ request }) => {
  //   token = await getTokenFromLocalStorage();
  //   await createBackupStorageFn(request, pxcStorageLocationName, [
  //     EVEREST_CI_NAMESPACES.PXC_ONLY,
  //   ]);
  // });

  // test.afterAll(async ({ request }) => {
  //   await deleteStorageLocationFn(request, pxcStorageLocationName);
  // });

  test('Monitoring autocomplete in DB Wizard has only endpoints in selected namespace', async ({
    page,
    request,
  }) => {
    await page.goto('/databases');
    await selectDbEngine(page, 'pxc');

    // setting everest-pxc namespace
    await setNamespace(page, EVEREST_CI_NAMESPACES.PXC_ONLY);

    // Resources Step
    await moveForward(page);
    // Backups step
    await moveForward(page);
    // Advanced Configuration step
    await moveForward(page);
    // Monitoring Step
    await moveForward(page);

    // check monitoring is not available
    await expect(page.getByTestId('monitoring-warning')).toBeVisible();
    expect(await page.getByLabel('Enable monitoring').isChecked()).toBeFalsy();
    await page.getByRole('button', { name: 'Add monitoring endpoint' }).click();

    // filling in monitoring modal form
    await page.getByTestId('text-input-name').fill(pxcMonitoringEndpoint);
    const namespaces = page.getByTestId('text-input-namespace');
    await namespaces.click();
    await page
      .getByRole('option', { name: EVEREST_CI_NAMESPACES.PXC_ONLY })
      .click();
    await page.getByTestId('text-input-url').fill(MONITORING_URL);
    await page.getByTestId('text-input-user').fill(MONITORING_USER);
    await page.getByTestId('text-input-password').fill(MONITORING_PASSWORD);

    await expect(page.getByTestId('form-dialog-add')).toBeEnabled();
    await page.getByTestId('form-dialog-add').click();

    await expect(page.getByTestId('monitoring-warning')).not.toBeVisible();
    await expect(page.getByTestId('switch-input-monitoring')).toBeEnabled();

    await deleteMonitoringInstance(
      request,
      EVEREST_CI_NAMESPACES.PXC_ONLY,
      pxcMonitoringEndpoint,
      token
    );
  });
});
