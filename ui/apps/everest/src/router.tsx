import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Login } from 'pages/login';
import ProtectedRoute from 'components/protected-route/ProtectedRoute';
import { Main } from 'components/main/Main';
import { DbClusterView } from 'pages/databases/DbClusterView';
import { DatabasePage } from 'pages/database-form/database-form';
import { DbClusterDetails } from 'pages/db-cluster-details/db-cluster-details';
import { DBClusterDetailsTabs } from 'pages/db-cluster-details/db-cluster-details.types';
import { ClusterOverview } from 'pages/db-cluster-details/cluster-overview/cluster-overview';
import { Settings } from 'pages/settings/settings';
import { SettingsTabs } from 'pages/settings/settings.types';
import { StorageLocations } from 'pages/settings/storage-locations/storage-locations';
import { MonitoringEndpoints } from 'pages/settings/monitoring-endpoints/monitoring-endpoints';
import { NoMatch } from 'pages/404/NoMatch';
import { Backups } from 'pages/db-cluster-details/backups/backups';
import { Namespaces } from './pages/settings/namespaces/namespaces';
import NamespaceDetails from 'pages/settings/namespaces/namespace-details';
import Restores from 'pages/db-cluster-details/restores';
import Components from './pages/db-cluster-details/components';
import LoginCallback from 'components/login-callback/LoginCallback';
import { DbClusterContextProvider } from 'pages/db-cluster-details/dbCluster.context';
import Logout from 'pages/logout';
import PodSchedulingPolicies from 'pages/settings/pod-scheduling-policies';
import PolicyDetails from 'pages/settings/pod-scheduling-policies/policy-details';

const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: '/login-callback',
    element: <LoginCallback />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'databases',
        element: <DbClusterView />,
      },
      {
        path: 'databases/new',
        element: <DatabasePage />,
      },
      {
        path: 'databases/:namespace/:dbClusterName',
        element: (
          <DbClusterContextProvider>
            <DbClusterDetails />
          </DbClusterContextProvider>
        ),
        children: [
          {
            path: DBClusterDetailsTabs.backups,
            element: <Backups />,
          },
          {
            index: true,
            path: DBClusterDetailsTabs.overview,
            element: <ClusterOverview />,
          },
          {
            path: DBClusterDetailsTabs.components,
            element: <Components />,
          },
          {
            path: DBClusterDetailsTabs.restores,
            element: <Restores />,
          },
        ],
      },
      {
        index: true,
        element: <Navigate to="/databases" replace />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            path: SettingsTabs.storageLocations,
            element: <StorageLocations />,
          },
          {
            path: SettingsTabs.monitoringEndpoints,
            element: <MonitoringEndpoints />,
          },
          {
            path: SettingsTabs.namespaces,
            element: <Namespaces />,
          },
          {
            path: SettingsTabs.podSchedulingPolicies,
            element: <PodSchedulingPolicies />,
            children: [
              {
                path: ':name',
                element: <PolicyDetails />,
              },
            ],
          },
        ],
      },
      {
        path: '/settings/namespaces/:namespace',
        element: <NamespaceDetails />,
      },
      {
        path: '*',
        element: <NoMatch />,
      },
    ],
  },
]);

export default router;
