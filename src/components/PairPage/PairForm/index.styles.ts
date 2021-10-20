import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      paddingRight: theme.spacing(8),
      '& .MuiInputBase-input': {
        textOverflow: 'ellipsis',
      },
    },
    pairForm: {
      marginBottom: -theme.spacing(2),
    },
    title: {
      marginBottom: theme.spacing(1.5),
    },
    configurationTitle: {
      marginTop: theme.spacing(1),
    },
    fieldSpace: {
      marginBottom: theme.spacing(1.5),
    },
    '.MuiFormHelperText-contained, .MuiFormHelperText-root.Mui-error': {
      margin: 0,
    },
    spiBtn: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 300,
      marginTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
    saveBtn: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 300,
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
    columnSpace: {
      paddingRight: theme.spacing(2),
    },
    configurationLabel: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    pairFormSelector: {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.info.main,
      },
    },
    paymentTypeWrapper: {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.spacing(0.5),
      padding: theme.spacing(0, 3),
      '&.MuiFormControl-root': {
        border: `1px solid ${theme.palette.secondary.main}`,
        marginTop: theme.spacing(1),
      },
      '& .MuiFormControlLabel-root': {
        margin: theme.spacing(0, 2),
      },
    },
    paymentTypeRadioButton: {
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      padding: theme.spacing(1, 0),
      '&:last-child': {
        borderBottom: 'none',
      },
      '& .MuiRadio-root': {
        marginLeft: theme.spacing(-1.5),
      },
    },
    paymentTypeRadioButtonIcon: {
      maxHeight: '1.875rem',
    },
    [theme.breakpoints.between(960, 1024)]: {
      formContainer: {
        paddingRight: theme.spacing(4),
      },
    },
    [theme.breakpoints.between(600, 959)]: {
      formContainer: {
        paddingRight: theme.spacing(2),
      },
    },
    [theme.breakpoints.down(600)]: {
      columnSpace: {
        paddingRight: 0,
      },
      paymentProvider: {
        paddingRight: theme.spacing(2),
      },
    },
  })
);

export default useStyles;
