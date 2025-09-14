import React from 'react';
//import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* <Navbar /> */}
      <main className="px-32 py-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
