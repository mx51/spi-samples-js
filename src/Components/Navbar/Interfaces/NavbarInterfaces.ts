import React from 'react';

export interface DrawerPositionInterface {
  left: boolean;
}

export interface DrawerListInterface {
  toggleDrawer: () => void;
}

export interface NavbarHeaderInterface {
  handleToggleDrawer: () => void;
  icon: React.ReactNode;
}
