import Navbar from './Navbar';

const BaseLayout = ({ children, showSidebar = false, sidebarComponent = null }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="flex pt-16">
        {showSidebar && sidebarComponent}
        <main className={`flex-1 ${showSidebar ? 'ml-64' : 'p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;