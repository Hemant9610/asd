import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Browse } from './components/Browse';
import { SwapRequests } from './components/SwapRequests';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { SwapRequestModal } from './components/SwapRequestModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { UserWithSkills } from './lib/users';

function AppRoutes() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithSkills | null>(null);
  const { user } = useAuth();

  const profile = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    profile_photo: user.user_metadata?.profile_photo || '',
    isAdmin: false // TODO: Load from profiles table
  } : null;

  const handleSendRequest = (targetUser: UserWithSkills) => {
    setSelectedUser(targetUser);
    setIsSwapModalOpen(true);
  };

  const handleSubmitSwapRequest = () => {
    // Request was sent successfully
    setIsSwapModalOpen(false);
    setSelectedUser(null);
    // TODO: Show success notification
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'browse':
        return <Browse onSendRequest={handleSendRequest} />;
      case 'requests':
        return <SwapRequests />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <AdminPanel />;
      case 'notifications':
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>
            <div className="space-y-4">
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">No notifications yet</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        currentUser={profile || { name: '', profile_photo: '', isAdmin: false }}
      />
      <main>
        {renderCurrentView()}
      </main>
      {/* Swap Request Modal */}
      {isSwapModalOpen && selectedUser && (
        <SwapRequestModal
          isOpen={isSwapModalOpen}
          onClose={() => {
            setIsSwapModalOpen(false);
            setSelectedUser(null);
          }}
          onSend={handleSubmitSwapRequest}
          targetUser={selectedUser}
        />
      )}
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <AuthForm />;
  return <AppRoutes />;
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}