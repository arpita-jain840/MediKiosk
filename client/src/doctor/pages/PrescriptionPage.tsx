import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { initialPatients, markPatientAsCompleted } from '../data/patientsData';
import type {
  PrescriptionData,
  MedicineItem,
  VoiceAttachment,
  UploadedPrescriptionFile,
  HandwrittenAttachment
} from '../types/prescription';
import { PrescriptionHeader } from '../components/prescription/PrescriptionHeader';
import { PrescriptionTools } from '../components/prescription/PrescriptionTools';
import { PrescriptionDocument } from '../components/prescription/PrescriptionDocument';
import { TextPrescriptionModal } from '../components/prescription/TextPrescriptionModal';
import { VoicePrescriptionModal } from '../components/prescription/VoicePrescriptionModal';
import { UploadPrescriptionModal } from '../components/prescription/UploadPrescriptionModal';
import { HandwrittenCanvasModal } from '../components/prescription/HandwrittenCanvasModal';
import { PrescriptionPreviewModal } from '../components/prescription/PrescriptionPreviewModal';
import { SendConfirmationModal } from '../components/prescription/SendConfirmationModal';
import { PrescriptionSuccessModal } from '../components/prescription/PrescriptionSuccessModal';
import { CheckCircle2 } from 'lucide-react';

