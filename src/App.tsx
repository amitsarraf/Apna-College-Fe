import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import SignupForm from './components/SignupForm';
import HomePage from './pages/Home';
//import CandidateDashboard from './pages/Candidate/CandidateDashboard';
import ReviewerDashboard from './pages/Reviewer/ReviewerDashboard';
import CandidateDashboard from './pages/Candidate/CandidateDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
          <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

         <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupForm />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
         <Route
          path="/candidatedashboard"
          element={
            <PrivateRoute>
              <CandidateDashboard />
            </PrivateRoute>
          }
        />
         <Route
          path="/reviewerDashboard"
          element={
            <PrivateRoute>
              <ReviewerDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
