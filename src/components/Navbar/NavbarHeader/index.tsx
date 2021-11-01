import React from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { useLocation } from 'react-router-dom';
import { PATH_PAIR, PATH_PURCHASE, PATH_TERMINALS } from '../../../definitions/constants/routerConfigs';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { toggleFlowPanel } from '../../../redux/reducers/CommonSlice/commonSlice';
import { INavbarHeader } from '../interfaces/NavbarInterfaces';
import useStyles from './index.styles';

function NavbarHeader({ handleToggleDrawer, icon, isDevelopModeShown }: INavbarHeader): React.ReactElement {
  const classes = useStyles();
  const commonSlice = useAppSelector((state) => state.common);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const isSpecificRoute = pathname === PATH_PURCHASE || pathname === PATH_PAIR || pathname.includes(PATH_TERMINALS);

  const handleFlowPanelSwitch = () => {
    dispatch(toggleFlowPanel(!commonSlice.showFlowPanel));
  };

  return (
    <Toolbar variant="dense">
      <Box className={classes.navbar} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <IconButton
            data-test-id="navbarMenuIcon"
            className={classes.menuButton}
            color="inherit"
            edge="start"
            onClick={handleToggleDrawer}
            name="menuIcon"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          {icon}
        </Box>
        {isDevelopModeShown && ( // ensure not showing developer mode when opening side navbar
          <Box display="flex" alignItems="center">
            <Typography className={classes.developerModeText}>Developer mode</Typography>
            <Switch
              data-test-id="developerModeSwitch"
              checked={commonSlice.showFlowPanel}
              name="developerModeSwitch"
              onChange={handleFlowPanelSwitch}
              disabled={!isSpecificRoute}
            />
          </Box>
        )}
      </Box>
    </Toolbar>
  );
}

export default NavbarHeader;
