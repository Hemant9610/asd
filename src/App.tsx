import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Browse } from './components/Browse';
import { SwapRequests } from './components/SwapRequests';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { SwapRequestModal } from './components/SwapRequestModal';
import { AdminLogin } from './components/AdminLogin';
import { User } from './types';
import { ADMIN_USER } from './lib/admin_user';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Check if admin is logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    setIsLoggedIn(adminLoggedIn);
  }, []);

  // Use admin user as default profile
  const profile = ADMIN_USER;

  // Show login if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleSendRequest = (targetUser: User) => {
    setSelectedUser(targetUser);
    setIsSwapModalOpen(true);
  };

  const handleSubmitSwapRequest = (data: {
    skillOffered: string;
    skillWanted: string;
    message: string;
  }) => {
    if (!profile || !selectedUser) return;

    const newRequest = {
      id: Date.now().toString(),
      fromUserId: profile.id,
      toUserId: selectedUser.id,
      skillOffered: data.skillOffered,
      skillWanted: data.skillWanted,
      message: data.message,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // TODO: Implement with Supabase
    console.log('Creating swap request:', newRequest);

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
        return profile.is_admin ? <AdminPanel /> : <Dashboard onViewChange={setCurrentView} />;
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
        currentUser={profile}
      />
      <main>
        {renderCurrentView()}
      </main>

      {/* Swap Request Modal */}
      {isSwapModalOpen && selectedUser && profile && (
        <SwapRequestModal
          isOpen={isSwapModalOpen}
          onClose={() => {
            setIsSwapModalOpen(false);
            setSelectedUser(null);
          }}
          onSend={handleSubmitSwapRequest}
          targetUser={selectedUser}
          currentUserSkills={[]} // TODO: Load from Supabase
        />
      )}

    </div>
  );
}

export default App;