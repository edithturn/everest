import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';

import '@fontsource/roboto-mono/400.css';
import {
  ComponentsOverrides,
  createTheme,
  PaletteMode,
  ThemeOptions,
} from '@mui/material';
import { DatePickerToolbarClassKey } from '@mui/x-date-pickers/DatePicker';
import { MultiSectionDigitalClockClassKey } from '@mui/x-date-pickers';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    surfaces?: {
      backdrop?: string;
      elevation0?: string;
      elevation1?: string;
    };
    dividers?: {
      divider?: string;
      dividerStrong?: string;
      dividerStronger?: string;
      contour?: string;
    };
    tooltips?: {
      color?: string;
      background?: string;
    };
  }

  interface Palette extends PaletteOptions {}
  interface SimplePaletteColorOptions {
    surface?: string;
  }

  interface PaletteColor {
    surface?: string;
  }
  interface TypeAction {
    focusVisible: string;
    focusVisibleOpacity: number;
    outlinedBorder: string;
    outlinedBorderOpacity: number;
  }
  interface TypographyVariants {
    sectionHeading: React.CSSProperties;
    subHead1: React.CSSProperties;
    subHead2: React.CSSProperties;
    helperText: React.CSSProperties;
    menuText: React.CSSProperties;
    inputText: React.CSSProperties;
    inputLabel: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    sectionHeading: React.CSSProperties;
    subHead1: React.CSSProperties;
    subHead2: React.CSSProperties;
    helperText: React.CSSProperties;
    menuText: React.CSSProperties;
    inputText: React.CSSProperties;
    inputLabel: React.CSSProperties;
  }

  interface ComponentNameToClassKey {
    MuiDateCalendar: DatePickerToolbarClassKey;
    MuiMultiSectionDigitalClock: MultiSectionDigitalClockClassKey;
  }

  interface Components<Theme = unknown> {
    MuiDateCalendar?: {
      styleOverrides?: ComponentsOverrides<Theme>['MuiDateCalendar'];
    };
    MuiMultiSectionDigitalClock?: {
      styleOverrides?: ComponentsOverrides<Theme>['MuiMultiSectionDigitalClock'];
    };
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    sectionHeading: true;
    subHead1: true;
    subHead2: true;
    helperText: true;
    menuText: true;
    inputText: true;
    inputLabel: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    grey: true;
  }
}

const BaseTheme = createTheme();

const baseThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          default: {
            light: '#4B5468',
            main: '#3A4151',
            dark: '#2C323E',
            contrastText: '#3A4151',
            surface: 'rgba(44, 50, 62, 0.122)',
          },
          error: {
            light: '#CC352E',
            main: '#B10810',
            dark: '#920000',
            contrastText: '#920000',
            surface: '#FFECE9',
          },
          warning: {
            light: '#AA7F26',
            main: '#9C7407',
            dark: '#654B17',
            contrastText: '#654B17',
            surface: '#FFF5C2',
          },
          info: {
            light: '#127AE8',
            main: '#0E5FB5',
            dark: '#0B4A8C',
            contrastText: '#0B4A8C',
            surface: '#E8F3FF',
          },
          success: {
            light: '#008C71',
            main: '#00745B',
            dark: '#005C45',
            contrastText: '#005C45',
            surface: '#E7F6F1',
          },
          text: {
            primary: 'rgba(44, 50, 62, 1)',
            secondary: 'rgba(44, 50, 62, 0.72)',
            disabled: 'rgba(44, 50, 62, 0.4)',
          },
          action: {
            hover: 'rgba(44, 50, 62, 0.04)',
            hoverOpacity: 0.04,
            disabled: 'rgba(44, 50, 62, 0.12)',
            disabledOpacity: 0.12,
            focus: 'rgba(44, 50, 62, 0.12)',
            focusOpacity: 0.12,
          },
          background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
          },
          surfaces: {
            backdrop: 'rgba(44, 50, 62, 0.72)',
            elevation0: 'rgba(240, 241, 244, 1)',
            elevation1: 'rgba(255, 255, 255, 1)',
          },
          dividers: {
            divider: 'rgba(44, 50, 62, 0.25)',
            dividerStrong: 'rgba(44, 50, 62, 0.5)',
            dividerStronger: '#2C323E',
            contour: 'rgba(0, 0, 0, 0.06)',
          },
          tooltips: {
            background: '#3A4151',
            color: '#FFFFFF',
          },
        }
      : {
          default: {
            light: '#FFFFFF',
            main: '#F0F1F4',
            dark: '#D1D5DE',
            contrastText: '#F0F1F4',
            surface: 'rgba(240, 241, 244, 0.149)',
          },
          error: {
            light: '#FEA195',
            main: '#F37C6F',
            dark: '#E2584D',
            contrastText: '#FFFFFF',
            surface: '#E2584D',
          },
          warning: {
            light: '#FFF5C2',
            main: '#FFEE99',
            dark: '#FFE770',
            contrastText: '#654B17',
            surface: '#FFE770',
          },
          info: {
            light: '#439EFF',
            main: '#1486FF',
            dark: '#127AE8',
            contrastText: '#FFFFFF',
            surface: '#127AE8',
          },
          success: {
            light: '#51BAA2',
            main: '#00A489',
            dark: '#008C71',
            contrastText: '#FFFFFF',
            surface: '#008C71',
          },
          text: {
            primary: '#FBFBFB',
            secondary: 'rgba(251, 251, 251, 0.72)',
            disabled: 'rgba(251, 251, 251, 0.4)',
          },
          action: {
            hover: 'rgba(240, 241, 244, 0.06)',
            hoverOpacity: 0.06,
            disabled: 'rgba(240, 241, 244, 0.14)',
            disabledOpacity: 0.14,
            focus: 'rgba(240, 241, 244, 0.14)',
            focusOpacity: 0.14,
          },
          background: {
            default: '#3A4151',
            paper: '#3A4151',
          },
          surfaces: {
            backdrop: 'rgba(44, 50, 62, 0.72)',
            elevation0: 'rgba(44, 50, 62, 1)',
            elevation1: 'rgba(58, 65, 81, 1)',
          },
          dividers: {
            divider: 'rgba(209, 213, 222, 0.25)',
            dividerStrong: 'rgba(209, 213, 222, 0.5)',
            dividerStronger: '#FFFFFF',
            contour: 'rgba(255, 255, 255, 0.08)',
          },
          tooltips: {
            background: '#F0F1F4',
            color: '#2C323E',
          },
        }),
  },
  typography: {
    h1: {
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      [BaseTheme.breakpoints.down('sm')]: {
        fontSize: '32px',
      },
      [BaseTheme.breakpoints.up('sm')]: {
        fontSize: '48px',
      },
    },
    h2: {
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      [BaseTheme.breakpoints.down('sm')]: {
        fontSize: '29px',
      },
      [BaseTheme.breakpoints.up('sm')]: {
        fontSize: '40px',
      },
    },
    h3: {
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      [BaseTheme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
      [BaseTheme.breakpoints.up('sm')]: {
        fontSize: '33px',
      },
    },
    h4: {
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      [BaseTheme.breakpoints.down('sm')]: {
        fontSize: '23px',
      },
      [BaseTheme.breakpoints.up('sm')]: {
        fontSize: '28px',
      },
    },
    h5: {
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      lineHeight: '22.5px',
      [BaseTheme.breakpoints.down('sm')]: {
        fontSize: '20px',
      },
      [BaseTheme.breakpoints.up('sm')]: {
        fontSize: '23px',
      },
    },
    h6: {
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      [BaseTheme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
      [BaseTheme.breakpoints.up('sm')]: {
        fontSize: '19px',
      },
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '19px',
      lineHeight: '1',
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '22px',
    },
    overline: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 800,
      fontSize: '12px',
    },
    sectionHeading: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '17.5px',
    },
    subHead1: {
      fontWeight: 600,
      fontSize: '19px',
      lineHeight: '26.13px',
    },
    subHead2: {
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '22px',
    },
    helperText: {
      fontWeight: 450,
      fontSize: '12px',
      lineHeight: '15px',
    },
    menuText: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '20px',
    },
    body1: {
      fontWeight: 400,
      fontSize: '16px',
    },
    body2: {
      fontWeight: 400,
      fontSize: '14px',
    },
    caption: {
      fontWeight: 400,
      fontSize: '13px',
    },
    button: {
      fontFamily: "'Poppins', sans-serif",
      textTransform: 'none',
      lineHeight: '1',
      letterSpacing: '0.025em',
    },
    inputText: {
      fontSize: '16px',
      fontWeight: 400,
    },
    inputLabel: {
      fontSize: '12px',
      fontWeight: 500,
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
    '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
    '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
    '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12)',
    '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
    '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
    '0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12)',
    '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
    '0px 5px 6px -3px rgba(0, 0, 0, 0.2), 0px 9px 12px 1px rgba(0, 0, 0, 0.14), 0px 3px 16px 2px rgba(0, 0, 0, 0.12)',
    '0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12)',
    '0px 6px 7px -4px rgba(0, 0, 0, 0.2), 0px 11px 15px 1px rgba(0, 0, 0, 0.14), 0px 4px 20px 3px rgba(0, 0, 0, 0.12)',
    '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)',
    '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)',
    '0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12)',
    '0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12)',
    '0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)',
    '0px 8px 11px -5px rgba(0, 0, 0, 0.2), 0px 17px 26px 2px rgba(0, 0, 0, 0.14), 0px 6px 32px 5px rgba(0, 0, 0, 0.12)',
    '0px 9px 11px -5px rgba(0, 0, 0, 0.2), 0px 18px 28px 2px rgba(0, 0, 0, 0.14), 0px 7px 34px 6px rgba(0, 0, 0, 0.12)',
    '0px 9px 12px -6px rgba(0, 0, 0, 0.2), 0px 19px 29px 2px rgba(0, 0, 0, 0.14), 0px 7px 36px 6px rgba(0, 0, 0, 0.12)',
    '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)',
    '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 21px 33px 3px rgba(0, 0, 0, 0.14), 0px 8px 40px 7px rgba(0, 0, 0, 0.12)',
    '0px 10px 14px -6px rgba(0, 0, 0, 0.2), 0px 22px 35px 3px rgba(0, 0, 0, 0.14), 0px 8px 42px 7px rgba(0, 0, 0, 0.12)',
    '0px 11px 14px -7px rgba(0, 0, 0, 0.2), 0px 23px 36px 3px rgba(0, 0, 0, 0.14), 0px 9px 44px 8px rgba(0, 0, 0, 0.12)',
    '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)',
  ],
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: () => ({
          fontSize: '16px',
          fontWeight: 400,
          maxWidth: '100%',
        }),
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&.MuiIconButton-root:not(:focus-visible):focus': {
            backgroundColor: 'transparent',
          },
          '&.MuiIconButton-root:focus-visible:focus': {
            backgroundColor: 'rgba(18, 119, 227, 0.3)',
          },
          '&.MuiIconButton-root:focus-visible': {
            backgroundColor: 'rgba(18, 119, 227, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: 128,
          borderWidth: 2,

          '.MuiButton-startIcon': {
            height: 0,
            alignItems: 'center',
          },

          ...(ownerState.variant === 'contained' && {
            ...(ownerState.size === 'large' && {
              padding: '12px 24px',
            }),
            ...(ownerState.size === 'medium' && {
              padding: '11px 16px',
            }),
            ...(ownerState.size === 'small' && {
              padding: '8px 12px',
            }),
          }),

          ...(ownerState.variant === 'outlined' && {
            ...(ownerState.size === 'large' && {
              padding: '12px 22px',
            }),
            ...(ownerState.size === 'medium' && {
              padding: '11px 16px',
            }),
            ...(ownerState.size === 'small' && {
              padding: '8px 10px',
            }),
            borderColor: theme.palette.primary.main,
          }),

          ...(ownerState.variant === 'text' && {
            ...(ownerState.size === 'large' && {
              padding: '8px 11px',
            }),
            ...(ownerState.size === 'medium' && {
              padding: '6px 8px',
            }),
            ...(ownerState.size === 'small' && {
              padding: '4px 5px',
            }),
            borderColor: theme.palette.primary.main,
          }),

          ...(ownerState.size === 'large' && {
            fontSize: 15,
          }),
          ...(ownerState.size === 'medium' && {
            fontSize: 13,
          }),
          ...(ownerState.size === 'small' && {
            fontSize: 13,
          }),

          '&:hover': {
            borderWidth: '2px',
            ...(ownerState.variant === 'outlined' && {
              backgroundColor: theme.palette.action.focus,
            }),
            ...(ownerState.variant === 'text' && {
              backgroundColor: theme.palette.action.focus,
            }),
          },
          '&:disabled': {
            borderWidth: '2px',
            ...(ownerState.variant === 'contained' && {
              backgroundColor: theme.palette.action.disabled,
            }),
            color: theme.palette.text.disabled,
          },
        }),
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: '128px',
        },
        grouped: ({ ownerState }) => ({
          '&:not(:last-of-type)': {
            ...(ownerState.variant === 'contained' && {
              borderRight: 0,
            }),
            marginLeft: '-2px',
          },
          '&:not(:first-of-type)': {
            marginLeft: '-2px',
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.menuText,
          // This should override any other nested typography (e.g. form labels)
          '.MuiTypography-root': {
            ...theme.typography.menuText,
          },
          '&.Mui-disabled': {
            opacity: 0.5,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.inputText,
          '& fieldset': {
            borderColor: theme.palette.dividers?.divider,
          },
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.dividers?.dividerStrong,
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.dividers?.dividerStronger,
          },
          [`&:disabled .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.dividers?.contour,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.inputText,
        }),
      },
    },
    MuiFormGroup: {
      styleOverrides: {
        root: () => ({
          '> *:first-child': {
            marginTop: 0,
          },
        }),
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiInputLabel-root': {
            color: theme.palette.text.secondary,
            '&.Mui-focused': {
              color: theme.palette.text.primary,
            },
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          fontWeight: 400,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '32px',
          '.MuiButtonBase-root': {
            fontSize: '16px',
            padding: '8px 12px',
          },
          '.MuiTabs-indicator': {
            height: '3px',
          },
          '.MuiTabScrollButton-root': {
            '&.Mui-disabled': {
              opacity: 0.1,
            },
          },
        },
      },
    },
    MuiDialogTitle: {
      defaultProps: {
        component: 'h5',
        variant: 'h5',
      },
      styleOverrides: {
        root: {
          padding: BaseTheme.spacing(2),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: BaseTheme.spacing(2),
          paddingTop: `${BaseTheme.spacing(2)} !important`,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: BaseTheme.spacing(2),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          ...theme.typography.helperText,
          boxShadow: theme.shadows[8],
          ...(theme.palette.tooltips && {
            color: theme.palette.tooltips?.color,
            backgroundColor: theme.palette.tooltips?.background,
          }),
        }),
        arrow: ({ theme }) => ({
          ...(theme.palette.tooltips && {
            color: theme.palette.tooltips?.background,
          }),
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(44, 50, 62, 0.25)', // TODO move into pallet =#2C323E 25%
          borderRadius: theme.spacing(1),
          backgroundColor: theme.palette.action.hover,
          boxShadow: 'none',
          '&:before': {
            height: 0,
          },
          marginTop: '8px',
          '&.Mui-expanded': {
            marginTop: '8px',
          },
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: () => ({
          '&.Mui-disabled': {
            opacity: '0.5 !important',
          },
        }),
      },
    },
    MuiCard: {
      variants: [
        {
          props: { variant: 'grey' },
          style: ({ theme }) => ({
            border: `${theme.palette.dividers?.divider} 1px solid`,
            '.MuiCardHeader-root': {
              backgroundColor: theme.palette.surfaces?.elevation0,
              borderBottomColor: theme.palette.dividers?.divider,
              borderBottomWidth: 1,
              borderBottomStyle: 'solid',
              padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
              '.MuiTypography-root': {
                ...theme.typography.sectionHeading,
              },
              '#database-icon, #network-node-icon': {
                path: { fill: theme.palette.text.primary },
              },
            },
            '.MuiCardContent': {
              py: 1,
              px: 2,
            },
          }),
        },
      ],
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiPickersCalendarHeader-root': {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          },
          '.MuiPickersCalendarHeader-label': {
            fontSize: theme.typography.inputText.fontSize,
            fontWeight: theme.typography.inputText.fontWeight,
          },
          '.MuiDayCalendar-weekDayLabel': {
            fontSize: theme.typography.helperText.fontSize,
            fontWeight: theme.typography.helperText.fontWeight,
            color: theme.palette.text.disabled,
          },
          '.MuiPickersDay-root': {
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.body2.fontWeight,
          },
        }),
      },
    },
    MuiMultiSectionDigitalClock: {
      styleOverrides: {
        root: () => ({
          '.MuiMultiSectionDigitalClockSection-root': {
            '&::after': {
              height: 'calc(100% - 40px - 2px)',
            },
          },
        }),
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.h6,
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme, ownerState: { severity } }) => ({
          ...theme.typography.body2,
          borderRadius: '4px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor:
            theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.059)'
              : 'transparent',
          backgroundColor: theme.palette[severity!].surface,
        }),
        icon: ({ theme, ownerState: { severity } }) => ({
          color: `${theme.palette[severity!].contrastText} !important`,
        }),
        message: ({ theme, ownerState: { severity } }) => ({
          color: theme.palette[severity!].contrastText,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: ({ theme, ownerState: { color } }) => ({
          // @ts-ignore
          backgroundColor: theme.palette[color]?.surface,
        }),
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: () => ({
          '.MuiBadge-overlapCircular': {
            backgroundColor: 'transparent',
          },
        }),
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: ({ theme }) => ({
          '#empty-state-icon': {
            path: {
              // complex selector we need in order to provide dark theme style for this icon, instead of having a separate one
              '&:not(:nth-child(n+8)), &:last-child': {
                stroke: theme.palette.text.primary,
              },
            },
          },
        }),
      },
    },
  },
});

export default baseThemeOptions;
