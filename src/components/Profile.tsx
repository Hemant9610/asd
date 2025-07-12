import React, { useState } from 'react';
import { User, Camera, MapPin, Clock, Eye, EyeOff, Plus, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SkillBadge } from './SkillBadge';
import { skillCategories } from '../data/mockData';

export function Profile() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    location: currentUser?.location || '',
    skillsOffered: currentUser?.skillsOffered || [],
    skillsWanted: currentUser?.skillsWanted || [],
    availability: currentUser?.availability || [],
    isPublic: currentUser?.isPublic || true
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState<'offered' | 'wanted'>('offered');
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!currentUser) return null;

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        ...currentUser,
        ...editForm
      }
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    const updatedSkills = skillType === 'offered' 
      ? [...editForm.skillsOffered, newSkill.trim()]
      : [...editForm.skillsWanted, newSkill.trim()];

    setEditForm({
      ...editForm,
      [skillType === 'offered' ? 'skillsOffered' : 'skillsWanted']: updatedSkills
    });

    setNewSkill('');
  };

  const removeSkill = (skill: string, type: 'offered' | 'wanted') => {
    const currentSkills = type === 'offered' ? editForm.skillsOffered : editForm.skillsWanted;
    const updatedSkills = currentSkills.filter(s => s !== skill);
    
    setEditForm({
      ...editForm,
      [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: updatedSkills
    });
  };

  const availabilityOptions = ['Mornings', 'Afternoons', 'Evenings', 'Weekdays', 'Weekends'];

  const toggleAvailability = (option: string) => {
    const updated = editForm.availability.includes(option)
      ? editForm.availability.filter(a => a !== option)
      : [...editForm.availability, option];
    
    setEditForm({ ...editForm, availability: updated });
  };

  const availableSkills = selectedCategory 
    ? skillCategories.find(cat => cat.id === selectedCategory)?.skills || []
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your skills, availability, and profile settings.
          </p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
            {/* Profile Photo */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {currentUser.profilePhoto ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                    src={currentUser.profilePhoto}
                    alt={currentUser.name}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center border-4 border-gray-200">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mt-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-center border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                  />
                ) : (
                  currentUser.name
                )}
              </h2>
              
              <div className="flex items-center justify-center text-gray-500 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Add your location"
                    className="text-center border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent text-sm"
                  />
                ) : (
                  <span>{currentUser.location || 'No location set'}</span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{currentUser.rating.toFixed(1)}</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{currentUser.totalSwaps}</p>
                <p className="text-sm text-gray-500">Swaps</p>
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {editForm.isPublic ? (
                    <Eye className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Profile Visibility
                  </span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setEditForm({ ...editForm, isPublic: !editForm.isPublic })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editForm.isPublic ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editForm.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {editForm.isPublic ? 'Public profile' : 'Private profile'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills Offered */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Offer</h3>
            
            {isEditing && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {skillCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!selectedCategory}
                  >
                    <option value="">Select skill</option>
                    {availableSkills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => {
                      setSkillType('offered');
                      addSkill();
                    }}
                    disabled={!newSkill}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Select a category and skill to add to your offerings
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {(isEditing ? editForm.skillsOffered : currentUser.skillsOffered).map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                  type="offered"
                  removable={isEditing}
                  onRemove={() => removeSkill(skill, 'offered')}
                />
              ))}
              {(isEditing ? editForm.skillsOffered : currentUser.skillsOffered).length === 0 && (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
            
            {isEditing && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {skillCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!selectedCategory}
                  >
                    <option value="">Select skill</option>
                    {availableSkills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => {
                      setSkillType('wanted');
                      addSkill();
                    }}
                    disabled={!newSkill}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Select a category and skill you want to learn
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {(isEditing ? editForm.skillsWanted : currentUser.skillsWanted).map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                  type="wanted"
                  removable={isEditing}
                  onRemove={() => removeSkill(skill, 'wanted')}
                />
              ))}
              {(isEditing ? editForm.skillsWanted : currentUser.skillsWanted).length === 0 && (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map((option) => {
                const isSelected = (isEditing ? editForm.availability : currentUser.availability).includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => isEditing && toggleAvailability(option)}
                    disabled={!isEditing}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    } ${isEditing ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default'}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            
            {(isEditing ? editForm.availability : currentUser.availability).length === 0 && (
              <p className="text-gray-500 text-sm mt-2">No availability set</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}