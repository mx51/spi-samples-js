import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { FONT_COLOR } from '../../definitions/constants/themeStylesConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalHeading: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: theme.palette.text.secondary,
    },
    modalSubHeading: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: theme.palette.text.primary,
    },
    modalDescription: {
      color: FONT_COLOR,
      fontSize: '1.125rem',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    modalBtn: {
      margin: theme.spacing(2, 0, 0, 0),
    },
    btnWithLeftMargin: {
      marginLeft: theme.spacing(3),
    },
    transactionProgressModalContent: {
      width: '100%',
      height: '19.6rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      [theme.breakpoints.up('sm')]: {
        width: '27.5rem',
      },
    },
    signatureFlow: {
      textAlign: 'center',
      padding: theme.spacing(3, 0),
      '&>h6': {
        marginTop: theme.spacing(1.5),
      },
      '&>.MuiTypography-body2': {
        marginTop: theme.spacing(1),
        color: FONT_COLOR,
      },
      '&>.MuiButton-text': {
        margin: theme.spacing(3, 2, 0),
        color: 'inherit',
        background: 'transparent',
        border: `1px solid ${theme.palette.primary.main}`,
        cursor: 'pointer',
      },
      '&>button:disabled': {
        color: theme.palette.text.hint,
        borderColor: theme.palette.text.hint,
      },
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      '&:disabled': {
        color: theme.palette.text.hint,
        borderColor: theme.palette.text.hint,
      },
    },
    modalImage: {
      margin: theme.spacing(1),
    },
  })
);

export default useStyles;
