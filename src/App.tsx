import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DeviceProvider } from './context/DeviceContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ArchivePage } from './pages/ArchivePage';
import { ViewerPage } from './pages/ViewerPage';
import { TimelinePage } from './pages/TimelinePage';
import { ResearchPage } from './pages/ResearchPage';
import { AboutPage } from './pages/AboutPage';
import { KioskPage } from './pages/KioskPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isDedicatedKioskRoute = location.pathname === '/kiosk';

  if (isDedicatedKioskRoute) {
    return (
      <div className="min-h-screen bg-[#F5EBDD] font-sans antialiased text-[#29251F]">
        <KioskPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EBDD] text-[#51483F] font-sans antialiased selection:bg-[#B96535]/20 selection:text-[#29251F]">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/archive/:id" element={<ViewerPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/kiosk" element={<KioskPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <DeviceProvider>
        <BookmarkProvider>
          <Router>
            <AppLayout />
          </Router>
        </BookmarkProvider>
      </DeviceProvider>
    </ToastProvider>
  );
}
