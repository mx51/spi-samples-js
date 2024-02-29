import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useCustomContentPanelStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainer: {
      display: 'flex',
      width: '100%',
    },
    receiptGrid: {
      height: '100%',
      width: '100%',
    },
    buttonGrid: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      width: '100%',
    },
    button: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
    box: {
      display: 'flex',
      height: '100%',
      width: 'max-content',
    },
  })
);
