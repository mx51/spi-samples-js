import { makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { FONT_COLOR } from '../../../definitions/constants/themeStylesConfigs';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dividerLabel: {
      marginTop: theme.spacing(4.5),
      marginBottom: theme.spacing(0.5),
      color: FONT_COLOR,
    },
    divider: {
      marginBottom: theme.spacing(2),
    },
  })
);
