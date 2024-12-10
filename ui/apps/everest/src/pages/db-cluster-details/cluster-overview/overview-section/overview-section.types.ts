import { LoadableChildrenProps } from '@percona/ui-lib';
import { ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

export type OverviewSectionProps = {
  title: string | ReactNode;
  dataTestId?: string;
  actionButtonProps?: ButtonProps & {
    'data-testid'?: string;
  };
  editable?: boolean;
  disabledEditTooltipText?: string;
} & LoadableChildrenProps;
