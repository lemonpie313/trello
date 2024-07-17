import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Workspace from './pages/Workspace';
import CreateBoard from './pages/CreateBoard';
import BoardList from './pages/BoardList';
import CreateList from './pages/CreateList';
import List from './pages/List';
import CreateCard from './pages/CreateCard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        <Route path="/create-board" element={<ProtectedRoute><CreateBoard /></ProtectedRoute>} />
        <Route path="/boards" element={<ProtectedRoute><BoardList /></ProtectedRoute>} />
        <Route path="/create-list" element={<ProtectedRoute><CreateList /></ProtectedRoute>} />
        <Route path="/lists" element={<ProtectedRoute><List /></ProtectedRoute>} />
        <Route path="/create-card" element={<ProtectedRoute><CreateCard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
