import React, { useState, useMemo } from 'react';
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

  // Initial Prescription Data automatically populated
  const [prescription, setPrescription] = useState<PrescriptionData>({
    patientId: matched.id,
    patientName: matched.name,
    patientAge: matched.age,
    patientGender: matched.gender,
    patientWeight: matched.weight || '64 kg',
    patientBloodGroup: matched.bloodGroup || 'O+',
    doctorId: 'DOC-MELVIN-01',
    doctorName: 'Dr. Melvin Suharjo, MD',
    doctorQualification: 'MD, FCCP, Internal Medicine & Pulmonology',
    doctorSpecialty: 'Department of Clinical Medicine',
    doctorRegNo: 'MED-98421-US',
    clinicName: 'MEDIX HEALTH CENTER & SPECIALITY CLINIC',
    clinicAddress: '450 Lexington Avenue, Suite 1200, New York, NY 10017',
    clinicPhone: '+1 (212) 890-4400',
    consultationId: matched.id.replace('MK-', 'CNS-'),
    consultationDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    diagnosis: matched.complaint || 'Acute Allergic Rhinosinusitis & Upper Airway Congestion',
    clinicalNotes: 'Patient presented with 4-day history of facial tension, nasal congestion, and mild eye pain.',
    medicines: [
      {
        id: 'med-1',
        name: 'Paracetamol 500mg',
        dosage: '1 tablet',
        frequency: 'Three times daily',
        duration: '5 days',
        instructions: 'Take after meals',
      },
      {
        id: 'med-2',
        name: 'Desloratadine 5mg (Clarinex)',
        dosage: '1 tablet',
        frequency: 'Once daily (Night)',
        duration: '10 days',
        instructions: 'Take with full glass of water',
      },
      {
        id: 'med-3',
        name: 'Fluticasone Propionate 50mcg',
        dosage: '2 sprays each nostril',
        frequency: 'Twice daily',
        duration: '7 days',
        instructions: 'Shake gently before use',
      },
    ],
    instructions:
      'Warm steam inhalation twice daily. Maintain hydration > 2.5 Liters/day. Avoid cold drinks and direct air conditioning draft.',
    dietaryAdvice: 'Soft warm fluids, honey-ginger tea, low sodium diet.',
    followUp: '7 Days (or earlier if high fever develops)',
    voice: null,
    handwritten: null,
    uploadedFiles: [],
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
  });

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
    <div className="w-full max-w-[1550px] mx-auto pb-24 space-y-6 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-slate-950/95 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header with Auto-populated Patient & Doctor Info */}
      <PrescriptionHeader prescription={prescription} />

      {/* 2. Main Two-Column Prescription Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Prescription Creation Tools (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-4">
          <PrescriptionTools
            prescription={prescription}
            onOpenText={() => setIsTextModalOpen(true)}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenHandwritten={() => setIsHandwrittenModalOpen(true)}
          />
        </div>

        {/* RIGHT PANEL: Live Prescription Document (7 Cols) */}
        <div className="lg:col-span-7">
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
