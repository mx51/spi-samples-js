import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);
