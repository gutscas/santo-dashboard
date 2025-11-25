import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  User,
  BarChart3,
  Users,
  MessageSquare,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import eagle1 from "../../assets/eagle1.png";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);
  const [activeItem, setActiveItem] = useState(location.pathname.substring(1) || 'dashboard');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'profile', name: 'Profile', path: '/profile', icon: User },
    { id: 'analytics', name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { id: 'users', name: 'Users', path: '/users', icon: Users },
    { id: 'messages', name: 'Messages', path: '/messages', icon: MessageSquare },
    { id: 'notifications', name: 'Notifications', path: '/notifications', icon: Bell },
    { id: 'reports', name: 'Reports', path: '/reports', icon: FileText },
    { id: 'settings', name: 'Settings', path: '/settings', icon: Settings },
    { id: 'help', name: 'Help', path: '/help', icon: HelpCircle },
  ];

  const handleNavigation = (item) => {
    setActiveItem(item.id);
    navigate(item.path);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0 flex flex-col ${theme === "dark" ? "bg-gray-800" : "bg-gradient-to-b from-pink-600 to-purple-800"
        }`}
    >
      <div className="flex-1">
        {/* Logo */}
       <div className='grid  items-center justify-center'>
         <div className="  w-fit">
          <img src={eagle1} alt="Logo" className="w-32 h-32 object-contain" />
          {/* <h1 className="text-2xl font-bold text-white text-center mb-3">Inspire</h1> */}
        </div>
       </div>

        {/* Navigation */}
        <nav className="grid grid-cols-1 gap-3 px-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`cursor-pointer text-md font-bold w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 mb-1 ${location.pathname === item.path
                    ? theme === "dark"
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/30 text-white font-semibold'
                    : theme === "dark"
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-white/90 hover:text-white hover:bg-white/20'
                  }`}
              >
                <Icon size={25} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-white/20"}`}>
        <button
          onClick={() => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className={`cursor-pointer w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${theme === "dark" ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" : "text-white hover:bg-white/20"
            }`}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;