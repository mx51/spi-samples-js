import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    cardStyle: {
      width: '12.625rem',
      height: '12.813rem',
      borderRadius: 4,
      margin: theme.spacing(1),
      border: 0,
    },
    productText: {
      height: '8.938rem',
    },
    productName: {
      maxHeight: '3.875rem',
      maxWidth: '12.625rem',
      borderRadius: 0,
      fontSize: '1rem',
      fontWeight: 500,
    },
    productImage: { width: '12.625rem', height: '8.938rem' },
  })
);
