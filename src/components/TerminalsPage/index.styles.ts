import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    manageFleetSettingLink: {
      marginRight: theme.spacing(2),
      fontSize: '1rem',
    },
    manageFleetSetting: {
      padding: theme.spacing(1),
    },
    tabs: {
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      position: 'sticky',
      top: theme.spacing(6),
      zIndex: 1,
    },
    counterWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    counterLabel: {
      whiteSpace: 'nowrap',
    },
    counterCount: {
      fontSize: '0.75rem',
      lineHeight: '1.125rem',
    },
    counter: {
      backgroundColor: theme.palette.secondary.main,
      width: '24px',
      height: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '16px',
    },
  })
);
export default useStyles;
