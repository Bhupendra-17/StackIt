const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-slate-700/60 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-center text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>StackIt · Collaborative Q&A built for smooth developer workflows.</p>
        <p>© {new Date().getFullYear()} StackIt</p>
      </div>
    </footer>
  );
};

export default Footer;

