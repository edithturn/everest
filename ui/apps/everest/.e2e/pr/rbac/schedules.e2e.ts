import { getTokenFromLocalStorage } from '@e2e/utils/localStorage';
import { getNamespacesFn } from '@e2e/utils/namespaces';
import { setRBACPermissionsK8S } from '@e2e/utils/rbac-cmd-line';
import { expect, test } from '@playwright/test';
import { moveForward } from '@e2e/utils/db-wizard';
import {
  MOCK_CLUSTER_NAME,
  MOCK_SCHEDULE_NAME,
  mockBackups,
  mockClusters,
  mockEngines,
  mockStorages,
} from './utils';

const { CI_USER: user } = process.env;

test.describe('Schedules RBAC', () => {
  let namespace = '';
  test.beforeAll(async ({ request }) => {
    const token = await getTokenFromLocalStorage();
    const namespaces = await getNamespacesFn(token, request);
    namespace = namespaces[0];
  });

  test('Schedule creation from wizard', async ({ page }) => {
    await setRBACPermissionsK8S([
      ['namespaces', 'read', namespace],
      ['database-engines', '*', `${namespace}/*`],
      ['database-clusters', 'read', `${namespace}/*`],
      ['database-clusters', 'create', `${namespace}/*`],
      ['backup-storages', 'read', `${namespace}/*`],
      ['database-cluster-backups', 'create', `${namespace}/*`],
    ]);
    await mockEngines(page, namespace);
    await mockStorages(page, namespace);
    await mockClusters(page, namespace);
    await page.goto('/databases');
    await page.getByTestId('add-db-cluster-button').click();
    await expect(
      page.getByText('Basic information', { exact: true })
    ).toBeVisible();
    await moveForward(page);
    await moveForward(page);
    await expect(
      page.getByRole('button').filter({ hasText: 'Create backup schedule' })
    ).toBeVisible();
  });

  test('Hide schedule button from wizard when not allowed to create backups', async ({
    page,
  }) => {
    await setRBACPermissionsK8S([
      ['namespaces', 'read', namespace],
      ['database-engines', '*', `${namespace}/*`],
      ['database-clusters', 'read', `${namespace}/*`],
      ['database-clusters', 'create', `${namespace}/*`],
      ['backup-storages', 'read', `${namespace}/*`],
    ]);
    await mockEngines(page, namespace);
    await mockStorages(page, namespace);
    await mockClusters(page, namespace);
    await page.goto('/databases');
    await page.getByTestId('add-db-cluster-button').click();
    await expect(
      page.getByText('Basic information', { exact: true })
    ).toBeVisible();
    await moveForward(page);
    await moveForward(page);
    await expect(
      page.getByRole('button').filter({ hasText: 'Create backup schedule' })
    ).not.toBeVisible();
  });

  test('Schedule creation from DB details', async ({ page }) => {
    await setRBACPermissionsK8S([
      ['namespaces', 'read', namespace],
      ['database-engines', '*', `${namespace}/*`],
      ['database-clusters', 'read', `${namespace}/*`],
      ['database-clusters', 'update', `${namespace}/*`],
      ['backup-storages', 'read', `${namespace}/*`],
      ['database-cluster-backups', 'create', `${namespace}/*`],
    ]);
    await mockEngines(page, namespace);
    await mockStorages(page, namespace);
    await mockClusters(page, namespace);
    await mockBackups(page, namespace);
    await page.goto(`/databases/${namespace}/${MOCK_CLUSTER_NAME}/backups`);
    await page.getByText('Create backup').click();
    await expect(page.getByText('Schedule', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByTestId('scheduled-backups').click();
    await expect(page.getByText(MOCK_SCHEDULE_NAME)).toBeVisible();
    await expect(page.getByTestId('edit-schedule-button')).toBeVisible();
    await expect(page.getByTestId('delete-schedule-button')).toBeVisible();
  });

  test('Hide schedule button from DB details when not allowed to create backups', async ({
    page,
  }) => {
    await setRBACPermissionsK8S([
      ['namespaces', 'read', namespace],
      ['database-engines', '*', `${namespace}/*`],
      ['database-clusters', 'read', `${namespace}/*`],
      ['database-clusters', 'update', `${namespace}/*`],
      ['backup-storages', 'read', `${namespace}/*`],
    ]);
    await mockEngines(page, namespace);
    await mockStorages(page, namespace);
    await mockClusters(page, namespace);
    await mockBackups(page, namespace);
    await page.goto(`/databases/${namespace}/${MOCK_CLUSTER_NAME}/backups`);
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Create backup')).not.toBeVisible();
    await page.getByTestId('scheduled-backups').click();
    await expect(page.getByTestId('edit-schedule-button')).not.toBeVisible();
    await expect(page.getByTestId('delete-schedule-button')).not.toBeVisible();
  });

  test('Hide schedule button from DB details when not allowed to update DB', async ({
    page,
  }) => {
    await setRBACPermissionsK8S([
      ['namespaces', 'read', namespace],
      ['database-engines', '*', `${namespace}/*`],
      ['database-clusters', 'read', `${namespace}/*`],
      ['backup-storages', 'read', `${namespace}/*`],
      ['database-cluster-backups', 'create', `${namespace}/*`],
    ]);
    await mockEngines(page, namespace);
    await mockStorages(page, namespace);
    await mockClusters(page, namespace);
    await mockBackups(page, namespace);
    await page.goto(`/databases/${namespace}/${MOCK_CLUSTER_NAME}/backups`);
    await page.getByText('Create backup').click();
    await expect(page.getByText('Now', { exact: true })).toBeVisible();
    await expect(page.getByText('Schedule', { exact: true })).not.toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByTestId('scheduled-backups').click();
    await expect(page.getByTestId('edit-schedule-button')).not.toBeVisible();
    await expect(page.getByTestId('delete-schedule-button')).not.toBeVisible();
  });
});
