import React from 'react';
import { useDevice } from '../../context/DeviceContext';
import { Monitor, Smartphone, Touchpad, Tv, Info, RotateCcw } from 'lucide-react';
import { DeviceMode } from '../../types';

export const DevicePreviewBar: React.FC = () => {
  const { deviceMode, setDeviceMode, inactivityCountdown, resetInactivityTimer } = useDevice();

  const modes: { id: DeviceMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'desktop', label: 'Desktop', icon: <Monitor className="w-3.5 h-3.5" />, desc: 'Editorial Multi-column' },
    { id: 'mobile', label: 'Mobile', icon: <Smartphone className="w-3.5 h-3.5" />, desc: 'Portrait Touch layout' },
    { id: 'kiosk', label: 'Touch Kiosk', icon: <Touchpad className="w-3.5 h-3.5" />, desc: 'Large 1080p touch targets' },
    { id: 'tv', label: 'Smart TV', icon: <Tv className="w-3.5 h-3.5" />, desc: '10-Foot Remote Friendly' },
  ];

  return (
    <div className="bg-[#29251F] text-[#F5EBDD] text-xs py-1.5 px-4 border-b border-[#3E3830] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold tracking-wide text-[#E7D5B9] uppercase text-[10px]">
            <Info className="w-3 h-3 text-[#B96535]" />
            Prototype Device Preview:
          </span>
          <span className="text-[#A89F91] hidden sm:inline">
            Switch layout presentation to evaluate multi-platform experience
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#1C1915] p-0.5 rounded border border-[#3E3830]">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setDeviceMode(m.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all text-xs font-medium ${
                deviceMode === m.id
                  ? 'bg-[#B96535] text-[#FBF8F2] shadow-sm'
                  : 'text-[#C5B8A5] hover:text-[#FBF8F2] hover:bg-[#2F2922]'
              }`}
              title={m.desc}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {deviceMode === 'kiosk' && (
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#E7D5B9]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Simulated Inactivity Reset: {inactivityCountdown}s</span>
            <button
              onClick={resetInactivityTimer}
              className="text-[#C5B8A5] hover:text-white flex items-center gap-0.5 underline ml-1"
            >
              <RotateCcw className="w-2.5 h-2.5" /> reset
            </button>
          </div>
        )}

        {deviceMode === 'tv' && (
          <div className="hidden md:flex items-center gap-1 text-[11px] text-[#E7D5B9]">
            <span className="bg-[#3E3830] px-1 rounded text-[10px] text-amber-200">↑ ↓ ← →</span>
            <span>Keyboard Remote Navigation Active</span>
          </div>
        )}
      </div>
    </div>
  );
};
