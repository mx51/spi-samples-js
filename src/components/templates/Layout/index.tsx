import React from 'react';
// component
import Navbar from '../Navbar';

const Layout: React.FC = ({ children }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

export default Layout;
