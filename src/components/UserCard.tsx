import React from 'react';
import { MapPin, Star, Clock, MessageSquare } from 'lucide-react';
import { User } from '../types';
import { SkillBadge } from './SkillBadge';

interface UserCardProps {
  user: User;
  onSendRequest: (user: User) => void;
  showRequestButton?: boolean;
}

export function UserCard({ user, onSendRequest, showRequestButton = true }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* User Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          {user.profilePhoto ? (
            <img
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
              src={user.profilePhoto}
              alt={user.name}
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center border-2 border-gray-200">
              <span className="text-xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {user.name}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
            {user.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{user.location}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span>{user.rating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center">
              <span>{user.totalSwaps} swaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
        <div className="flex flex-wrap gap-2">
          {user.skillsOffered.slice(0, 3).map((skill) => (
            <SkillBadge key={skill} skill={skill} type="offered" size="sm" />
          ))}
          {user.skillsOffered.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Wanted</h4>
        <div className="flex flex-wrap gap-2">
          {user.skillsWanted.slice(0, 3).map((skill) => (
            <SkillBadge key={skill} skill={skill} type="wanted" size="sm" />
          ))}
          {user.skillsWanted.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{user.skillsWanted.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{user.availability.join(', ')}</span>
        </div>
      </div>

      {/* Action Button */}
      {showRequestButton && (
        <button
          onClick={() => onSendRequest(user)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Send Swap Request</span>
        </button>
      )}
    </div>
  );
}