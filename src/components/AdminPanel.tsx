import React, { useState } from 'react';
import { Shield, Users, MessageSquare, Ban, UserCheck, Download, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function AdminPanel() {
  const { state, dispatch } = useApp();
  const { users, swapRequests, ratings } = state;
  const [activeTab, setActiveTab] = useState<'users' | 'swaps' | 'reports'>('users');

  const totalUsers = users.filter(u => !u.isAdmin).length;
  const bannedUsers = users.filter(u => u.isBanned).length;
  const activeSwaps = swapRequests.filter(r => r.status === 'accepted').length;
  const pendingSwaps = swapRequests.filter(r => r.status === 'pending').length;

  const handleBanUser = (userId: string) => {
    dispatch({ type: 'BAN_USER', payload: userId });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `ban-${userId}`,
        type: 'warning',
        title: 'User Banned',
        message: 'User has been banned from the platform',
        timestamp: new Date().toISOString()
      }
    });
  };

  const handleUnbanUser = (userId: string) => {
    dispatch({ type: 'UNBAN_USER', payload: userId });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `unban-${userId}`,
        type: 'info',
        title: 'User Unbanned',
        message: 'User access has been restored',
        timestamp: new Date().toISOString()
      }
    });
  };

  const downloadReport = (type: string) => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = users.filter(u => !u.isAdmin).map(u => ({
          name: u.name,
          email: u.email,
          location: u.location || 'Not specified',
          skillsOffered: u.skillsOffered.join(', '),
          skillsWanted: u.skillsWanted.join(', '),
          rating: u.rating,
          totalSwaps: u.totalSwaps,
          joinedDate: u.joinedDate,
          isPublic: u.isPublic,
          isBanned: u.isBanned || false
        }));
        filename = 'users-report.json';
        break;
      case 'swaps':
        data = swapRequests.map(r => ({
          id: r.id,
          fromUser: users.find(u => u.id === r.fromUserId)?.name || 'Unknown',
          toUser: users.find(u => u.id === r.toUserId)?.name || 'Unknown',
          skillOffered: r.skillOffered,
          skillWanted: r.skillWanted,
          status: r.status,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt
        }));
        filename = 'swaps-report.json';
        break;
      case 'ratings':
        data = ratings.map(r => ({
          id: r.id,
          fromUser: users.find(u => u.id === r.fromUserId)?.name || 'Unknown',
          toUser: users.find(u => u.id === r.toUserId)?.name || 'Unknown',
          rating: r.rating,
          feedback: r.feedback,
          createdAt: r.createdAt
        }));
        filename = 'ratings-report.json';
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Banned Users',
      value: bannedUsers.toString(),
      icon: Ban,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Active Swaps',
      value: activeSwaps.toString(),
      icon: MessageSquare,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Pending Swaps',
      value: pendingSwaps.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">
          Monitor platform activity, manage users, and generate reports.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('swaps')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'swaps'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Swap Monitoring
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reports & Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.filter(u => !u.isAdmin).map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.profilePhoto ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profilePhoto}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.skillsOffered.length + user.skillsWanted.length} skills
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.totalSwaps} swaps completed
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.rating.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isBanned
                          ? 'bg-red-100 text-red-800'
                          : user.isPublic
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isBanned ? 'Banned' : user.isPublic ? 'Active' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.isBanned ? (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          className="text-emerald-600 hover:text-emerald-900 flex items-center space-x-1"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>Unban</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <Ban className="h-4 w-4" />
                          <span>Ban</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'swaps' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Swap Activity Monitoring</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills Exchange
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {swapRequests.slice(0, 10).map((request) => {
                  const fromUser = users.find(u => u.id === request.fromUserId);
                  const toUser = users.find(u => u.id === request.toUserId);
                  
                  return (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {fromUser?.name} → {toUser?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {request.skillOffered} ↔ {request.skillWanted}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : request.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : request.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Download Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => downloadReport('users')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Users Report</span>
              </button>
              <button
                onClick={() => downloadReport('swaps')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Swaps Report</span>
              </button>
              <button
                onClick={() => downloadReport('ratings')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Ratings Report</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round((swapRequests.filter(r => r.status === 'completed').length / Math.max(swapRequests.length, 1)) * 100)}%
                </div>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {users.filter(u => !u.isAdmin && u.isPublic).length}
                </div>
                <p className="text-sm text-gray-600">Public Profiles</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : '0.0'}
                </div>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}