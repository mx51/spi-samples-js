import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    subHeader: {
      textAlign: 'center',
      marginTop: '2rem',
      backgroundColor: '#ececfa',
      color: '#004830',
      margin: 0,
      padding: '1.3rem',
      fontSize: '1rem',
      letterSpacing: '0.1rem',
      fontWeight: 600,
      marginBottom: '0.8rem',
    },
    tenantSelecter: {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.info.main,
      },
    },
  })
);
