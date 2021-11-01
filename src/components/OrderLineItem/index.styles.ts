import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { SECONDRARY_BACKGROUND_COLOR } from '../../definitions/constants/themeStylesConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    additionalChargesEnable: {
      color: theme.palette.info.main,
    },
    additionalChargesDisable: {
      color: theme.palette.primary.main,
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
