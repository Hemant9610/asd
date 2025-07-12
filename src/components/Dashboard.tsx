import React from 'react';
import { TrendingUp, Users, Calendar, Star, ArrowRight, Bell } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SkillBadge } from './SkillBadge';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const { state } = useApp();
  const { currentUser, swapRequests, ratings } = state;

  if (!currentUser) return null;

  const userSwapRequests = swapRequests.filter(
    request => request.fromUserId === currentUser.id || request.toUserId === currentUser.id
  );

  const pendingRequests = userSwapRequests.filter(request => request.status === 'pending');
  const activeSwaps = userSwapRequests.filter(request => request.status === 'accepted');
  const completedSwaps = userSwapRequests.filter(request => request.status === 'completed');

  const userRatings = ratings.filter(rating => rating.toUserId === currentUser.id);
  const averageRating = userRatings.length > 0 
    ? userRatings.reduce((sum, rating) => sum + rating.rating, 0) / userRatings.length 
    : 0;

  const stats = [
    {
      title: 'Total Swaps',
      value: completedSwaps.length.toString(),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Active Swaps',
      value: activeSwaps.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Requests',
      value: pendingRequests.length.toString(),
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-gray-600">
          Manage your skills, track your swaps, and discover new learning opportunities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => onViewChange('browse')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors group"
            >
              <span className="font-medium text-gray-900">Find People to Swap With</span>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
            <button
              onClick={() => onViewChange('profile')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg hover:from-emerald-100 hover:to-blue-100 transition-colors group"
            >
              <span className="font-medium text-gray-900">Update My Skills</span>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
            <button
              onClick={() => onViewChange('requests')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:from-orange-100 hover:to-red-100 transition-colors group"
            >
              <span className="font-medium text-gray-900">View My Swap Requests</span>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {pendingRequests.slice(0, 3).map((request) => {
              const otherUser = state.users.find(u => 
                u.id === (request.fromUserId === currentUser.id ? request.toUserId : request.fromUserId)
              );
              
              return (
                <div key={request.id} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request.fromUserId === currentUser.id 
                        ? `Waiting for ${otherUser?.name} to respond`
                        : `${otherUser?.name} wants to swap`
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.skillOffered} ↔ {request.skillWanted}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {pendingRequests.length === 0 && (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Skills I Offer</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.skillsOffered.map((skill) => (
                <SkillBadge key={skill} skill={skill} type="offered" />
              ))}
              {currentUser.skillsOffered.length === 0 && (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Skills I Want</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.skillsWanted.map((skill) => (
                <SkillBadge key={skill} skill={skill} type="wanted" />
              ))}
              {currentUser.skillsWanted.length === 0 && (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}