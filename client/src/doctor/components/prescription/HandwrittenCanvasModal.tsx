import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  PenTool,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  CheckCircle2,
  Sparkles,
  Grid
} from 'lucide-react';
import type { HandwrittenAttachment } from '../../types/prescription';

interface HandwrittenCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHandwritten?: HandwrittenAttachment | null;
  onSaveHandwritten: (attachment: HandwrittenAttachment) => void;
}

export const HandwrittenCanvasModal: React.FC<HandwrittenCanvasModalProps> = ({
  isOpen,
  onClose,
  currentHandwritten,
  onSaveHandwritten,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [penSize, setPenSize] = useState<number>(3);
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // Classic Medical Navy Blue
  const [showRuledLines, setShowRuledLines] = useState(true);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Colors
  const COLORS = [
    { name: 'Navy Blue', hex: '#1e3a8a' },
    { name: 'Charcoal Black', hex: '#0f172a' },
    { name: 'Medical Teal', hex: '#00838f' },
    { name: 'Clinical Indigo', hex: '#4338ca' },
    { name: 'Clinical Red', hex: '#dc2626' },
  ];

  // Initialize Canvas
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set resolution
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // If current handwritten exists, load it
      if (currentHandwritten?.imageDataUrl) {
        const img = new Image();
        img.src = currentHandwritten.imageDataUrl;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          saveState();
        };
      } else {
        // Draw initial sample medical ink to guide doctor
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 2.5;
        ctx.font = 'italic 18px cursive';
        ctx.fillStyle = '#1e3a8a';
        ctx.fillText('Rx: Steam Inh 2x / day', 40, 60);
        ctx.fillText('Hydration > 2.5L / day', 40, 95);
        ctx.fillText('Review in 1 wk if fever persists.', 40, 130);
        saveState();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penSize * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
    saveState();
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const prevStep = historyStep - 1;
      ctx.putImageData(history[prevStep], 0, 0);
      setHistoryStep(prevStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const nextStep = historyStep + 1;
      ctx.putImageData(history[nextStep], 0, 0);
      setHistoryStep(nextStep);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveHandwritten({
      id: `hw-${Date.now()}`,
      imageDataUrl: dataUrl,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <PenTool size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Digital Prescription Pad
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Write or draw clinical instructions directly using cursor or stylus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-100 bg-white">
          {/* Tool mode: Pen vs Eraser */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('pen')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'pen' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <PenTool size={14} />
              <span>Pen</span>
            </button>
            <button
              onClick={() => setMode('eraser')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'eraser' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eraser size={14} />
              <span>Eraser</span>
            </button>
          </div>

          {/* Pen Size Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Tip:
            </span>
            {[2, 4, 7].map((size) => (
              <button
                key={size}
                onClick={() => setPenSize(size)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                  penSize === size
                    ? 'border-teal-500 bg-teal-50 text-teal-800 font-extrabold shadow-2xs'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span
                  className="rounded-full bg-slate-800"
                  style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
                />
              </button>
            ))}
          </div>

          {/* Color palette */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Ink:
            </span>
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  setPenColor(c.hex);
                  setMode('pen');
                }}
                title={c.name}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                  penColor === c.hex && mode === 'pen'
                    ? 'scale-120 ring-2 ring-teal-400 ring-offset-2'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Ruled Paper toggle & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRuledLines(!showRuledLines)}
              title="Toggle ruled lines"
              className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                showRuledLines ? 'bg-slate-100 border-slate-300 text-slate-700' : 'border-slate-200 text-slate-400'
              }`}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              title="Undo"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
              title="Redo"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            >
              <RotateCw size={15} />
            </button>
            <button
              onClick={handleClear}
              title="Clear Canvas"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Canvas Drawing Area */}
        <div className="p-6 bg-slate-100 flex items-center justify-center">
          <div
            className={`w-full h-96 bg-white rounded-2xl shadow-inner border border-slate-200 relative overflow-hidden ${
              showRuledLines ? 'bg-[linear-gradient(#f1f5f9_1px,transparent_1px)] bg-[size:100%_28px]' : ''
            }`}
          >
            {/* Watermark in corner */}
            <div className="absolute top-4 left-5 pointer-events-none opacity-20 font-serif text-2xl font-black text-slate-800 select-none">
              ℞ Handwritten Rx
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles size={14} className="text-teal-600" />
            <span>Preserves exact stroke dynamics for legal medical archiving</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black tracking-wide shadow-md shadow-teal-700/20 transition-all cursor-pointer"
            >
              <CheckCircle2 size={15} />
              <span>Save to Prescription</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
