import { useEffect, useRef, useState } from "react";
import "../elements/styles/audio-player.styles.css";

export const AudioPlayer = ({
  audioRef,
  onFileUpload,
  audioReady,
  recording,
  onRecord,
}: {
  audioRef: React.RefObject<HTMLAudioElement> | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  audioReady: boolean;
  recording: boolean;
  onRecord: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.volume = 0.5 * volume;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioRef]);

  const togglePlay = () => {
    const audio = audioRef?.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
  };

  const stop = () => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const toggleMute = () => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef?.current) {
      audioRef.current.volume = v * 0.5; // Halving the volume here to not make ears bleed
      if (v === 0) {
        audioRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    setCurrentTime(t);
    if (audioRef?.current) audioRef.current.currentTime = t;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player-wrapper">
      <audio ref={audioRef} style={{ display: "none" }} />
      <div className="player-player">
        <div className="player-controls-row">
          <div className="player-left-controls">
            <button
              className={`player-button ${isPlaying ? "player-button--active" : ""}`}
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                // Pause icon
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                // Play icon
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <button className="player-button" onClick={stop} title="Stop">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </button>
            <button
              className={`player-button ${recording ? "player-button--recording" : ""}`}
              onClick={onRecord}
              disabled={recording || !audioReady}
              title={recording ? "Recording..." : "Record"}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="6" />
              </svg>
            </button>
            <button
              className={`player-button ${isMuted ? "player-button--muted" : ""}`}
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line
                    x1="23"
                    y1="9"
                    x2="17"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="17"
                    y1="9"
                    x2="23"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : volume < 0.5 ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path
                    d="M15.54 8.46a5 5 0 0 1 0 7.07"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path
                    d="M15.54 8.46a5 5 0 0 1 0 7.07"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19.07 4.93a10 10 0 0 1 0 14.14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="player-right-controls">
            <input
              className="player-volume-fader"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              style={
                {
                  "--pct": `${(isMuted ? 0 : volume) * 100}%`,
                } as React.CSSProperties
              }
            />
          </div>
        </div>
        <div className="player-progress-row">
          <span className="player-time">{fmt(currentTime)}</span>
          <input
            className="player-seek"
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            style={{ "--pct": `${progressPct}%` } as React.CSSProperties}
          />
          <span className="player-time">{fmt(duration)}</span>
        </div>
      </div>
      {!audioReady && (
        <div
          className="player-overlay"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={onFileUpload}
            disabled={recording}
            style={{ display: "none" }}
          />
          <div className="player-overlay-content">
            <div className="player-overlay-dropzone">
              <div className="player-overlay-icon">+</div>
              <span>Click to choose audio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
