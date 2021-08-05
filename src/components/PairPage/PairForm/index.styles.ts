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
    configurationField: {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.info.main,
      },
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
