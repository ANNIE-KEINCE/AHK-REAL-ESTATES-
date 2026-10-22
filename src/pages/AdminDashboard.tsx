import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  LayoutDashboard, 
  Home, 
  Bell, 
  Mail, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

// Admin Sub-pages (I will create these next)
import AdminProperties from './admin/AdminProperties';
import AdminUpdates from './admin/AdminUpdates';
import AdminEnquiries from './admin/AdminEnquiries';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { name: 'Properties', path: '/admin/dashboard', icon: <Home size={20} /> },
    { name: 'Updates', path: '/admin/dashboard/updates', icon: <Bell size={20} /> },
    { name: 'Enquiries', path: '/admin/dashboard/enquiries', icon: <Mail size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
        <span className="font-bold text-lg">AHK Admin</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out
      `}>
        <div className="p-6">
          <div className="flex items-center gap-2 text-white mb-8">
            <LayoutDashboard className="text-blue-400" size={24} />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path) 
                    ? 'bg-blue-700 text-white font-semibold' 
                    : 'hover:bg-slate-800 hover:text-white'}
                `}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminProperties />} />
            <Route path="/updates" element={<AdminUpdates />} />
            <Route path="/enquiries" element={<AdminEnquiries />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
