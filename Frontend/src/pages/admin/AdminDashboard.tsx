import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  FileText, 
  MapPin, 
  LogOut, 
  BarChart3, 
  Settings,
  Shield,
  Activity,
  UserCog
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddressFormsTable from "@/components/admin/AddressFormsTable";
import PincodeManagement from "@/components/admin/PincodeManagement";
import UserManagement from "@/components/admin/UserManagement";


interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

interface DashboardStats {
  forms: {
    total: number;
    completed: number;
    incomplete: number;
    completionRate: number;
  };
  pincodes: {
    total: number;
    states: number;
    cities: number;
  };
  recent: {
    forms: any[];
    topStates: any[];
  };
}

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const storedAdminInfo = localStorage.getItem('adminInfo');
    
    if (!token || !storedAdminInfo) {
      navigate('/admin');
      return;
    }
    
    try {
      setAdminInfo(JSON.parse(storedAdminInfo));
    } catch (error) {
      console.error('Error parsing admin info:', error);
      navigate('/admin');
      return;
    }
    
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else if (response.status === 401) {
        // Token expired or invalid
        handleLogout();
        return;
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Network error while loading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex">
        {/* Fixed Vertical Sidebar */}
        <div className="fixed left-0 top-0 w-64 h-screen bg-white/80 backdrop-blur-sm shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-6 bg-white/90 backdrop-blur-md shadow-lg flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-xs text-gray-600">OCL Management</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable if needed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-white/60 hover:shadow-md'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('addressforms')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'addressforms'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-white/60 hover:shadow-md'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Address Forms</span>
            </button>
            
            <button
              onClick={() => setActiveTab('pincodes')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'pincodes'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-white/60 hover:shadow-md'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Pincode Management</span>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-white/60 hover:shadow-md'
              }`}
            >
              <UserCog className="h-5 w-5" />
              <span className="font-medium">User Management</span>
            </button>
          </div>

          {/* Admin Info - Fixed at bottom */}
          <div className="flex-shrink-0 p-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">{adminInfo?.name}</p>
                <p className="text-xs text-gray-600 mb-2">{adminInfo?.email}</p>
                <Badge 
                  variant={adminInfo?.role === 'super_admin' ? 'default' : 'secondary'}
                  className="mb-3"
                >
                  {adminInfo?.role}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full bg-white/80 hover:bg-white shadow-md"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with left margin for fixed sidebar */}
        <div className="flex-1 ml-64 min-h-screen overflow-y-auto">
          <div className="p-6 pr-20">
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50/80 backdrop-blur-sm shadow-lg border-0">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {stats && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Total Forms</h3>
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-2">{stats.forms.total}</div>
                      <p className="text-sm text-gray-500">
                        {stats.forms.completionRate}% completion rate
                      </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Completed Forms</h3>
                        <div className="p-2 bg-green-100 rounded-xl">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">{stats.forms.completed}</div>
                      <p className="text-sm text-gray-500">
                        Ready for processing
                      </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Incomplete Forms</h3>
                        <div className="p-2 bg-orange-100 rounded-xl">
                          <Settings className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">{stats.forms.incomplete}</div>
                      <p className="text-sm text-gray-500">
                        Require attention
                      </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Pincodes</h3>
                        <div className="p-2 bg-purple-100 rounded-xl">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-2">{stats.pincodes.total}</div>
                      <p className="text-sm text-gray-500">
                        {stats.pincodes.states} states, {stats.pincodes.cities} cities
                      </p>
                    </div>
                  </div>

                  {/* Recent Forms */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Recent Forms</h3>
                        <p className="text-sm text-gray-600">Latest form submissions</p>
                      </div>
                      <div className="space-y-4">
                        {stats.recent.forms.map((form, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-800">{form.senderName}</p>
                              <p className="text-xs text-gray-600">{form.senderEmail}</p>
                              {form.receiverName && (
                                <p className="text-xs text-gray-500">→ {form.receiverName}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={form.formCompleted ? 'default' : 'secondary'}
                                className="shadow-sm"
                              >
                                {form.formCompleted ? 'Complete' : 'Incomplete'}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(form.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Top States</h3>
                        <p className="text-sm text-gray-600">Most active states by form submissions</p>
                      </div>
                      <div className="space-y-3">
                        {stats.recent.topStates.map((state, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                                {index + 1}
                              </div>
                              <span className="font-semibold text-gray-800">{state._id}</span>
                            </div>
                            <Badge variant="outline" className="shadow-sm">{state.count} forms</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'addressforms' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-1">
              <AddressFormsTable />
            </div>
          )}

          {activeTab === 'pincodes' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-1">
              <PincodeManagement />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <UserManagement />
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
