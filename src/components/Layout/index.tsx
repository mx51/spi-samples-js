import React from 'react';
// component
import Navbar from '../Navbar';

type ChildrenType = {
  children: React.ReactNode;
};

function Layout({ children }: ChildrenType): React.ReactElement {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
