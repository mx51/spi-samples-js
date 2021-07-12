import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

interface NavbarHeaderInterface {
  handleToggleDrawer: () => void;
  icon: React.ReactNode;
}

interface IconButtonInterface {
  'aria-label'?: string;
  color?: 'default' | 'inherit' | 'primary' | 'secondary';
  edge?: 'end' | 'start' | undefined;
}

const NavbarHeader: React.FC<NavbarHeaderInterface> = ({ handleToggleDrawer, icon }) => {
  const classes = useStyles();

  const IconButtonProps: IconButtonInterface = {
    'aria-label': 'menu',
    color: 'inherit',
    edge: 'start',
  };

  return (
    <Toolbar variant="dense">
      <IconButton className={classes.menuButton} {...IconButtonProps} onClick={handleToggleDrawer}>
        <MenuIcon />
      </IconButton>
      {icon}
    </Toolbar>
  );
};

export default NavbarHeader;
