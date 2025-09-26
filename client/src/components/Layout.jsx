import BaseLayout from './BaseLayout';
import UserSidebar from './UserSidebar';
import ClientSidebar from './ClientSidebar';

const Layout = ({ userType = 'user', children }) => {
  const sidebarComponent = userType === 'user' ? <UserSidebar /> : <ClientSidebar />;
  
  return (
    <BaseLayout showSidebar={true} sidebarComponent={sidebarComponent}>
      {children}
    </BaseLayout>
  );
};

export default Layout;

// For pages that only need navbar without sidebar
export { BaseLayout };