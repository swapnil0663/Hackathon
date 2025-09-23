import { Users, FileText, BarChart3, Settings, Shield, MessageSquare } from 'lucide-react';

const ClientSidebar = () => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: FileText, label: 'All Complaints', active: false },
    { icon: Users, label: 'User Management', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
    { icon: Shield, label: 'Security', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 h-screen shadow-lg fixed left-0 top-16 z-10">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Panel</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>
        
        <nav className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  item.active 
                    ? 'bg-white text-indigo-700 border border-indigo-200 shadow-md' 
                    : 'text-gray-700 hover:bg-white hover:text-gray-800 hover:shadow-md hover:border hover:border-gray-200'
                }`}
              >
                <Icon size={20} className={item.active ? 'text-indigo-600' : 'text-gray-600 group-hover:text-gray-700'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ClientSidebar;