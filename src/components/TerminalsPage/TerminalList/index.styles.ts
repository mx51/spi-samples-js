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
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    tableHeading: {
      marginTop: theme.spacing(2),
      fontWeight: 600,
      fontSize: '1.125rem',
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      borderBottom: 'none',
      width: '100%',
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
