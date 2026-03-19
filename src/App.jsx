import './App.css'
import { Toaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from '@/pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const PUBLIC_PAGES = new Set(['Login', 'Register', 'ForgotPassword', 'ResetPassword', 'Unauthorized']);

const LayoutWrapper = ({ children, currentPageName }) => {
  if (PUBLIC_PAGES.has(currentPageName)) return <>{children}</>;
  return Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />

      {Object.entries(Pages).map(([path, Page]) => {
        const element = (
          <LayoutWrapper currentPageName={path}>
            <Page />
          </LayoutWrapper>
        );

        if (PUBLIC_PAGES.has(path)) {
          return <Route key={path} path={`/${path}`} element={element} />;
        }

        // Protected pages
        const isAdminOnly = path === 'Users';
        if (isAdminOnly) {
          return (
            <Route
              key={path}
              path={`/${path}`}
              element={<ProtectedRoute requiredRoles={['admin']}>{element}</ProtectedRoute>}
            />
          );
        }

        return <Route key={path} path={`/${path}`} element={<ProtectedRoute>{element}</ProtectedRoute>} />;
      })}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App
