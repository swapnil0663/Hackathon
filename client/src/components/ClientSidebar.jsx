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
    <div className="w-64 bg-slate-800/50 border-r border-slate-700 h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Admin Panel</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ClientSidebar;