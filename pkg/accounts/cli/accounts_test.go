package cli

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestUsernamePasswordSanitation(t *testing.T) {
	t.Parallel()
	t.Run("Username", func(t *testing.T) {
		t.Parallel()
		testCases := []struct {
			name        string
			username    string
			expectedErr error
		}{
			{"invalid_with_spaces", "b ob", ErrInvalidUsername},
			{"invalid_non_latin_chars", "аккаунт", ErrInvalidUsername},
			{"invalid_special_chars", "bob!!", ErrInvalidUsername},
			{"invalid_short", "f", ErrInvalidUsername},
			{"invalid_empty", "", ErrInvalidUsername},
			{"valid", "bob1", nil},
			{"valid_with_underscore", "bruce_wayne11", nil},
		}
		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				t.Parallel()
				err := ValidateUsername(tc.username)
				if tc.expectedErr == nil {
					require.ErrorIs(t, err, tc.expectedErr)
				}
			})
		}
	})

	t.Run("Password validation", func(t *testing.T) {
		t.Parallel()

		testCases := []struct {
			name        string
			password    string
			expectedErr error
		}{
			{"invalid_short", "pass", ErrInvalidNewPassword},
			{"invalid_with_spaces", "password with spaces", ErrInvalidNewPassword},
			{"invalid_non_latin_chars", "пароль", ErrInvalidNewPassword},
			{"invalid_empty", "", ErrInvalidNewPassword},
			{"valid_lower_case", "verysecurepassword", nil},
			{"valid_upper_case", "VERYSECUREPASSWORD", nil},
			{"valid_lower_case_with_special_chars", "^v#r4$ec*u%ep@s+sw_o&!d=-", nil},
			{"valid_upper_case_with_special_chars", "^V#R4$EC*U%EP@S+SW_O&!D=-", nil},
			{"valid_mixed_case_with_special_chars", "^V#R4$Ec*U%Ep@S+sW_o&!d=-", nil},
		}

		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				t.Parallel()
				err := ValidatePassword(tc.password)
				if tc.expectedErr == nil {
					require.ErrorIs(t, err, tc.expectedErr)
				}
			})
		}
	})
}
