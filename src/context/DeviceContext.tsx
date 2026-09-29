import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeviceMode } from '../types';
import { archiveService } from '../services/archiveService';

interface DeviceContextType {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  isKiosk: boolean;
  isMobilePreview: boolean;
  isTv: boolean;
  narrationVoiceActive: boolean;
  toggleNarrationVoice: () => void;
  resetInactivityTimer: () => void;
  inactivityCountdown: number;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceMode, setDeviceModeState] = useState<DeviceMode>(() => archiveService.getStoredDeviceMode());
  const [narrationVoiceActive, setNarrationVoiceActive] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(120);

  const setDeviceMode = (mode: DeviceMode) => {
    setDeviceModeState(mode);
    archiveService.setStoredDeviceMode(mode);
  };

  const toggleNarrationVoice = () => {
    setNarrationVoiceActive((prev) => !prev);
  };

  const resetInactivityTimer = () => {
    setInactivityCountdown(120);
  };

  // Simulated kiosk inactivity timer
  useEffect(() => {
    if (deviceMode !== 'kiosk') return;

    const interval = setInterval(() => {
      setInactivityCountdown((prev) => {
        if (prev <= 1) {
          return 120; // reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deviceMode]);

  // Keyboard navigation for TV mode
  useEffect(() => {
    if (deviceMode !== 'tv') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Remote control simulated listener
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Prevent default window scrolling when arrow keys are pressed in TV mode
        // and allow natural focus navigation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deviceMode]);

  return (
    <DeviceContext.Provider
      value={{
        deviceMode,
        setDeviceMode,
        isKiosk: deviceMode === 'kiosk',
        isMobilePreview: deviceMode === 'mobile',
        isTv: deviceMode === 'tv',
        narrationVoiceActive,
        toggleNarrationVoice,
        resetInactivityTimer,
        inactivityCountdown,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
