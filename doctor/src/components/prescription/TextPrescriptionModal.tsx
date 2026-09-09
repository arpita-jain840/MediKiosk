import React, { useState } from 'react';
import { X, Plus, Trash2, Pill, Stethoscope, Sparkles } from 'lucide-react';
import type { MedicineItem } from '../../types/prescription';

interface TextPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDiagnosis: string;
  currentMedicines: MedicineItem[];
  currentInstructions: string;
  onSave: (diagnosis: string, medicines: MedicineItem[], instructions: string) => void;
}

const COMMON_DIAGNOSES = [
  'Acute Allergic Sinusitis',
  'Acute Viral Bronchitis',
  'Allergic Rhinitis & Conjunctivitis',
  'Upper Respiratory Tract Infection',
  'Tension Headache & Fatigue',
  'Mild Essential Hypertension'
];

const MEDICINE_PRESETS = [
  { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Three times daily', duration: '5 days', instructions: 'Take after meals' },
  { name: 'Amoxicillin-Clav 625mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '7 days', instructions: 'Take with full glass of water' },
  { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily (Night)', duration: '10 days', instructions: 'May cause mild drowsiness' },
  { name: 'Fluticasone Propionate Spray', dosage: '2 sprays each nostril', frequency: 'Once daily (Morning)', duration: '14 days', instructions: 'Shake well before use' },
  { name: 'Saline Nasal Drops', dosage: '2-3 drops', frequency: 'Every 4-6 hours', duration: '7 days', instructions: 'Use as needed for congestion' },
];

export const TextPrescriptionModal: React.FC<TextPrescriptionModalProps> = ({
  isOpen,
  onClose,
  currentDiagnosis,
  currentMedicines,
  currentInstructions,
  onSave,
}) => {
  const [diagnosis, setDiagnosis] = useState(currentDiagnosis || 'Acute Allergic Sinusitis');
  const [instructions, setInstructions] = useState(currentInstructions || 'Take medications strictly on schedule. Drink at least 2.5L water daily.');
  const [medicines, setMedicines] = useState<MedicineItem[]>(
    currentMedicines.length > 0
      ? currentMedicines
      : [
          {
            id: 'm-1',
            name: 'Paracetamol 500mg',
            dosage: '1 tablet',
            frequency: 'Twice daily',
            duration: '5 days',
            instructions: 'Take after meals',
          },
        ]
  );

  if (!isOpen) return null;

  const handleAddRow = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: '',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '5 days',
        instructions: 'Take after meals',
      },
    ]);
  };

  const handleApplyPreset = (preset: typeof MEDICINE_PRESETS[0]) => {
    setMedicines((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: preset.name,
        dosage: preset.dosage,
        frequency: preset.frequency,
        duration: preset.duration,
        instructions: preset.instructions,
      },
    ]);
  };

  const handleUpdateMedicine = (index: number, field: keyof MedicineItem, value: string) => {
    setMedicines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validMedicines = medicines.filter((m) => m.name.trim().length > 0);
    onSave(diagnosis, validMedicines.length > 0 ? validMedicines : medicines, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Pill size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Write Prescription</h2>
              <p className="text-xs text-slate-400 font-medium">
                Enter diagnosis, medicine schedules, and patient clinical advice
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Diagnosis Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Stethoscope size={14} className="text-indigo-600" />
              <span>Primary Clinical Diagnosis</span>
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Allergic Rhinosinusitis"
              className="w-full text-xs font-semibold px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">
                Quick:
              </span>
              {COMMON_DIAGNOSES.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDiagnosis(d)}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900">
                Quick Medicine Presets (Click to append)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MEDICINE_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handleApplyPreset(p)}
                  className="text-xs font-semibold px-3 py-1 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl border border-indigo-200/80 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={12} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Medicines List Form */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Pill size={14} className="text-indigo-600" />
                <span>Prescribed Medications ({medicines.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-xl transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, index) => (
                <div
                  key={med.id || index}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                      #{index + 1} Medication
                    </span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove medicine"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Medicine Name */}
                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Medicine Name & Strength
                      </label>
                      <input
                        type="text"
                        required
                        value={med.name}
                        onChange={(e) => handleUpdateMedicine(index, 'name', e.target.value)}
                        placeholder="e.g. Paracetamol 500mg"
                        className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>

                    {/* Dosage */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleUpdateMedicine(index, 'dosage', e.target.value)}
                        placeholder="1 tablet"
                        className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>

                    {/* Frequency */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleUpdateMedicine(index, 'frequency', e.target.value)}
                        placeholder="Twice daily"
                        className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>

                    {/* Duration */}
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleUpdateMedicine(index, 'duration', e.target.value)}
                        placeholder="5 days"
                        className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Instructions
                      </label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleUpdateMedicine(index, 'instructions', e.target.value)}
                        placeholder="Take after meals with water"
                        className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Advice / Clinical Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Dietary & Patient Instructions
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Steam inhalation twice daily. Avoid cold beverages and dust exposure."
              className="w-full text-xs font-medium p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Add to Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
