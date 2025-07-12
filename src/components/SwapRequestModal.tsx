import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import { UserWithSkills } from '../lib/users';
import { useAuth } from '../contexts/AuthContext';
import { getUserSkills } from '../lib/skills';
import { createSwapRequest, getSkillIdByName } from '../lib/swapRequests';
import { SkillBadge } from './SkillBadge';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  targetUser: UserWithSkills;
}

export function SwapRequestModal({
  isOpen,
  onClose,
  onSend,
  targetUser
}: SwapRequestModalProps) {
  const { user: currentUser } = useAuth();
  const [currentUserSkills, setCurrentUserSkills] = useState<string[]>([]);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load current user's skills when modal opens
  React.useEffect(() => {
    if (isOpen && currentUser?.id) {
      loadCurrentUserSkills();
    }
  }, [isOpen, currentUser?.id]);

  const loadCurrentUserSkills = async () => {
    if (!currentUser?.id) return;
    
    try {
      const skills = await getUserSkills(currentUser.id);
      setCurrentUserSkills(skills.offered);
    } catch (error) {
      console.error('Error loading user skills:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillOffered || !skillWanted || !message.trim() || !currentUser?.id) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get skill IDs
      const skillOfferedId = await getSkillIdByName(skillOffered);
      const skillWantedId = await getSkillIdByName(skillWanted);

      if (!skillOfferedId || !skillWantedId) {
        setError('Could not find the selected skills');
        setLoading(false);
        return;
      }

      // Create swap request
      const { error: createError } = await createSwapRequest({
        fromUserId: currentUser.id,
        toUserId: targetUser.id,
        skillOfferedId,
        skillWantedId,
        message: message.trim()
      });

      if (createError) {
        setError(createError);
        setLoading(false);
        return;
      }

      // Success - reset form and close modal
      setSkillOffered('');
      setSkillWanted('');
      setMessage('');
      setError('');
      onSend();
      onClose();
    } catch (error) {
      console.error('Error creating swap request:', error);
      setError('Failed to send swap request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultMessage = () => {
    if (skillOffered && skillWanted) {
      setMessage(`Hi ${targetUser.name}! I'd love to learn ${skillWanted} from you in exchange for ${skillOffered}. I think this would be a great skill swap for both of us. Let me know if you're interested!`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {targetUser.profilePhoto ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={targetUser.profilePhoto}
                alt={targetUser.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Send Swap Request
              </h3>
              <p className="text-sm text-gray-500">to {targetUser.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Skill I Offer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill I Offer
            </label>
            <select
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a skill you offer</option>
              {currentUserSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Skill I Want */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill I Want to Learn
            </label>
            <select
              value={skillWanted}
              onChange={(e) => setSkillWanted(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a skill they offer</option>
              {targetUser.skillsOffered.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Preview */}
          {skillOffered && skillWanted && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Swap Preview</h4>
              <div className="flex items-center justify-center space-x-4">
                <SkillBadge skill={skillOffered} type="offered" />
                <span className="text-gray-400">↔</span>
                <SkillBadge skill={skillWanted} type="wanted" />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <button
                type="button"
                onClick={generateDefaultMessage}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Generate message
              </button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Introduce yourself and explain why you'd like to swap these skills..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Target User Skills */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {targetUser.name}'s Skills
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600 mb-1">Offers:</p>
                <div className="flex flex-wrap gap-1">
                  {targetUser.skillsOffered.map((skill) => (
                    <SkillBadge key={skill} skill={skill} type="offered" size="sm" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Wants:</p>
                <div className="flex flex-wrap gap-1">
                  {targetUser.skillsWanted.map((skill) => (
                    <SkillBadge key={skill} skill={skill} type="wanted" size="sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!skillOffered || !skillWanted || !message.trim() || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}