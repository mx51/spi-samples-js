export interface IDrawerPosition {
  left: boolean;
}

export interface IDrawerList {
  toggleDrawer: () => void;
}

export interface INavbarHeader {
  handleToggleDrawer: () => void;
  icon: React.ReactNode;
  isDevelopModeShown: boolean;
}
