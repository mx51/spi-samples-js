import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(1.5),
    },
    fieldSpace: {
      marginBottom: theme.spacing(1.5),
    },
    paymentTypeWrapper: {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.spacing(0.5),
      '&.MuiFormControl-root': {
        border: `1px solid ${theme.palette.secondary.main}`,
        marginTop: theme.spacing(1),
        padding: theme.spacing(0, 1),
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
  })
);

export default useStyles;
