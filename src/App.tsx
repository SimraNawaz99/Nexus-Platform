import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage }           from './pages/auth/LoginPage';
import { RegisterPage }        from './pages/auth/RegisterPage';
import { ForgotPasswordPage }  from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage }   from './pages/auth/ResetPasswordPage';
import Login2FAPage            from './pages/security/Login2FAPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard }     from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile }     from './pages/profile/InvestorProfile';

// Feature Pages
import SchedulingPage        from './pages/scheduling/SchedulingPage';
import VideoPage             from './pages/video/VideoPage';
import DocumentChamberPage   from './pages/documents-chamber/DocumentChamberPage';
import PaymentsPage          from './pages/payments/PaymentsPage';
import { DocumentsPage }     from './pages/documents/DocumentsPage';
import { InvestorsPage }     from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage }      from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage }      from './pages/settings/SettingsPage';
import { HelpPage }          from './pages/help/HelpPage';
import { DealsPage }         from './pages/deals/DealsPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#111827',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: { primary: '#2563EB', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* ── Authentication ───────────────────────────────────── */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
          <Route path="/security/2fa"    element={<Login2FAPage />} />

          {/* ── Protected layout ─────────────────────────────────── */}
          <Route path="/" element={<DashboardLayout />}>

            {/* Index: redirect "/" → entrepreneur dashboard by default */}
            <Route index element={<Navigate to="/dashboard/entrepreneur" replace />} />

            {/* Role-based dashboards */}
            <Route path="dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="dashboard/investor"     element={<InvestorDashboard />} />

            {/* Profiles */}
            <Route path="profile/entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="profile/investor/:id"     element={<InvestorProfile />} />

            {/* Feature pages */}
            <Route path="scheduling"        element={<SchedulingPage />} />
            <Route path="video-call"        element={<VideoPage />} />
            <Route path="documents-chamber" element={<DocumentChamberPage />} />
            <Route path="payments"          element={<PaymentsPage />} />
            <Route path="documents"         element={<DocumentsPage />} />
            <Route path="investors"         element={<InvestorsPage />} />
            <Route path="entrepreneurs"     element={<EntrepreneursPage />} />
            <Route path="messages"          element={<MessagesPage />} />
            <Route path="notifications"     element={<NotificationsPage />} />
            <Route path="settings"          element={<SettingsPage />} />
            <Route path="help"              element={<HelpPage />} />
            <Route path="deals"             element={<DealsPage />} />

            {/* Chat */}
            <Route path="chat"         element={<ChatPage />} />
            <Route path="chat/:userId" element={<ChatPage />} />
          </Route>

          {/* ── Catch-all ────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;