import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { SECONDRARY_BACKGROUND_COLOR } from '../../definitions/constants/themeStylesConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    additionalCharges: {
      color: theme.palette.info.main,
      letterSpacing: '0.02rem',
      fontSize: '1rem',
      fontWeight: 'normal',
      lineHeight: '1.5rem',
    },
    addtionalChargeBtn: {
      color: theme.palette.primary.main,
      backgroundColor: SECONDRARY_BACKGROUND_COLOR,
      fontSize: '1.25rem',
      padding: 0,
    },
    addtionalChargeBtnLabel: {
      padding: 0,
    },
    addAmountBtn: {
      padding: 0,
      color: theme.palette.info.main,
    },
  })
);
export default useStyles;
