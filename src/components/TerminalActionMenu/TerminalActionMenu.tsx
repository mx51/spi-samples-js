import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as MoreverticalIcon } from '../../images/MoreVerticalcon.svg';
import { useAppDispatch } from '../../redux/hooks';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { handleRemoveClick, handleUnPairClick } from '../../utils/common/pair/pairStatusHelpers';
import { PATH_PAIR, PATH_TERMINALS } from '../../definitions/constants/routerConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuPaper: {
      border: 'none',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(2),
      boxShadow: `0px 16px 40px -8px ${theme.palette.secondary.main}`,
    },
    subHeading: {
      marginLeft: 16,
      fontWeight: 500,
      letterSpacing: 1,
      color: theme.palette.secondary.dark,
      marginBottom: 8,
    },
    separator: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  })
);

const TerminalActionMenu: React.FC<{ terminal: ITerminalProps }> = ({ terminal }: { terminal: ITerminalProps }) => {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const classes = useStyles();
  const open = Boolean(anchorEl);
  const history = useHistory();

  const goToTerminalDetails = (path: string) => {
    history.push(path);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnpair = () => {
    handleUnPairClick(dispatch, terminal.id);
    handleClose();
  };

  const handleRemove = () => {
    handleRemoveClick(dispatch, terminal.id);
    handleClose();
  };

  const handlePair = () => {
    goToTerminalDetails(`${PATH_PAIR}/${terminal.serialNumber}`);
  };
  const handleAbout = () => {
    goToTerminalDetails(`${PATH_TERMINALS}/${terminal.serialNumber}`);
  };
  return (
    <div key={`terminal-menu-${terminal.serialNumber}`}>
      <IconButton
        id={`terminal-action-button-${terminal.serialNumber}`}
        data-testid={`terminal-action-button-${terminal.serialNumber}`}
        onClick={handleClick}
        aria-label="menu"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreverticalIcon />
      </IconButton>
      <Menu
        classes={{ paper: classes.menuPaper }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Typography variant="subtitle2" className={classes.subHeading}>
          ACTIONS
        </Typography>

        {terminal.status === 'Unpaired' && <MenuItem onClick={handlePair}>Pair terminal</MenuItem>}
        {terminal.status === 'Unpaired' && <MenuItem onClick={handleRemove}>Remove this terminal</MenuItem>}
        {['PairedConnected', 'PairedConnecting'].includes(terminal.status) && (
          <MenuItem onClick={handleUnpair}>Unpair terminal</MenuItem>
        )}
        <hr className={classes.separator} />
        <MenuItem onClick={handleAbout}>About this terminal</MenuItem>
      </Menu>
    </div>
  );
};

export default TerminalActionMenu;
