import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subTotal: {
      color: theme.palette.primary.main,
      fontSize: '1rem',
      fontWeight: 'normal',
      lineHeight: '1.5rem',
    },
    price: {
      fontSize: '1.25rem',
    },
  })
);
export default useStyles;
