import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { isRegisterOnlyHost } from './registerHost';
import './App.css';

// Lazy-load all routes so the initial bundle stays small. On the register-only
// subdomain (register.void-society.in) non-register chunks are never fetched.
const VoidPage = lazy(() => import('./pages/home.jsx'));
const TerminalPage = lazy(() => import('./pages/terminal.jsx'));
const Blogs = lazy(() => import('./pages/blogs.jsx'));
const Achievements = lazy(() => import('./pages/achievement.jsx'));
const AboutUs = lazy(() => import('./pages/about-Us.jsx'));
const Resources = lazy(() => import('./pages/resources.jsx'));
const ContactUs = lazy(() => import('./pages/contact-Us.jsx'));
const Register = lazy(() => import('./pages/register.jsx'));
const IrcPage = lazy(() => import('./pages/irc.jsx'));
const FAQPage = lazy(() => import('./pages/FAQ.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const PanelSight = lazy(() => import('./pages/panelSight.jsx'));

const LOADER_KEY = 'void_loader_seen';
const LOADER_WINDOW_MS = 30 * 60 * 1000; // 30 min

// On register.void-society.in the whole site is locked to the register page,
// so visitors cannot reach (or fetch) any other route.
function LockedRoutes() {
  const location = useLocation();
  if (isRegisterOnlyHost() && location.pathname !== '/register') {
    return <Navigate to="/register" replace />;
  }
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="/" element={<VoidPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/blogs/:id" element={<BlogPostPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/irc" element={<IrcPage />} />
        <Route path="/FAQ" element={<FAQPage />} />
        <Route path="/panel-sight" element={<PanelSight />} />
      </Routes>
    </Suspense>
  );
}

// localStorage can throw (private mode, strict privacy settings, sandboxed
// frames). A thrown SecurityError on mount would unmount the whole tree and
// white-screen the app, so all storage access is guarded.
const safeRead = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};
const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — best effort */
  }
};

function GlobalLoader() {
  const location = useLocation();
  // Only judge on first mount: if the visitor lands anywhere other than the
  // home page, show the loader once (the About page has its own preloader).
  const initialPath = useRef(location.pathname).current;
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (initialPath === '/') return; // no landing loader on the home page
    const now = Date.now();
    const last = Number(safeRead(LOADER_KEY) || 0);
    // Show only on first visit, or when the previous visit was more than 30 min ago.
    if (!last || now - last > LOADER_WINDOW_MS) {
      setShowLoader(true);
    }
  }, [initialPath]);

  const handleLoaderDone = () => {
    safeWrite(LOADER_KEY, String(Date.now()));
    setShowLoader(false);
  };

  if (!showLoader) return null;
  return <LoadingScreen onDone={handleLoaderDone} />;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LockedRoutes />
      <GlobalLoader />
    </Router>
  );
}

export default App;
