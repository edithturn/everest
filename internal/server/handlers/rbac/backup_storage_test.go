package rbac

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	everestv1alpha1 "github.com/percona/everest-operator/api/v1alpha1"
	"github.com/percona/everest/internal/server/handlers"
	"github.com/percona/everest/pkg/common"
	"github.com/percona/everest/pkg/kubernetes"
	"github.com/percona/everest/pkg/rbac"
)

func TestRBAC_BackupStorage(t *testing.T) {
	t.Parallel()

	data := func() *handlers.MockHandler {
		next := handlers.MockHandler{}
		next.On("ListBackupStorages",
			mock.Anything,
			mock.Anything,
		).Return(
			&everestv1alpha1.BackupStorageList{
				Items: []everestv1alpha1.BackupStorage{
					{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "backup-storage-1",
							Namespace: "default",
						},
					},
					{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "backup-storage-2",
							Namespace: "default",
						},
					},
					{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "backup-storage-3",
							Namespace: "default",
						},
					},
				},
			},
			nil,
		)
		return &next
	}

	t.Run("ListBackupStorages", func(t *testing.T) {
		t.Parallel()

		testCases := []struct {
			desc   string
			policy string
			outLen int
		}{
			{
				desc: "read-only for backup-storage-1 in default namespace",
				policy: newPolicy(
					"p, role:test, backup-storages, read, default/backup-storage-1",
					"g, test-user, role:test",
				),
				outLen: 1,
			},
			{
				desc: "read-only for backup-storage-1 and backup-storage-2 only in default namespace",
				policy: newPolicy(
					"p, role:test, backup-storages, read, default/backup-storage-1",
					"p, role:test, backup-storages, read, default/backup-storage-2",
					"g, test-user, role:test",
				),
				outLen: 2,
			},
			{
				desc: "read-only for all in default namespace",
				policy: newPolicy(
					"p, role:test, backup-storages, read, default/*",
					"g, test-user, role:test",
				),
				outLen: 3,
			},
			{
				desc:   "no policy",
				policy: newPolicy(),
				outLen: 0,
			},
		}

		ctx := context.WithValue(context.Background(), common.UserCtxKey, "test-user")
		for _, tc := range testCases {
			t.Run(tc.desc, func(t *testing.T) {
				t.Parallel()
				k8sMock := newConfigMapMock(tc.policy)
				enf, err := rbac.NewEnforcer(ctx, k8sMock, zap.NewNop().Sugar())
				require.NoError(t, err)
				next := data()

				h := &rbacHandler{
					next:       next,
					log:        zap.NewNop().Sugar(),
					enforcer:   enf,
					userGetter: testUserGetter,
				}

				list, err := h.ListBackupStorages(ctx, "default")
				require.NoError(t, err)
				assert.Len(t, list.Items, tc.outLen)
			})
		}
	})

	t.Run("GetBackupStorage", func(t *testing.T) {
		t.Parallel()

		data := func() *handlers.MockHandler {
			next := handlers.MockHandler{}
			next.On("GetBackupStorage", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return(
				&everestv1alpha1.BackupStorage{}, nil,
			)
			return &next
		}

		testCases := []struct {
			desc    string
			policy  string
			wantErr error
		}{
			{
				desc: "all actions for all backupstorages in all namespaces",
				policy: newPolicy(
					"p, role:test, backup-storages, *, */*",
					"g, test-user, role:test",
				),
			},
			{
				desc: "all actions for all backupstorages in default namespace",
				policy: newPolicy(
					"p, role:test, backup-storages, *, default/*",
					"g, test-user, role:test",
				),
			},
			{
				desc: "read-only for all backupstorages in default namespace",
				policy: newPolicy(
					"p, role:test, backup-storages, read, default/*",
					"g, test-user, role:test",
				),
			},
			{
				desc: "read-only for 'inaccessible-storage' in default namespace",
				policy: newPolicy(
					"p, role:test, backup-storages, read, default/inaccessible-storage",
					"g, test-user, role:test",
				),
				wantErr: ErrInsufficientPermissions,
			},
			{
				desc: "read-only for all backupstorages in kube-system namespace",
				policy: newPolicy(
					"p, role:test, backup-storages, read, kube-system/*",
					"g, test-user, role:test",
				),
				wantErr: ErrInsufficientPermissions,
			},
		}

		ctx := context.WithValue(context.Background(), common.UserCtxKey, "test-user")
		for _, tc := range testCases {
			t.Run(tc.desc, func(t *testing.T) {
				t.Parallel()
				k8sMock := newConfigMapMock(tc.policy)
				enf, err := rbac.NewEnforcer(ctx, k8sMock, zap.NewNop().Sugar())
				require.NoError(t, err)

				next := data()

				h := &rbacHandler{
					next:       next,
					log:        zap.NewNop().Sugar(),
					enforcer:   enf,
					userGetter: testUserGetter,
				}
				_, err = h.GetBackupStorage(ctx, "default", "backup-storage-1")
				assert.ErrorIs(t, err, tc.wantErr)
			})
		}
	})
}

func newConfigMapMock(policy string) *kubernetes.MockKubernetesConnector {
	k8sMock := &kubernetes.MockKubernetesConnector{}
	k8sMock.On("GetConfigMap", mock.Anything, mock.Anything, mock.Anything).Return(newConfigMapPolicy(policy), nil)
	return k8sMock
}

func newPolicy(lines ...string) string {
	return strings.Join(lines, "\n")
}

func newConfigMapPolicy(policy string) *corev1.ConfigMap {
	return &corev1.ConfigMap{
		Data: map[string]string{
			"enabled":    "true",
			"policy.csv": policy,
		},
	}
}

func testUserGetter(ctx context.Context) (string, error) {
	user, ok := ctx.Value(common.UserCtxKey).(string)
	if !ok {
		return "", errors.New("user not found in context")
	}
	return user, nil
}
