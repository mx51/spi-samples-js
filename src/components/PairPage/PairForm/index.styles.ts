import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      padding: theme.spacing(0, 12, 0, 0),
    },
    mainTitle: {
      marginBottom: theme.spacing(1),
    },
    fieldSpace: {
      marginBottom: theme.spacing(1.5),
    },
    '.MuiFormHelperText-contained, .MuiFormHelperText-root.Mui-error': {
      margin: 0,
    },
    spiBtn: {
      marginTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
    saveBtn: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
    columnSpace: {
      paddingRight: theme.spacing(2),
    },
    configurationField: {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.info.main,
      },
    },
  })
);

export default useStyles;
