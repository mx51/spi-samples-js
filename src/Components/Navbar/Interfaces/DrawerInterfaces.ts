export interface MenuItemInterface {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface MenuItemsInterface {
  menuItems: MenuItemInterface[];
}
