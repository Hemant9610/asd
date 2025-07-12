import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Trash2, Star, User, MessageSquare } from 'lucide-react';
import { SwapRequest } from '../types';
import { SkillBadge } from './SkillBadge';
import { mockUsers, mockSwapRequests } from '../data/mockData';

export function SwapRequests() {
  // Use mock data for now
  const currentUser = mockUsers[0];
  const swapRequests = mockSwapRequests;
  const users = mockUsers;
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'completed'>('received');

  if (!currentUser) return null;

  const receivedRequests = swapRequests.filter(
    request => request.toUserId === currentUser.id && request.status === 'pending'
  );

  const sentRequests = swapRequests.filter(
    request => request.fromUserId === currentUser.id && request.status === 'pending'
  );

  const completedSwaps = swapRequests.filter(
    request => 
      (request.fromUserId === currentUser.id || request.toUserId === currentUser.id) &&
      (request.status === 'accepted' || request.status === 'completed')
  );

  const handleAcceptRequest = (requestId: string) => {
    // TODO: Implement with Supabase
    console.log('Accepting request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // TODO: Implement with Supabase
    console.log('Rejecting request:', requestId);
  };

  const handleDeleteRequest = (requestId: string) => {
    // TODO: Implement with Supabase
    console.log('Deleting request:', requestId);
  };

  const handleCompleteSwap = (requestId: string) => {
    // TODO: Implement with Supabase
    console.log('Completing swap:', requestId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOtherUser = (request: SwapRequest) => {
    const otherUserId = request.fromUserId === currentUser.id ? request.toUserId : request.fromUserId;
    return users.find(u => u.id === otherUserId);
  };

  const renderRequestCard = (request: SwapRequest, isReceived: boolean) => {
    const otherUser = getOtherUser(request);
    if (!otherUser) return null;

    return (
      <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {otherUser.profilePhoto ? (
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={otherUser.profilePhoto}
                alt={otherUser.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">{otherUser.location}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
        </div>

        {/* Skill Swap */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">
                {isReceived ? 'They offer' : 'You offer'}
              </p>
              <SkillBadge skill={request.skillOffered} type="offered" />
            </div>
            <span className="text-gray-400">↔</span>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">
                {isReceived ? 'You offer' : 'They offer'}
              </p>
              <SkillBadge skill={request.skillWanted} type="wanted" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Message</span>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {request.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {isReceived && request.status === 'pending' && (
            <>
              <button
                onClick={() => handleAcceptRequest(request.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <XCircle className="h-4 w-4" />
                <span>Decline</span>
              </button>
            </>
          )}

          {!isReceived && request.status === 'pending' && (
            <button
              onClick={() => handleDeleteRequest(request.id)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Cancel Request</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCompletedSwap = (request: SwapRequest) => {
    const otherUser = getOtherUser(request);
    if (!otherUser) return null;

    const isRequester = request.fromUserId === currentUser.id;

    return (
      <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {otherUser.profilePhoto ? (
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={otherUser.profilePhoto}
                alt={otherUser.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {request.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500">{formatDate(request.updatedAt)}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">
                {isRequester ? 'You offered' : 'They offered'}
              </p>
              <SkillBadge skill={request.skillOffered} type="offered" />
            </div>
            <span className="text-gray-400">↔</span>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">
                {isRequester ? 'You learned' : 'They learned'}
              </p>
              <SkillBadge skill={request.skillWanted} type="wanted" />
            </div>
          </div>
        </div>

        {request.status === 'accepted' && (
          <button
            onClick={() => handleCompleteSwap(request.id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as Completed</span>
          </button>
        )}

        {request.status === 'completed' && (
          <div className="bg-emerald-50 rounded-lg p-3 flex items-center justify-center space-x-2">
            <Star className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-800 font-medium">Swap Completed Successfully!</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swap Requests</h1>
        <p className="text-gray-600">
          Manage your incoming and outgoing skill swap requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Received ({receivedRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Sent ({sentRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Active & Completed ({completedSwaps.length})</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'received' && (
          <>
            {receivedRequests.length > 0 ? (
              receivedRequests.map(request => renderRequestCard(request, true))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-500">You don't have any incoming swap requests yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentRequests.length > 0 ? (
              sentRequests.map(request => renderRequestCard(request, false))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                <p className="text-gray-500">You haven't sent any swap requests yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedSwaps.length > 0 ? (
              completedSwaps.map(renderCompletedSwap)
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed swaps</h3>
                <p className="text-gray-500">You don't have any active or completed swaps yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}