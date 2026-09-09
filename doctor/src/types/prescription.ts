export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface VoiceAttachment {
  id: string;
  audioUrl?: string;
  duration: string;
  recordedAt: string;
  transcription: string;
}

export interface UploadedPrescriptionFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'png' | 'jpg' | 'doc' | 'audio' | 'zip';
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  uploadedAt: string;
}

export interface HandwrittenAttachment {
  id: string;
  imageDataUrl: string;
  createdAt: string;
}

export interface PrescriptionData {
  patientId: string;
  patientName: string;
  patientAge: number | string;
  patientGender: string;
  patientWeight: string;
  patientBloodGroup: string;
  doctorId: string;
  doctorName: string;
  doctorQualification: string;
  doctorSpecialty: string;
  doctorRegNo: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  consultationId: string;
  consultationDate: string;

  diagnosis: string;
  clinicalNotes?: string;
  medicines: MedicineItem[];
  instructions: string;
  dietaryAdvice: string;
  followUp: string;

  voice?: VoiceAttachment | null;
  handwritten?: HandwrittenAttachment | null;
  uploadedFiles: UploadedPrescriptionFile[];

  status: 'DRAFT' | 'SENT';
  createdAt: string;
}
