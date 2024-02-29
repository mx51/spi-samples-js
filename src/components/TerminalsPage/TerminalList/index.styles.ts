import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  CHIP_BACKGROUND_FAILURE_COLOR,
  CHIP_BACKGROUND_PENDING_COLOR,
  CHIP_BACKGROUND_SUCCESS_COLOR,
  CHIP_FONT_FAILURE_COLOR,
  CHIP_FONT_PENDING_COLOR,
  CHIP_FONT_SUCCESS_COLOR,
} from '../../../definitions/constants/themeStylesConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      marginTop: theme.spacing(2),
    },
    chipConnected: {
      background: `${CHIP_BACKGROUND_SUCCESS_COLOR}`,
      color: `${CHIP_FONT_SUCCESS_COLOR}`,
    },
    chipPending: {
      background: `${CHIP_BACKGROUND_PENDING_COLOR}`,
      color: `${CHIP_FONT_PENDING_COLOR}`,
    },
    chipUnpaired: {
      background: `${CHIP_BACKGROUND_FAILURE_COLOR}`,
      color: `${CHIP_FONT_FAILURE_COLOR}`,
    },
    link: {
      textDecoration: 'none',
      cursor: 'pointer',
    },
    unclickable: {
      pointerEvents: 'none',
    },
  })
);

export default useStyles;
