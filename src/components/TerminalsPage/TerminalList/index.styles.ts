import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  CHIP_BACKGROUND_SUCCESS_COLOR,
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
  })
);

export default useStyles;
