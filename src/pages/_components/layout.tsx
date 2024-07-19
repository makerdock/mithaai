import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main className="-mt-[100px]">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
