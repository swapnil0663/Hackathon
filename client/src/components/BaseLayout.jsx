import Navbar from './Navbar';

const BaseLayout = ({ children, showSidebar = false, sidebarComponent = null }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <div className="flex">
        {showSidebar && sidebarComponent}
        <main className={`flex-1 ${showSidebar ? '' : 'p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;