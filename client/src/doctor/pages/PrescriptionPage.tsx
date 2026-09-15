import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { markPatientAsCompleted } from '../data/patientsData';
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
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../../config/api';

export const PrescriptionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [prescription, setPrescription] = useState<PrescriptionData>({
    patientId: id || '',
    patientName: '',
    patientAge: 30,
    patientGender: '',
    patientWeight: '60 kg',
    patientBloodGroup: 'O+',
    doctorId: 'DOC-1001',
    doctorName: 'Dr. Neha Sharma',
    doctorQualification: 'MBBS, MD (Internal Medicine)',
    doctorSpecialty: 'General Physician & Clinical Consultant',
    doctorRegNo: 'MCI-DL-2014-98421',
    clinicName: 'MEDIKIOSK CARE CENTER & MULTISPECIALTY CLINIC',
    clinicAddress: 'City Care Hospital · AIIA OPD Room 4B',
    clinicPhone: '+91 98765 43210',
    consultationId: `RX-${id || '1001'}`,
    consultationDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    diagnosis: '',
    clinicalNotes: '',
    medicines: [],
    instructions: 'Maintain daily vitals log. Take medications on time as prescribed.',
    dietaryAdvice: 'Warm fluids, low sodium fresh diet, adequate hydration.',
    followUp: '7 Days',
    voice: null,
    handwritten: null,
    uploadedFiles: [],
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    let isMounted = true;
    const fetchPatientData = async () => {
      if (!id) return;
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(getApiUrl(`/api/doctor/patient/${encodeURIComponent(id)}/blueprint`));
        if (!res.ok) throw new Error(`Failed to load patient record from database (${res.status})`);
        const data = await res.json();
        if (isMounted) {
          const pat = data.patient || {};
          const appt = data.appointment || {};
          const bp = data.blueprint || {};
          const existingMeds: string[] = bp.clinicalEntities?.medications || [];
          const initialMeds: MedicineItem[] = existingMeds.map((m: string, idx: number) => ({
            id: `med-${idx + 1}`,
            name: m,
            dosage: '1 dose',
            frequency: 'As directed',
            duration: '7 days',
            instructions: 'Take with water after meals',
          }));

          setPrescription((prev) => ({
            ...prev,
            patientId: pat.id || id,
            patientName: pat.name || 'Patient',
            patientAge: pat.age || 30,
            patientGender: pat.gender || 'Not Specified',
            patientBloodGroup: pat.bloodGroup || 'O+',
            patientWeight: bp.vitals?.weight || '60 kg',
            doctorName: appt.doctorName || prev.doctorName,
            doctorSpecialty: appt.doctorSpecialty || prev.doctorSpecialty,
            clinicAddress: `${appt.doctorHospital || 'City Care Hospital'} · ${appt.doctorRoom || 'Room 4B'}`,
            diagnosis: bp.chiefComplaint || 'OPD Clinical Consultation',
            clinicalNotes: bp.aiSummary ? `Clinical Summary: ${bp.aiSummary}` : `Patient presented with ${bp.chiefComplaint || 'symptoms'}.`,
            medicines: initialMeds.length > 0 ? initialMeds : [
              {
                id: 'med-1',
                name: 'Paracetamol 500mg',
                dosage: '1 tablet',
                frequency: 'Twice daily',
                duration: '3 days',
                instructions: 'Take after meals as needed for fever or discomfort',
              }
            ],
            instructions: bp.aiSummary ? `Clinical Note: ${bp.aiSummary}` : prev.instructions,
            consultationId: `RX-${pat.id || id}`,
          }));
        }
      } catch (err: any) {
        console.error('[PrescriptionPage] Error fetching patient from database:', err);
        if (isMounted) setLoadError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPatientData();
    return () => {
      isMounted = false;
    };
  }, [id]);

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

  const handleUpdatePrescription = (updated: Partial<PrescriptionData>) => {
    setPrescription((prev) => ({ ...prev, ...updated }));
    showToast('Prescription updated');
  };

  const handleSaveText = (diagnosis: string, medicines: MedicineItem[], instructions: string) => {
    setPrescription((prev) => ({
      ...prev,
      diagnosis,
      medicines,
      instructions,
    }));
    showToast(`${medicines.length} medicine(s) updated in prescription`);
  };

  const handleSaveVoice = (voice: VoiceAttachment) => {
    setPrescription((prev) => ({
      ...prev,
      voice,
    }));
    showToast('Voice dictation attached to prescription');
  };

  const handleSaveFiles = (files: UploadedPrescriptionFile[]) => {
    setPrescription((prev) => ({
      ...prev,
      uploadedFiles: files,
    }));
    showToast(`${files.length} diagnostic file(s) attached`);
  };

  const handleSaveHandwritten = (handwritten: HandwrittenAttachment) => {
    setPrescription((prev) => ({
      ...prev,
      handwritten,
    }));
    showToast('Handwritten clinical drawing saved to prescription');
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    try {
      const response = await fetch(
        getApiUrl(`/api/patient/prescription/${prescription.patientId}`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            doctor_name: prescription.doctorName || 'Dr. Sharma',
            message: 'Your prescription has been uploaded.',
            pdf_url: 'https://example.com/prescription.pdf',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Prescription notification failed (${response.status})`);
      }

      markPatientAsCompleted(prescription.patientId);
      setIsSendConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error('[Prescription] Unable to notify patient:', error);
      showToast('Unable to send prescription notification');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-xs">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
        <h3 className="text-sm font-bold text-slate-800">Loading Patient Prescription Profile from Database...</h3>
        <p className="text-xs text-slate-400 mt-1">Retrieving clinical blueprint and current medications.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-xs">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-3" />
        <h3 className="text-sm font-bold text-slate-800">Unable to Load Patient Record</h3>
        <p className="text-xs text-slate-400 mt-1">{loadError}</p>
      </div>
    );
  }

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
