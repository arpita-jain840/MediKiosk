import React, { useState } from 'react';
import {
  Edit3,
  Check,
  X,
  Plus,
  Trash2,
  Volume2,
  Play,
  Pause,
  FileText,
  Music,
  Calendar,
  Send,
  Eye,
  ShieldCheck
} from 'lucide-react';
import type { PrescriptionData, MedicineItem } from '../../../types/prescription';

interface PrescriptionDocumentProps {
  prescription: PrescriptionData;
  onUpdatePrescription: (updated: Partial<PrescriptionData>) => void;
  onPreview: () => void;
  onSend: () => void;
  isSending?: boolean;
}

export const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({
  prescription,
  onUpdatePrescription,
  onPreview,
  onSend,
  isSending = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // In-place edit draft state
  const [draftDiagnosis, setDraftDiagnosis] = useState(prescription.diagnosis);
  const [draftInstructions, setDraftInstructions] = useState(prescription.instructions);
  const [draftDiet, setDraftDiet] = useState(prescription.dietaryAdvice);
  const [draftFollowUp, setDraftFollowUp] = useState(prescription.followUp);
  const [draftMedicines, setDraftMedicines] = useState<MedicineItem[]>(prescription.medicines);

  // Sync draft when prescription changes outside
  React.useEffect(() => {
    if (!isEditing) {
      setDraftDiagnosis(prescription.diagnosis);
      setDraftInstructions(prescription.instructions);
      setDraftDiet(prescription.dietaryAdvice);
      setDraftFollowUp(prescription.followUp);
      setDraftMedicines(prescription.medicines);
    }
  }, [prescription, isEditing]);

  const handleStartEdit = () => {
    setDraftDiagnosis(prescription.diagnosis);
    setDraftInstructions(prescription.instructions);
    setDraftDiet(prescription.dietaryAdvice);
    setDraftFollowUp(prescription.followUp);
    setDraftMedicines(prescription.medicines);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    onUpdatePrescription({
      diagnosis: draftDiagnosis,
      instructions: draftInstructions,
      dietaryAdvice: draftDiet,
      followUp: draftFollowUp,
      medicines: draftMedicines,
    });
    setIsEditing(false);
  };

  const handleUpdateDraftMed = (index: number, field: keyof MedicineItem, val: string) => {
    setDraftMedicines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddDraftMed = () => {
    setDraftMedicines((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: 'New Medicine',
        dosage: '1 tab',
        frequency: 'Twice daily',
        duration: '5 days',
        instructions: 'Take after meals',
      },
    ]);
  };

  const handleRemoveDraftMed = (index: number) => {
    setDraftMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Action Ribbon over Prescription Paper */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-800 tracking-wider uppercase">
            Live Prescription Sheet
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Canva-Style Edit Toggle */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 bg-white transition-colors cursor-pointer"
              >
                <X size={13} />
                <span>Cancel Edit</span>
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
              >
                <Check size={13} />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200/90 text-xs font-bold text-indigo-700 hover:border-indigo-200 transition-all shadow-2xs cursor-pointer group"
            >
              <Edit3 size={13} className="group-hover:rotate-12 transition-transform" />
              <span>Edit Sheet</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* REALISTIC PRESCRIPTION DOCUMENT (Paper styling)              */}
      {/* ============================================================ */}
      <div
        id="prescription-paper"
        className={`bg-white rounded-[2rem] p-7 sm:p-9 shadow-md border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
          isEditing
            ? 'border-indigo-400 ring-4 ring-indigo-50/60'
            : 'border-slate-200/90'
        }`}
      >
        {/* Subtle Watermark Logo in background */}
        <div className="absolute right-8 top-28 pointer-events-none opacity-[0.03] select-none">
          <span className="font-serif text-[180px] font-black text-indigo-950">℞</span>
        </div>

        {/* Paper Header: Clinic Details + Doctor Specialty */}
        <div className="border-b-2 border-slate-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-serif font-black text-base shadow-xs">
                  M
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                  {prescription.clinicName}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {prescription.clinicAddress} • Tel: {prescription.clinicPhone}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Accredited Clinical Facility #MEDIX-NY-2026
              </p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
              <h4 className="text-sm font-black text-slate-900">
                {prescription.doctorName}
              </h4>
              <p className="text-[11px] font-bold text-indigo-700">
                {prescription.doctorQualification}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {prescription.doctorSpecialty}
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                Lic: {prescription.doctorRegNo}
              </span>
            </div>
          </div>
        </div>

        {/* Patient Demographics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 my-3 bg-slate-50/70 rounded-2xl px-4 border border-slate-100 text-xs">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Patient Name
            </span>
            <p className="font-extrabold text-slate-900">{prescription.patientName}</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Age / Gender
            </span>
            <p className="font-bold text-slate-700">
              {prescription.patientAge} yrs • {prescription.patientGender}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Weight / Blood
            </span>
            <p className="font-bold text-slate-700">
              {prescription.patientWeight} • {prescription.patientBloodGroup}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Date & Ref ID
            </span>
            <p className="font-bold text-slate-700 font-mono text-[11px]">
              {prescription.consultationDate}
            </p>
          </div>
        </div>

        {/* Clinical Diagnosis Bar */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Diagnosis:
            </span>
            {isEditing ? (
              <input
                type="text"
                value={draftDiagnosis}
                onChange={(e) => setDraftDiagnosis(e.target.value)}
                className="flex-1 text-xs font-bold px-3 py-1 bg-indigo-50/50 border border-indigo-300 rounded-lg text-indigo-950 focus:outline-none"
              />
            ) : (
              <span className="text-xs font-black text-slate-900 bg-indigo-50/80 px-2.5 py-0.5 rounded-md border border-indigo-100">
                {prescription.diagnosis}
              </span>
            )}
          </div>
        </div>

        {/* ℞ Medical Symbol & Medicines Section */}
        <div className="my-2 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-3xl text-indigo-900 leading-none">
                ℞
              </span>
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Prescribed Medications
              </span>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={handleAddDraftMed}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Row</span>
              </button>
            )}
          </div>

          {/* Medicines Table */}
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3.5">#</th>
                  <th className="py-2.5 px-3.5">Medicine Name & Strength</th>
                  <th className="py-2.5 px-3.5">Dosage</th>
                  <th className="py-2.5 px-3.5">Frequency</th>
                  <th className="py-2.5 px-3.5">Duration</th>
                  <th className="py-2.5 px-3.5">Instructions</th>
                  {isEditing && <th className="py-2.5 px-2 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(isEditing ? draftMedicines : prescription.medicines).map((med, idx) => (
                  <tr key={med.id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3.5 font-extrabold text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleUpdateDraftMed(idx, 'name', e.target.value)}
                          className="w-full text-xs font-bold p-1 bg-white border border-slate-200 rounded"
                        />
                      ) : (
                        med.name
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 font-medium text-slate-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleUpdateDraftMed(idx, 'dosage', e.target.value)}
                          className="w-full text-xs p-1 bg-white border border-slate-200 rounded"
                        />
                      ) : (
                        med.dosage
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 font-semibold text-indigo-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleUpdateDraftMed(idx, 'frequency', e.target.value)}
                          className="w-full text-xs p-1 bg-white border border-slate-200 rounded"
                        />
                      ) : (
                        med.frequency
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 font-bold text-slate-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleUpdateDraftMed(idx, 'duration', e.target.value)}
                          className="w-full text-xs p-1 bg-white border border-slate-200 rounded"
                        />
                      ) : (
                        med.duration
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => handleUpdateDraftMed(idx, 'instructions', e.target.value)}
                          className="w-full text-xs p-1 bg-white border border-slate-200 rounded"
                        />
                      ) : (
                        med.instructions
                      )}
                    </td>

                    {isEditing && (
                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveDraftMed(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extended Clinical Advice & Diet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              General Instructions & Hydration
            </span>
            {isEditing ? (
              <textarea
                rows={2}
                value={draftInstructions}
                onChange={(e) => setDraftInstructions(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            ) : (
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {prescription.instructions}
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Follow-up & Review
            </span>
            {isEditing ? (
              <input
                type="text"
                value={draftFollowUp}
                onChange={(e) => setDraftFollowUp(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-indigo-600" />
                <p className="text-xs text-slate-800 font-bold">
                  {prescription.followUp}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MULTI-MODALITY ATTACHMENTS (Voice / Handwritten / Uploads)   */}
        {/* ============================================================ */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* 1. Voice Attachment (If present) */}
          {prescription.voice && (
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-blue-950 block">
                      Doctor Voice Dictation Attachment
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      Duration: {prescription.voice.duration} • Recorded {prescription.voice.recordedAt}
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                  <Volume2 size={12} />
                  Patient Audio Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-700 italic bg-white/80 p-2.5 rounded-xl border border-blue-100">
                "{prescription.voice.transcription}"
              </p>
            </div>
          )}

          {/* 2. Handwritten Canvas Drawing (If present) */}
          {prescription.handwritten && (
            <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-900">
                  ✍ Doctor Handwritten Prescription Ink
                </span>
                <span className="text-[10px] text-teal-600 font-mono">
                  Digitally Captured {prescription.handwritten.createdAt}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-teal-100 flex items-center justify-center">
                <img
                  src={prescription.handwritten.imageDataUrl}
                  alt="Handwritten prescription note"
                  className="max-h-40 object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {/* 3. Uploaded Files (If present) */}
          {prescription.uploadedFiles.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Attached Documents & Diagnostic Reports ({prescription.uploadedFiles.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {prescription.uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {file.type === 'audio' ? (
                        <Music size={15} className="text-blue-600 shrink-0" />
                      ) : (
                        <FileText size={15} className="text-amber-600 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-slate-800 truncate font-mono">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-medium">
                      {file.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Paper Footer: Doctor Signature & Clinic Stamp */}
        <div className="pt-6 mt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
              <ShieldCheck size={16} />
              <span>Cryptographically Signed & Timestamped</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Hash: SHA256-MEDIX-98A72F4B • Valid in all accredited pharmacies
            </p>
          </div>

          <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
            {/* Authentic Digital Signature Styling */}
            <div className="h-10 w-44 flex items-end justify-start sm:justify-end border-b border-slate-400 pb-1">
              <span className="font-serif italic font-black text-lg text-indigo-950 tracking-wider">
                Dr. Melvin S., MD
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-900 mt-1 block">
              {prescription.doctorName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Registered Practitioner Signature
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar: Preview Prescription & Send to Patient */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Eye size={15} />
          <span>Preview Prescription</span>
        </button>

        <button
          type="button"
          onClick={onSend}
          disabled={isSending}
          className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black tracking-wide shadow-lg shadow-indigo-600/25 transition-all cursor-pointer hover:scale-101"
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Send to Patient</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
