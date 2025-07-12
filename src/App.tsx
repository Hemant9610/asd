import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Browse } from './components/Browse';
import { SwapRequests } from './components/SwapRequests';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { Notifications } from './components/Notifications';
import { SwapRequestModal } from './components/SwapRequestModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { UserWithSkills } from './lib/users';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/NotificationToast';

function AppRoutes() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithSkills | null>(null);
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess } = useToast();

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
    showSuccess('Request Sent', 'Your swap request has been sent successfully!');
    setIsSwapModalOpen(false);
    setSelectedUser(null);
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
        return <Notifications />;
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
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
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