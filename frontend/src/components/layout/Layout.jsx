import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen app-bg app-page-grid text-slate-100">
      <Header />
      <main className="relative z-10 w-full px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

