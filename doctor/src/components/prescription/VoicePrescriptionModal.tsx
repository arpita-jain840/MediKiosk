import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  Square,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Volume2
} from 'lucide-react';
import type { VoiceAttachment } from '../../types/prescription';

interface VoicePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVoice?: VoiceAttachment | null;
  onSaveVoice: (voice: VoiceAttachment) => void;
}

export const VoicePrescriptionModal: React.FC<VoicePrescriptionModalProps> = ({
  isOpen,
  onClose,
  currentVoice,
  onSaveVoice,
}) => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'completed'>(
    currentVoice ? 'completed' : 'idle'
  );
  const [seconds, setSeconds] = useState(18);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [transcription, setTranscription] = useState(
    currentVoice?.transcription ||
      'Take Amoxicillin 500mg capsules every 8 hours after meals for 7 days. Ensure plenty of fluid intake and rest. Use warm saline steam inhalation twice daily for sinus pressure. If fever persists past 48 hours, return for a blood culture review.'
  );

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setSeconds(0);
    setRecordingState('recording');
  };

  const handlePauseResume = () => {
    if (recordingState === 'recording') {
      setRecordingState('paused');
    } else if (recordingState === 'paused') {
      setRecordingState('recording');
    }
  };

  const handleStopRecording = () => {
    setRecordingState('completed');
  };

  const handleReset = () => {
    setSeconds(0);
    setRecordingState('idle');
    setIsPlaying(false);
  };

  const handleSave = () => {
    onSaveVoice({
      id: `voice-${Date.now()}`,
      duration: formatTime(seconds || 18),
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      transcription: transcription.trim(),
    });
    onClose();
  };

  // Waveform bars with dynamic heights matching user's Image 2
  const waveBars = [
    18, 28, 42, 60, 85, 45, 110, 75, 130, 95, 150, 120, 160, 130, 140, 100, 125, 80, 105, 55, 38, 20
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 relative">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Content */}
        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          {/* Top Title */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles size={12} />
              AI Voice Dictation
            </span>
            <h2 className="text-xl font-black text-slate-900">
              {recordingState === 'idle' && 'Record Prescription Instructions'}
              {(recordingState === 'recording' || recordingState === 'paused') && 'Voice Dictation'}
              {recordingState === 'completed' && 'Recording Complete'}
            </h2>
          </div>

          {/* ============================================================ */}
          {/* IMAGE 2 REPLICATION: Waveform + Center Glowing Orb          */}
          {/* ============================================================ */}
          <div className="w-full py-6 flex flex-col items-center justify-center relative min-h-[220px]">
            {/* Audio Waveform Bars Container */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 h-36 w-full max-w-md px-4 relative">
              {waveBars.map((height, i) => {
                const isActive = recordingState === 'recording';
                // Animate bars when recording
                const animDelay = `${(i % 5) * 0.15}s`;
                const dynamicHeight = isActive
                  ? Math.max(20, Math.min(150, height + Math.sin(i + seconds * 2) * 25))
                  : recordingState === 'completed'
                  ? height * 0.75
                  : 25;

                const isBlue = i >= 4 && i <= 17;

                return (
                  <div
                    key={i}
                    style={{
                      height: `${dynamicHeight}px`,
                      animationDelay: animDelay,
                    }}
                    className={`w-1.5 sm:w-2 rounded-full transition-all duration-300 ${
                      isBlue
                        ? 'bg-blue-400/80 shadow-xs'
                        : 'bg-slate-200'
                    } ${isActive ? 'animate-pulse' : ''}`}
                  />
                );
              })}

              {/* Center Glowing Blue Sphere with Soundwave Icon (Matches Image 2 exactly) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 shadow-xl shadow-blue-500/30 flex items-center justify-center border-4 border-white/90 ${
                    recordingState === 'recording' ? 'scale-105 ring-8 ring-blue-100 transition-transform' : ''
                  }`}
                >
                  {/* Glowing Soundwave Icon in Center */}
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-7 bg-white rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '220ms' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Text & Timer (Matches Image 2) */}
            <div className="mt-4 flex flex-col items-center">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                {recordingState === 'recording' && 'Listening...'}
                {recordingState === 'paused' && 'Recording Paused'}
                {recordingState === 'idle' && 'Ready to record'}
                {recordingState === 'completed' && 'Audio Processed'}
              </span>
              <span className="text-xs text-slate-400 font-medium mt-0.5">
                {recordingState === 'recording'
                  ? 'AI is capturing key points'
                  : recordingState === 'paused'
                  ? 'Tap pause to resume dictation'
                  : recordingState === 'idle'
                  ? 'Click start to begin clinical dictation'
                  : 'AI has transcribed prescription instructions'}
              </span>
              <span className="mt-1 text-sm font-black text-blue-600 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100 font-mono">
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CONTROLS ROW (Matches Image 2 Three Circular Buttons)        */}
          {/* ============================================================ */}
          {recordingState === 'idle' ? (
            <button
              onClick={handleStartRecording}
              className="mt-4 flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-102"
            >
              <Mic size={18} />
              <span>Start Recording</span>
            </button>
          ) : recordingState === 'recording' || recordingState === 'paused' ? (
            <div className="flex items-center justify-center gap-6 mt-4">
              {/* Left: Stop Button (Dark square inside circle) */}
              <button
                onClick={handleStopRecording}
                title="Stop Recording"
                className="w-13 h-13 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 flex items-center justify-center transition-all shadow-xs border border-slate-200/80 cursor-pointer"
              >
                <Square size={18} className="fill-current" />
              </button>

              {/* Center (Larger): Pause / Resume Button */}
              <button
                onClick={handlePauseResume}
                title={recordingState === 'paused' ? 'Resume Recording' : 'Pause Recording'}
                className="w-16 h-16 rounded-full bg-white hover:bg-slate-50 text-slate-900 flex items-center justify-center shadow-lg border-2 border-slate-200 transition-all cursor-pointer hover:scale-105"
              >
                {recordingState === 'recording' ? (
                  <Pause size={24} className="fill-current text-slate-800" />
                ) : (
                  <Play size={24} className="fill-current text-blue-600 ml-1" />
                )}
              </button>

              {/* Right: Bookmark / Flag Button */}
              <button
                onClick={() => setBookmarked(!bookmarked)}
                title="Flag Key Observation"
                className={`w-13 h-13 rounded-full flex items-center justify-center transition-all shadow-xs border cursor-pointer ${
                  bookmarked
                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                }`}
              >
                <Bookmark size={18} className={bookmarked ? 'fill-current' : ''} />
              </button>
            </div>
          ) : (
            /* Completed State: Playback + Edit Transcription */
            <div className="w-full space-y-4 mt-2">
              {/* Audio Playback Pill */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>
                  <div className="text-left">
                    <span className="text-xs font-extrabold text-blue-950 block">
                      Voice Dictation Memo
                    </span>
                    <span className="text-[11px] text-blue-600 font-medium">
                      Duration {formatTime(seconds)} • High Quality WAV
                    </span>
                  </div>
                </div>
                <Volume2 size={18} className="text-blue-500 mr-2" />
              </div>

              {/* Speech to Text AI Transcription */}
              <div className="text-left space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-600" />
                    <span>AI Transcription (Editable)</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    98% Confidence
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="w-full text-xs font-medium p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Record Again</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-wide shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>Use Recording</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
