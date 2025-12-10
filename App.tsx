import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Profile } from './pages/Profile';
import { Matches } from './pages/Matches';
import { Chat } from './pages/Chat';
import { INITIAL_USER } from './constants';
import { UserProfile } from './types';

function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Matches user={user} />} />
          <Route path="/profile" element={<Profile user={user} onUpdate={setUser} />} />
          <Route path="/chat/:userId" element={<Chat currentUser={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;