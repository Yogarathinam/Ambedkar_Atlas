import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DeviceProvider, useDevice } from './context/DeviceContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { ToastProvider } from './context/ToastContext';
import { DevicePreviewBar } from './components/common/DevicePreviewBar';
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
  const { deviceMode, isMobilePreview, isKiosk, isTv } = useDevice();
  const location = useLocation();

  // If on /kiosk route, render KioskPage directly without standard desktop header/footer
  const isDedicatedKioskRoute = location.pathname === '/kiosk';

  if (isDedicatedKioskRoute || (isKiosk && location.pathname === '/')) {
    return (
      <div className="min-h-screen bg-[#F5EBDD] font-sans">
        <DevicePreviewBar />
        <KioskPage />
      </div>
    );
  }

  // Simulated Mobile Frame when evaluator switches to "Mobile" mode on a desktop screen
  if (isMobilePreview) {
    return (
      <div className="min-h-screen bg-[#231E19] flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-5xl mb-4">
          <DevicePreviewBar />
        </div>
        
        {/* Smartphone Shell Frame */}
        <div className="relative w-full max-w-[414px] bg-[#1C1814] rounded-[48px] p-3 shadow-2xl border-4 border-[#3E3830]">
          {/* Speaker / Camera Notch */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-[#1C1814] rounded-full z-50 flex items-center justify-center">
            <div className="w-12 h-1.5 bg-[#3E3830] rounded-full" />
            <div className="w-2.5 h-2.5 bg-[#2A241E] rounded-full ml-2" />
          </div>

          {/* Mobile Screen Surface */}
          <div className="w-full h-[780px] bg-[#F5EBDD] rounded-[40px] overflow-y-auto overflow-x-hidden flex flex-col justify-between border border-[#DED3C2] pt-6">
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
        </div>
      </div>
    );
  }

  // Smart TV Mode: 10-foot remote friendly styling with focus indicators and large fonts
  if (isTv) {
    return (
      <div className="min-h-screen bg-[#1C1915] text-[#F5EBDD] tv-mode">
        <DevicePreviewBar />
        <div className="p-4 bg-[#29251F] text-amber-200 text-xs text-center border-b border-[#3E3830] flex items-center justify-center gap-2">
          <span>📺 SMART TV 10-FOOT INTERFACE: Use Tab or Keyboard Arrow Keys to Navigate • High Contrast Focus Enabled</span>
        </div>
        <div className="text-lg">
          <Header />
          <main>
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
      </div>
    );
  }

  // Standard Desktop Editorial Museum View
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EBDD] text-[#51483F] font-sans antialiased selection:bg-[#B96535]/20 selection:text-[#29251F]">
      <DevicePreviewBar />
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
