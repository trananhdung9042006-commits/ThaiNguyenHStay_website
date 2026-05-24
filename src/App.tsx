import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import HomePage from './pages/HomePage';
import { useAuth } from './contexts/AuthContext';

// Lazy load admin routes for code splitting
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const LoginPage = lazy(() => import('./admin/pages/LoginPage'));
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'));
const HeroSettingsPage = lazy(() => import('./admin/pages/HeroSettingsPage'));
const RoomsPage = lazy(() => import('./admin/pages/RoomsPage'));
const AmenitiesPage = lazy(() => import('./admin/pages/AmenitiesPage'));
const LocationPage = lazy(() => import('./admin/pages/LocationPage'));
const ContactPage = lazy(() => import('./admin/pages/ContactPage'));
const GeneralPage = lazy(() => import('./admin/pages/GeneralPage'));
const ChatbotPage = lazy(() => import('./admin/pages/ChatbotPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Đang tải...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="hero" element={<HeroSettingsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="amenities" element={<AmenitiesPage />} />
          <Route path="location" element={<LocationPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="settings" element={<GeneralPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
