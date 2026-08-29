'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  surahName?: string;
  verseNumber?: number | string;
  themeClass?: string;
  variant?: 'full' | 'compact';
  autoPlay?: boolean;
}

export default function AudioPlayer({
  audioUrl,
  surahName,
  verseNumber,
  themeClass = 'text-emerald-900 bg-emerald-100/70 border-emerald-300/60',
  variant = 'full',
  autoPlay = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [prevAudioUrl, setPrevAudioUrl] = useState(audioUrl);
  if (audioUrl !== prevAudioUrl) {
    setPrevAudioUrl(audioUrl);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }

  if (!audioUrl) return null;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio playback notice:', err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setCurrentTime(cur);
    setProgress((cur / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // COMPACT MINI PILL (FOR GRID CARDS, PREVIEWS & FEED ITEMS)
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center">
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="none"
        />
        <button
          id={`compact-audio-btn-${surahName || 'ayat'}-${verseNumber || '1'}`}
          type="button"
          onClick={togglePlay}
          title={isPlaying ? 'Jeda Tilawah' : 'Putar Tilawah'}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 shadow-2xs hover:opacity-90 active:scale-95 border ${
            isPlaying
              ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-800/20'
              : `${themeClass}`
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3 fill-current" />
              <span>Jeda</span>
              {/* Mini animated audio bars */}
              <div className="flex items-center gap-0.5 h-3 ml-0.5">
                {[0.4, 0.9, 0.6, 1].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-white rounded-full animate-pulse"
                    style={{
                      height: `${h * 10}px`,
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current ml-0.5" />
              <span>Tilawah</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // FULL SIZED DETAILED PLAYER (FOR HERO & DETAIL VIEW)
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`w-full flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border text-xs transition-all ${themeClass}`}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="none"
      />

      {/* Play Button */}
      <button
        id="audio-play-button-full"
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Jeda Tilawah' : 'Putar Tilawah'}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900 transition-transform active:scale-95 shadow-xs shrink-0"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Middle Track Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-center text-[10px] opacity-80 font-medium mb-1 gap-2">
          <span className="truncate font-semibold">
            Tilawah {surahName ? `${surahName} : ${verseNumber}` : 'Ayat'}
          </span>
          <span className="shrink-0 font-mono text-[9px] sm:text-[10px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        
        {/* Progress Track */}
        <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-emerald-800 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Animated Wave Bars when playing (visible on sm+) */}
        <div className="hidden sm:flex items-center gap-0.5 h-4 px-1">
          {[0.4, 0.9, 0.6, 1, 0.5, 0.8].map((height, i) => (
            <span
              key={i}
              className={`w-0.5 bg-emerald-800/60 rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'h-1'
              }`}
              style={{
                height: isPlaying ? `${height * 14}px` : '4px',
                animationDelay: `${i * 120}ms`,
              }}
            />
          ))}
        </div>

        <button
          id="audio-restart-button"
          type="button"
          onClick={handleRestart}
          title="Ulangi dari awal"
          aria-label="Ulangi Tilawah"
          className="p-1.5 hover:bg-black/5 rounded-lg text-emerald-950 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
        </button>
        <button
          id="audio-mute-button"
          type="button"
          onClick={toggleMute}
          title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          className="p-1.5 hover:bg-black/5 rounded-lg text-emerald-950 transition-colors"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />}
        </button>
      </div>
    </div>
  );
}
