import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  FileCode,
  FileArchive,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Plus
} from 'lucide-react';
import type { UploadedPrescriptionFile } from '../../../types/prescription';

interface UploadPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFiles: UploadedPrescriptionFile[];
  onSaveFiles: (files: UploadedPrescriptionFile[]) => void;
}

const INITIAL_MOCK_FILES: UploadedPrescriptionFile[] = [
  {
    id: 'f-1',
    name: 'clinical_rx_summary_prior.pdf',
    size: '431 KB',
    type: 'pdf',
    progress: 100,
    status: 'completed',
    uploadedAt: 'Today, 10:14 AM',
  },
  {
    id: 'f-2',
    name: 'doctor_voice_intake_memo.mp3',
    size: '1.8 MB',
    type: 'audio',
    progress: 82,
    status: 'uploading',
    uploadedAt: 'Today, 10:15 AM',
  },
  {
    id: 'f-3',
    name: 'diagnostic_chest_xray_scan.png',
    size: '2.4 MB',
    type: 'png',
    progress: 100,
    status: 'completed',
    uploadedAt: 'Today, 10:16 AM',
  },
];

export const UploadPrescriptionModal: React.FC<UploadPrescriptionModalProps> = ({
  isOpen,
  onClose,
  currentFiles,
  onSaveFiles,
}) => {
  const [fileList, setFileList] = useState<UploadedPrescriptionFile[]>(
    currentFiles.length > 0 ? currentFiles : INITIAL_MOCK_FILES
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSimulatedUpload = (name: string, size: string, type: UploadedPrescriptionFile['type']) => {
    const newFile: UploadedPrescriptionFile = {
      id: `file-${Date.now()}`,
      name,
      size,
      type,
      progress: 35,
      status: 'uploading',
      uploadedAt: 'Just now',
    };

    setFileList((prev) => [newFile, ...prev]);

    // Animate progress to 100%
    let currentProgress = 35;
    const interval = setInterval(() => {
      currentProgress += 25;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setFileList((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress: 100, status: 'completed' } : f))
        );
      } else {
        setFileList((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress: currentProgress } : f))
        );
      }
    }, 250);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();
    let type: UploadedPrescriptionFile['type'] = 'pdf';
    if (['mp3', 'wav', 'm4a'].includes(extension || '')) type = 'audio';
    else if (['png', 'jpg', 'jpeg'].includes(extension || '')) type = 'png';
    else if (['zip', 'rar'].includes(extension || '')) type = 'zip';
    else if (['doc', 'docx'].includes(extension || '')) type = 'doc';

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    handleSimulatedUpload(file.name, formattedSize, type);
  };

  const handleRemove = (id: string) => {
    setFileList((prev) => prev.filter((f) => f.id !== id));
  };

  const handleReplace = (id: string) => {
    setFileList((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, progress: 20, status: 'uploading' } : f
      )
    );
    setTimeout(() => {
      setFileList((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, progress: 100, status: 'completed' } : f
        )
      );
    }, 600);
  };

  const handleSaveToPrescription = () => {
    onSaveFiles(fileList);
    onClose();
  };

  // File Icon Helper matching Image 1 styling
  const renderFileIcon = (type: UploadedPrescriptionFile['type']) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex flex-col items-center justify-center font-bold text-[9px] uppercase shrink-0">
            <FileText size={16} />
            <span>PDF</span>
          </div>
        );
      case 'audio':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex flex-col items-center justify-center font-bold text-[9px] uppercase shrink-0">
            <Music size={16} />
            <span>VOX</span>
          </div>
        );
      case 'zip':
        return (
          <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 flex flex-col items-center justify-center font-bold text-[9px] uppercase shrink-0">
            <FileArchive size={16} />
            <span>ZIP</span>
          </div>
        );
      case 'doc':
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex flex-col items-center justify-center font-bold text-[9px] uppercase shrink-0">
            <FileCode size={16} />
            <span>DOC</span>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex flex-col items-center justify-center font-bold text-[9px] uppercase shrink-0">
            <ImageIcon size={16} />
            <span>IMG</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 relative">
        {/* ============================================================ */}
        {/* IMAGE 1 REPLICATION: "UPLOAD FILES" with Red Corner Close Button */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between pl-8 pr-0 py-0 border-b border-slate-100 h-16">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wider font-mono">
            UPLOAD FILES
          </h2>

          {/* Solid Red Corner Close Button (Exact visual style from Image 1) */}
          <button
            onClick={onClose}
            className="w-14 h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer rounded-bl-2xl shadow-sm"
            title="Close"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body: Two-Column Grid (Dropzone on Left, File list on Right) */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Dropzone Area with Cloud Illustration (Matches Image 1) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.png,.jpg,.jpeg,.mp3,.wav,.m4a,.doc,.docx"
              className="hidden"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  handleSimulatedUpload(file.name, `${Math.round(file.size / 1024)} KB`, 'pdf');
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 scale-101'
                  : 'border-blue-200/80 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/20'
              }`}
            >
              {/* Cloud & Document Illustration Graphic (Matches Image 1) */}
              <div className="relative w-36 h-28 mb-4 flex items-center justify-center">
                {/* Back folders/cards */}
                <div className="absolute w-20 h-16 bg-purple-100 rounded-xl -rotate-6 border border-purple-200" />
                <div className="absolute w-20 h-16 bg-pink-100 rounded-xl rotate-6 border border-pink-200" />
                {/* Center Cloud */}
                <div className="absolute w-24 h-16 bg-gradient-to-b from-sky-200 to-blue-300 rounded-2xl flex items-center justify-center shadow-md">
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-blue-600">
                    <Plus size={18} />
                  </div>
                </div>
                {/* Front Photo Card */}
                <div className="absolute -bottom-1 -right-1 w-16 h-14 bg-white rounded-xl shadow-md border border-slate-100 p-1 flex items-center justify-center text-slate-300">
                  <ImageIcon size={20} />
                </div>
              </div>

              {/* Text: Drop your files here, or Browse (Image 1) */}
              <p className="text-sm font-semibold text-slate-700">
                Drop your files here,
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                or <span className="font-extrabold text-blue-600 hover:underline">Browse</span>
              </p>

              <span className="text-[10px] text-slate-400 mt-4 block leading-tight">
                Supports PDF, Images, or Voice Dictations (.mp3, .wav) up to 25MB
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Uploaded Files List with Progress Bars (Matches Image 1) */}
          <div className="md:col-span-7 flex flex-col justify-between h-full min-h-[340px]">
            <div className="space-y-3.5 max-h-76 overflow-y-auto pr-1">
              {fileList.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  {/* File Icon & Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                    {renderFileIcon(file.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate font-mono">
                        {file.name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {file.size}
                      </span>

                      {/* Blue Progress Bar (Matches Image 1) */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator / Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {file.status === 'completed' ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    )}

                    <button
                      onClick={() => handleReplace(file.id)}
                      title="Re-upload / Replace"
                      className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                    >
                      <RefreshCw size={13} />
                    </button>
                    <button
                      onClick={() => handleRemove(file.id)}
                      title="Remove"
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() =>
                  handleSimulatedUpload('medix_voice_note.mp3', '1.2 MB', 'audio')
                }
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Simulate Voice Upload</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveToPrescription}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-wide shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Add to Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
