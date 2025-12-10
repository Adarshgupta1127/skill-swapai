import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Matches', icon: Users },
    { path: '/profile', label: 'My Profile', icon: User },
    // In a real app, /chat would list active conversations. 
    // Here we'll treat the match list as the entry to chat.
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar / Mobile Bottom Bar */}
      <nav className="bg-white border-r border-gray-200 md:w-64 md:flex-col flex justify-between md:justify-start fixed md:relative bottom-0 w-full z-10 md:h-screen shadow-lg md:shadow-none p-4">
        <div className="hidden md:flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="text-xl font-bold text-gray-800">SkillSwap</span>
        </div>

        <div className="flex md:flex-col w-full justify-around md:justify-start gap-1 md:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-brand-50 text-brand-600 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-6 h-6 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm mt-1 md:mt-0">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:block mt-auto pt-6 border-t border-gray-100">
           <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 w-full rounded-xl transition-colors">
             <LogOut className="w-5 h-5" />
             <span className="text-sm">Log Out</span>
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};