import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Settings,
  Globe,
  Menu,
  X,
  Package,
  MapPin,
  Users,
  LogOut
} from 'lucide-react';
import BookingPanel from '@/components/BookingPanel';
import AddressFormsTable from '@/components/office/AddressFormsTable';
import PincodeManagement from '@/components/office/PincodeManagement';
import { useToast } from '@/hooks/use-toast';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

interface OfficeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    dashboard: boolean;
    booking: boolean;
    reports: boolean;
    settings: boolean;
    pincodeManagement: boolean;
    addressForms: boolean;
  };
  department?: string;
}

const OfficeDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<OfficeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Get user info from localStorage and refresh from server
  useEffect(() => {
    const loadUserData = async () => {
      const userData = localStorage.getItem('officeUser');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Refresh user data from server to get latest permissions
      await refreshUserData();
      setIsLoading(false);
    };
    
    loadUserData();
  }, []);

  // Periodically refresh user data to ensure permissions are up-to-date
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUserData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to refresh user data from server
  const refreshUserData = async () => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem('officeToken');
      if (!token) return;

      const response = await fetch('/api/office/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem('officeUser', JSON.stringify(userData.user));
      } else if (response.status === 401) {
        // Token expired
        localStorage.removeItem('officeToken');
        localStorage.removeItem('officeUser');
        window.location.href = '/office';
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'dashboard' },
    { id: 'booking', label: 'Booking', icon: Package, permission: 'booking' },
    { id: 'reports', label: 'Reports', icon: FileText, permission: 'reports' },
    { id: 'addressforms', label: 'Address Forms', icon: Users, permission: 'addressForms' },
    { id: 'pincodes', label: 'Pincode Management', icon: MapPin, permission: 'pincodeManagement' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'settings' }
  ];

  // Filter navigation items based on user permissions
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.permission) return true;
    return user?.permissions?.[item.permission as keyof typeof user.permissions];
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Refresh user data when navigating to permission-protected sections
  const handleNavigation = async (itemId: string) => {
    setActiveItem(itemId);
    
    // If navigating to a permission-protected section, refresh user data
    if (itemId === 'addressforms' || itemId === 'pincodes') {
      await refreshUserData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('officeToken');
    localStorage.removeItem('officeUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    window.location.href = '/office';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#E9F4F4] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#315750] mx-auto mb-4"></div>
          <p className="text-[#315750]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#E9F4F4]">
      {/* Fixed Sidebar */}
      <motion.div 
        className="fixed left-0 top-0 h-full bg-[#315750] flex flex-col transition-all duration-300 ease-in-out z-50"
        animate={{ width: sidebarCollapsed ? '80px' : '220px' }}
        initial={{ width: '220px' }}
      >
        {/* Toggle Button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-[#3d6b5f] hover:bg-[#4a7a6a] text-white transition-colors duration-200"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
            </div>
            
        {/* User Profile Header */}
        <div className="p-4 flex justify-center">
          <div className="relative">
            <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-full border-2 border-yellow-400 overflow-hidden bg-gray-300 transition-all duration-300`}>
              {/* Placeholder for user image - will be replaced with company logo */}
              <img 
                src="/api/placeholder/64/64" 
                alt="User Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold">U</div>';
                }}
              />
            </div>
          </div>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && user && (
          <div className="px-4 mb-4">
            <div className="bg-white/20 rounded-lg p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs opacity-80">{user.email}</p>
                  {user.department && (
                    <p className="text-xs opacity-60">{user.department}</p>
                  )}
                </div>
                {isRefreshing && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {filteredNavigationItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center transition-all duration-300 relative z-10 rounded-lg ${
                    sidebarCollapsed 
                      ? 'px-3 py-3 justify-center' 
                      : 'px-4 py-3'
                  } ${
                    activeItem === item.id 
                      ? 'text-gray-800' 
                      : 'text-gray-300 hover:text-white hover:bg-[#3d6b5f]'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium whitespace-nowrap overflow-hidden">{item.label}</span>
                  )}
                </button>

                {/* Active State with Curved Design */}
                {activeItem === item.id && !sidebarCollapsed && (
                  <>
                    {/* Main active background */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0 bg-[#E9F4F4] rounded-l-full"
                      style={{
                        right: '-24px', // Extend into main content area
                      }}
                    />
                    
                    {/* Top curved cutout */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="absolute -top-6 right-0 w-6 h-6 bg-[#315750]"
                      style={{
                        borderBottomRightRadius: '24px',
                        boxShadow: '6px 6px 0 0 #E9F4F4'
                      }}
                    />
                    
                    {/* Bottom curved cutout */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="absolute -bottom-6 right-0 w-6 h-6 bg-[#315750]"
                      style={{
                        borderTopRightRadius: '24px',
                        boxShadow: '6px -6px 0 0 #E9F4F4'
                      }}
                    />
                  </>
                )}

                {/* Simple active state for collapsed sidebar */}
                {activeItem === item.id && sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-[#3d6b5f] rounded-lg"
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center transition-all duration-300 relative z-10 rounded-lg ${
              sidebarCollapsed 
                ? 'px-3 py-3 justify-center' 
                : 'px-4 py-3'
            } text-red-300 hover:text-red-200 hover:bg-red-600/20`}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
            {!sidebarCollapsed && (
              <span className="font-medium whitespace-nowrap overflow-hidden">Logout</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 p-8 transition-all duration-300"
        animate={{ marginLeft: sidebarCollapsed ? '80px' : '220px' }}
        initial={{ marginLeft: '220px' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Content based on active navigation item */}
          {activeItem === 'booking' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BookingPanel />
            </motion.div>
          )}

          {activeItem === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dashboard content cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Shipments</h3>
                  <p className="text-3xl font-bold text-blue-600">1,247</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Routes</h3>
                  <p className="text-3xl font-bold text-green-600">89</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Deliveries</h3>
                  <p className="text-3xl font-bold text-orange-600">156</p>
                </div>
              </div>
        </motion.div>
          )}

          {activeItem === 'reports' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Performance Report</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Delivery Success Rate</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Average Delivery Time</span>
                    <span className="font-semibold text-blue-600">2.3 days</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold text-purple-600">4.8/5.0</span>
                  </div>
                </div>
              </div>
        </motion.div>
          )}

          {activeItem === 'addressforms' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Address Forms</h1>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-1">
                <AddressFormsTable />
              </div>
            </motion.div>
          )}

          {activeItem === 'pincodes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Pincode Management</h1>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-1">
                <PincodeManagement />
              </div>
            </motion.div>
          )}

          {activeItem === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-700 mb-6">System Configuration</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Shipping Method
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Express Delivery</option>
                      <option>Standard Delivery</option>
                      <option>Economy Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Preferences
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-gray-600">Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-gray-600">SMS alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-600">Push notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
        </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OfficeDashboard;