export const PrescriptionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Matched patient or default fallback
  const matched = useMemo(() => {
    return initialPatients.find((p) => p.id === id) || initialPatients[0];
  }, [id]);

  // Initial Prescription Data automatically populated based on patient
  const [prescription, setPrescription] = useState<PrescriptionData>(() => {
    const isMigraine = matched.id === 'PAT-1002' || matched.name.includes('Priyanshi');
    const isHypertension = matched.id === 'PAT-1003';
    const isSkin = matched.id === 'PAT-1004';

    const defaultDiagnosis = isMigraine
      ? 'Acute Migraine with Photophobia & Nausea'
      : isHypertension
      ? 'Essential Hypertension (Stage 1) & Tension Fatigue'
      : isSkin
      ? 'Allergic Contact Dermatitis & Pruritus'
      : 'Acute Bronchitis & Upper Airway Congestion';

    const defaultMeds: MedicineItem[] = isMigraine
      ? [
          {
            id: 'med-1',
            name: 'Sumatriptan 50mg',
            dosage: '1 tablet',
            frequency: 'At onset of acute migraine attack',
            duration: 'As needed',
            instructions: 'Take immediately with water at first sign of aura',
          },
          {
            id: 'med-2',
            name: 'Naproxen Sodium 500mg',
            dosage: '1 tablet',
            frequency: 'Twice daily',
            duration: '3 days',
            instructions: 'Take with food to prevent gastric discomfort',
          },
          {
            id: 'med-3',
            name: 'Domperidone 10mg',
            dosage: '1 tablet',
            frequency: 'Before meals (PRN)',
            duration: '5 days',
            instructions: 'Take 30 mins before food for nausea control',
          },
        ]
      : [
          {
            id: 'med-1',
            name: 'Paracetamol 500mg',
            dosage: '1 tablet',
            frequency: 'Three times daily',
            duration: '5 days',
            instructions: 'Take after meals for fever & body ache',
          },
          {
            id: 'med-2',
            name: 'Levocetirizine 5mg',
            dosage: '1 tablet',
            frequency: 'Once daily (Night)',
            duration: '7 days',
            instructions: 'Take at bedtime with water',
          },
          {
            id: 'med-3',
            name: 'Ambroxol Syrup 30mg/5ml',
            dosage: '10 ml',
            frequency: 'Twice daily',
            duration: '5 days',
            instructions: 'Take with warm water after food',
          },
        ];

    return {
      patientId: matched.id,
      patientName: matched.name,
      patientAge: matched.age,
      patientGender: matched.gender,
      patientWeight: matched.weight || '56 kg',
      patientBloodGroup: matched.bloodGroup || 'B+',
      doctorId: 'DOC-1001',
      doctorName: 'Dr. Ananya Sharma',
      doctorQualification: 'MBBS, MD (Internal Medicine)',
      doctorSpecialty: 'General Physician & Clinical Consultant',
      doctorRegNo: 'MCI-DL-2014-98421',
      clinicName: 'MEDIKIS CARE CENTER & MULTISPECIALTY CLINIC',
      clinicAddress: 'Saket, New Delhi, India 110017',
      clinicPhone: '+91 98101 23456',
      consultationId: matched.id.replace('PAT-', 'RX-'),
      consultationDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      diagnosis: defaultDiagnosis,
      clinicalNotes: `Patient presented with ${matched.complaint}. Vital parameters recorded at Kiosk Desk.`,
      medicines: defaultMeds,
      instructions: isMigraine
        ? 'Rest in a dark quiet room during acute flare-up. Maintain hydration > 2.5 Liters/day. Avoid direct bright screen glare and missed meals.'
        : 'Warm steam inhalation twice daily. Maintain hydration > 2.5 Liters/day. Avoid cold drinks and direct AC drafts.',
      dietaryAdvice: isMigraine
        ? 'Avoid excess caffeine, aged cheese, MSG and processed foods. Regular sleep schedule.'
        : 'Warm fluids, honey-ginger tea, low sodium fresh diet.',
      followUp: isMigraine
        ? '10 Days (or earlier if severe headache persists)'
        : '7 Days (or earlier if high fever develops)',
      voice: null,
      handwritten: null,
      uploadedFiles: [],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };
  });

  // Re-sync if patient ID changes
  useEffect(() => {
    setPrescription((prev) => ({
      ...prev,
      patientId: matched.id,
      patientName: matched.name,
      patientAge: matched.age,
      patientGender: matched.gender,
      patientWeight: matched.weight || '56 kg',
      patientBloodGroup: matched.bloodGroup || 'B+',
      consultationId: matched.id.replace('PAT-', 'RX-'),
    }));
  }, [matched]);

  // Modals state
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHandwrittenModalOpen, setIsHandwrittenModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Update Prescription helper
  const handleUpdatePrescription = (updated: Partial<PrescriptionData>) => {
    setPrescription((prev) => ({ ...prev, ...updated }));
    showToast('Prescription updated');
  };

  // Save from Text Modal
  const handleSaveText = (diagnosis: string, medicines: MedicineItem[], instructions: string) => {
    setPrescription((prev) => ({
      ...prev,
      diagnosis,
      medicines,
      instructions,
    }));
    showToast(`${medicines.length} medicine(s) updated in prescription`);
  };

  // Save from Voice Modal
  const handleSaveVoice = (voice: VoiceAttachment) => {
    setPrescription((prev) => ({
      ...prev,
      voice,
    }));
    showToast('Voice dictation attached to prescription');
  };

  // Save from Upload Modal
  const handleSaveFiles = (files: UploadedPrescriptionFile[]) => {
    setPrescription((prev) => ({
      ...prev,
      uploadedFiles: files,
    }));
    showToast(`${files.length} diagnostic file(s) attached`);
  };

  // Save from Handwritten Modal
  const handleSaveHandwritten = (handwritten: HandwrittenAttachment) => {
    setPrescription((prev) => ({
      ...prev,
      handwritten,
    }));
    showToast('Handwritten clinical drawing saved to prescription');
  };

  // Confirm Send to Patient
  const handleConfirmSend = () => {
    setIsSending(true);

    // Simulate backend API call
    setTimeout(() => {
      // Mark patient as completed in shared local store
      markPatientAsCompleted(prescription.patientId);

      setIsSending(false);
      setIsSendConfirmOpen(false);
      setIsSuccessOpen(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-24 space-y-5 sm:space-y-6 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 sm:right-8 z-50 bg-slate-950/95 backdrop-blur text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header with Auto-populated Patient & Doctor Info */}
      <PrescriptionHeader prescription={prescription} />

      {/* 2. Main Responsive Prescription Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT PANEL: 4 Option Tools (5 Cols on Desktop) */}
        <div className="xl:col-span-5 flex flex-col gap-4 sticky xl:top-4 z-10">
          <PrescriptionTools
            prescription={prescription}
            onOpenText={() => setIsTextModalOpen(true)}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenHandwritten={() => setIsHandwrittenModalOpen(true)}
          />
        </div>

        {/* RIGHT PANEL: Authentic Medical Prescription Sheet (7 Cols on Desktop) */}
        <div className="xl:col-span-7">
          <PrescriptionDocument
            prescription={prescription}
            onUpdatePrescription={handleUpdatePrescription}
            onPreview={() => setIsPreviewModalOpen(true)}
            onSend={() => setIsSendConfirmOpen(true)}
            isSending={isSending}
          />
        </div>
      </div>

      {/* Modals & Overlays */}
      <TextPrescriptionModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        currentDiagnosis={prescription.diagnosis}
        currentMedicines={prescription.medicines}
        currentInstructions={prescription.instructions}
        onSave={handleSaveText}
      />

      <VoicePrescriptionModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentVoice={prescription.voice}
        onSaveVoice={handleSaveVoice}
      />

      <UploadPrescriptionModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentFiles={prescription.uploadedFiles}
        onSaveFiles={handleSaveFiles}
      />

      <HandwrittenCanvasModal
        isOpen={isHandwrittenModalOpen}
        onClose={() => setIsHandwrittenModalOpen(false)}
        currentHandwritten={prescription.handwritten}
        onSaveHandwritten={handleSaveHandwritten}
      />

      <PrescriptionPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onSend={() => setIsSendConfirmOpen(true)}
        prescription={prescription}
      />

      <SendConfirmationModal
        isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        onConfirm={handleConfirmSend}
        prescription={prescription}
        isSending={isSending}
      />

      <PrescriptionSuccessModal
        isOpen={isSuccessOpen}
        patientName={prescription.patientName}
        patientId={prescription.patientId}
      />
    </div>
  );
};

export default PrescriptionPage;
