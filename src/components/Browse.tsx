import React, { useState, useMemo } from 'react';
import { Filter, Search } from 'lucide-react';
import { UserCard } from './UserCard';
import { skillCategories, mockUsers } from '../data/mockData';
import { User } from '../types';

interface BrowseProps {
  onSendRequest: (user: User) => void;
}

export function Browse({ onSendRequest }: BrowseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Use mock data for now
  const users = mockUsers;
  const currentUser = mockUsers[0]; // Use first user as current user

  const filteredUsers = useMemo(() => {
    if (!currentUser) return [];

    return users.filter(user => {
      // Exclude current user and non-public profiles
      if (user.id === currentUser.id || !user.isPublic || user.isBanned) return false;

      // Search query filter
      const query = localSearchQuery;
      if (query) {
        const searchLower = query.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(searchLower);
        const matchesLocation = user.location?.toLowerCase().includes(searchLower);
        const matchesSkills = [...user.skillsOffered, ...user.skillsWanted]
          .some(skill => skill.toLowerCase().includes(searchLower));
        
        if (!matchesName && !matchesLocation && !matchesSkills) return false;
      }

      // Category filter
      if (selectedCategory) {
        const category = skillCategories.find(cat => cat.id === selectedCategory);
        if (category) {
          const hasSkillInCategory = [...user.skillsOffered, ...user.skillsWanted]
            .some(skill => category.skills.includes(skill));
          if (!hasSkillInCategory) return false;
        }
      }

      // Specific skill filter
      if (selectedSkill) {
        const hasSkill = [...user.skillsOffered, ...user.skillsWanted].includes(selectedSkill);
        if (!hasSkill) return false;
      }

      return true;
    });
  }, [users, currentUser, localSearchQuery, selectedCategory, selectedSkill]);

  const availableSkills = useMemo(() => {
    const selectedCat = skillCategories.find(cat => cat.id === selectedCategory);
    return selectedCat ? selectedCat.skills : [];
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
        <p className="text-gray-600">
          Discover talented people and find your next skill swap partner.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search users or skills..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSkill(''); // Reset skill filter when category changes
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {skillCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedCategory}
            >
              <option value="">All Skills</option>
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(localSearchQuery || selectedCategory || selectedSkill) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Active filters:</span>
            {localSearchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{localSearchQuery}"
                <button
                  onClick={() => setLocalSearchQuery('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Category: {skillCategories.find(cat => cat.id === selectedCategory)?.name}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSkill('');
                  }}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSkill && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Skill: {selectedSkill}
                <button
                  onClick={() => setSelectedSkill('')}
                  className="ml-1 text-emerald-600 hover:text-emerald-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Found {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'}
        </p>
      </div>

      {/* User Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onSendRequest={onSendRequest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or browse all available users.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}