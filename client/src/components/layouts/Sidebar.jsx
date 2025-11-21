import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Mes Projets', icon: '📁' },
    { path: '/tasks', label: 'Mes Tâches', icon: '✓' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/enterprises', label: 'Entreprises', icon: '🏢' },
  ];

  return (
    <aside className="bg-white w-64 min-h-screen p-4 border-r border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary-600">MyMind</h2>
        <p className="text-xs text-secondary-500">Task Manager</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-secondary-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="px-4 py-2 text-xs text-secondary-500">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

