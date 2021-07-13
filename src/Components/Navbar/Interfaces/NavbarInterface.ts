import React, { KeyboardEvent, MouseEvent } from 'react';

export interface DrawerPositionInterface {
  left: boolean;
}

export interface DrawerListInterface {
  toggleDrawer: (event: KeyboardEvent | MouseEvent) => void;
}

export interface NavbarHeaderInterface {
  handleToggleDrawer: (event: KeyboardEvent | MouseEvent) => void;
  icon: React.ReactNode;
}

export interface IconButtonInterface {
  'aria-label'?: string;
  color?: 'default' | 'inherit' | 'primary' | 'secondary';
  edge?: 'end' | 'start' | undefined;
}
