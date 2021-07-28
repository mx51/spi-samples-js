export interface IMenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface IMenuItems {
  menuItems: IMenuItem[];
}
