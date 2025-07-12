import React from "react";
import Footer from "./Footer";
import Header from "./Header";
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className=" mx-auto bg-white dark:bg-gray-900  shadow-md p-1">
        <div className="">{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
