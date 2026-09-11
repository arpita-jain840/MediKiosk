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
import type { PrescriptionData, MedicineItem } from '../../types/prescription';

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
        name: 'New Medicine 500mg',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '5 days',
        instructions: 'Take after meals',
      },
    ]);
  };

  const handleRemoveDraftMed = (index: number) => {
    setDraftMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const displayMedicines = isEditing ? draftMedicines : prescription.medicines;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Action Ribbon over Prescription Paper */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-800 tracking-wider uppercase">
            Official E-Prescription
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Edit Toggle */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 bg-white transition-colors cursor-pointer"
              >
                <X size={13} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
              >
                <Check size={13} />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200/90 text-xs font-bold text-teal-800 hover:border-teal-300 transition-all shadow-2xs cursor-pointer group"
            >
              <Edit3 size={13} className="group-hover:rotate-12 transition-transform" />
              <span>Quick Edit Sheet</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* AUTHENTIC MEDICAL PRESCRIPTION DOCUMENT (Paper styling)       */}
      {/* ============================================================ */}
      <div
        id="prescription-paper"
        className={`bg-white rounded-[2rem] p-5 sm:p-8 shadow-sm border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
          isEditing
            ? 'border-indigo-400 ring-4 ring-indigo-50/60'
            : 'border-slate-200/80'
        }`}
      >
        {/* Watermark ℞ symbol */}
        <div className="absolute right-6 top-24 pointer-events-none opacity-[0.03] select-none">
          <span className="font-serif text-[160px] font-black text-slate-900">℞</span>
        </div>

        {/* 1. Header: Clinic Details + Doctor Credentials */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-serif font-black text-base shadow-xs">
                  M
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                  MEDIKIS CARE CENTER & MULTISPECIALTY CLINIC
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Saket, New Delhi, India 110017 • Tel: +91 98101 23456
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Accredited NABH Facility #MK-DEL-2026
              </p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
              <h4 className="text-sm font-black text-slate-900">
                Dr. Ananya Sharma
              </h4>
              <p className="text-xs font-bold text-teal-700">
                MBBS, MD (Internal Medicine)
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                General Physician & Clinical Consultant
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                Reg: MCI-DL-2014-98421
              </span>
            </div>
          </div>
        </div>

        {/* 2. Patient Demographics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 bg-slate-50 rounded-2xl px-4 border border-slate-100 text-xs mb-4">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Patient Name
            </span>
            <p className="font-extrabold text-slate-900 truncate">{prescription.patientName}</p>
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

        {/* 3. Clinical Diagnosis */}
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Clinical Diagnosis:
            </span>
            {isEditing ? (
              <input
                type="text"
                value={draftDiagnosis}
                onChange={(e) => setDraftDiagnosis(e.target.value)}
                className="flex-1 text-xs font-bold px-3 py-1.5 bg-teal-50 border border-teal-300 rounded-lg text-teal-950 focus:outline-none"
              />
            ) : (
              <span className="text-xs font-black text-slate-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
                {prescription.diagnosis}
              </span>
            )}
          </div>
        </div>

        {/* 4. ℞ Prescribed Medications Section */}
        <div className="my-2 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-3xl text-teal-800 leading-none">
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
                className="flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Medication</span>
              </button>
            )}
          </div>

          {/* Desktop Table View (md and up) */}
          <div className="hidden md:block border border-slate-200/90 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine & Strength</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                  {isEditing && <th className="py-2.5 px-2 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayMedicines.map((med, idx) => (
                  <tr key={med.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3 font-extrabold text-slate-900">
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

                    <td className="py-2.5 px-3 font-medium text-slate-700">
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

                    <td className="py-2.5 px-3 font-semibold text-teal-700">
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

                    <td className="py-2.5 px-3 font-bold text-slate-700">
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

                    <td className="py-2.5 px-3 text-[11px] text-slate-500">
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

          {/* Mobile Card List View (Clean and uncluttered on small screens) */}
          <div className="flex md:hidden flex-col gap-2.5">
            {displayMedicines.map((med, idx) => (
              <div
                key={med.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleUpdateDraftMed(idx, 'name', e.target.value)}
                        className="text-xs font-bold p-1 bg-white border border-slate-200 rounded"
                      />
                    ) : (
                      <h4 className="font-extrabold text-slate-900">{med.name}</h4>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDraftMed(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <div className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Dose</span>
                    <span className="font-semibold text-slate-700">{med.dosage}</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Frequency</span>
                    <span className="font-semibold text-teal-700">{med.frequency}</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Duration</span>
                    <span className="font-semibold text-slate-700">{med.duration}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic bg-white/70 px-2 py-1 rounded-lg">
                  {med.instructions}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Clinical Advice, Diet & Follow-up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              General Advice & Hydration
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

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Follow-up Schedule
            </span>
            {isEditing ? (
              <input
                type="text"
                value={draftFollowUp}
                onChange={(e) => setDraftFollowUp(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-teal-700" />
                <p className="text-xs text-slate-800 font-bold">
                  {prescription.followUp}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 6. Multi-Modal Attachments rendered directly on sheet */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* Voice Dictation */}
          {prescription.voice && (
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-blue-950 block">
                      Doctor Voice Dictation
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      Duration: {prescription.voice.duration}
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  <Volume2 size={11} />
                  Audio Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-700 italic bg-white/80 p-2 rounded-xl border border-sky-100">
                "{prescription.voice.transcription}"
              </p>
            </div>
          )}

          {/* Handwritten Canvas Note */}
          {prescription.handwritten && (
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900">
                  ✍ Doctor Handwritten Clinical Ink
                </span>
                <span className="text-[10px] text-teal-600 font-mono">
                  Captured {prescription.handwritten.createdAt}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-teal-100 flex items-center justify-center">
                <img
                  src={prescription.handwritten.imageDataUrl}
                  alt="Handwritten prescription note"
                  className="max-h-36 object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {prescription.uploadedFiles.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Attached Diagnostic Reports ({prescription.uploadedFiles.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {prescription.uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {file.type === 'audio' ? (
                        <Music size={14} className="text-blue-600 shrink-0" />
                      ) : (
                        <FileText size={14} className="text-amber-600 shrink-0" />
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

        {/* 7. Footer: Doctor Signature & Verification QR */}
        <div className="pt-5 mt-5 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs">
              <ShieldCheck size={15} />
              <span>Digitally Verified & Valid at all Pharmacies</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Rx Hash: SHA256-MK-2026-98A7 • Medikis Saket Clinic
            </p>
          </div>

          <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
            <div className="h-9 w-40 flex items-end justify-start sm:justify-end border-b border-slate-400 pb-0.5">
              <span className="font-serif italic font-black text-lg text-teal-950 tracking-wider">
                Dr. Ananya Sharma
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-1 block">
              Dr. Ananya Sharma, MD
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Registered Practitioner Signature
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar: Preview & Send */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Eye size={15} />
          <span>Preview E-Rx</span>
        </button>

        <button
          type="button"
          onClick={onSend}
          disabled={isSending}
          className="flex items-center gap-2 px-6 sm:px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-black tracking-wide shadow-lg shadow-teal-700/25 transition-all cursor-pointer hover:scale-101"
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Dispatching...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Send to Patient App</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDocument;
