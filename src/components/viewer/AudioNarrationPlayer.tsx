import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AudioNarrationProps {
  durationSeconds?: number;
  durationFormatted?: string;
  narrator?: string;
  title: string;
}

export const AudioNarrationPlayer: React.FC<AudioNarrationProps> = ({
  durationSeconds = 180,
  durationFormatted = '3:00',
  narrator = 'Archival Voice Reconstruction',
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // in seconds
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5>(1);
  const { showToast } = useToast();

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, durationSeconds, speed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && progress === 0) {
      showToast(`Playing simulated audio narration for "${title.substring(0, 30)}..."`, 'info');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1;
    setSpeed(nextSpeed);
    showToast(`Playback speed set to ${nextSpeed}x`, 'info');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E7D5B9] text-[#713F2B] flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-[#29251F] leading-tight">
              Authenticated Audio Narration
            </h4>
            <p className="text-xs text-[#827567]">
              {narrator} • Total {durationFormatted}
            </p>
          </div>
        </div>

        {/* Speed button & Reset */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={cycleSpeed}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#F5EBDD] text-[#713F2B] border border-[#DED3C2] hover:bg-[#E7D5B9] transition-colors"
            title="Toggle playback speed"
          >
            {speed}x
          </button>
          <button
            onClick={() => { setProgress(0); setIsPlaying(false); }}
            className="p-1 text-[#827567] hover:text-[#29251F]"
            title="Reset playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrubber and Waveform Bar */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={0}
          max={durationSeconds}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1.5 bg-[#E7D5B9] rounded-lg appearance-none cursor-pointer accent-[#B96535]"
        />

        <div className="flex items-center justify-between text-xs text-[#827567] font-mono">
          <span>{formatTime(progress)}</span>
          <span className="text-[10px] text-[#B96535] uppercase font-sans font-semibold tracking-wider">
            {isPlaying ? 'Streaming historical record...' : 'Paused'}
          </span>
          <span>{durationFormatted}</span>
        </div>
      </div>

      {/* Main Play Action */}
      <div className="mt-3 pt-3 border-t border-[#DED3C2] flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#B96535] hover:bg-[#713F2B] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Audio</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Listen to Speech Narration</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
