import type { LucideIcon } from "lucide-react";

export interface Symptom {
  label: string;
  severity: "mild" | "moderate" | "severe";
  since: string;
}

export interface DoctorNote {
  id: string;
  date: string;
  doctor: string;
  hospital: string;
  room: string;
  diagnosis: string;
  notes: string;
  prescription: string[];
  followUp?: string;
}

export interface AppointmentHistoryItem {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  hospital: string;
  room: string;
  token: string;
  status: "Completed" | "Cancelled" | "Upcoming";
  doctorSaid: string;
  prescription: string[];
  diagnosis: string;
  nextVisit?: string;
  vitalsAtVisit?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    spo2?: string;
    weight?: string;
  };
}

export interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  abha: string;
  allergies: string[];
  bloodGroup?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  profileImage?: string;
  symptoms?: Symptom[];
  notes?: string;
  medications: Array<{
    name: string;
    schedule: string;
    purpose?: string;
    prescribedBy?: string;
  }>;
  appointmentHistory?: AppointmentHistoryItem[];
}

export interface RecordCategory {
  id: string;
  label: string;
}

export interface MedicalRecordItem {
  id: number | string;
  cat: string;
  title: string;
  source: string;
  date: string;
  icon: LucideIcon;
  ocr?: string;
}

export interface ScriptQuestion {
  q: { en: string; hi: string };
  a: { en: string; hi: string };
}

export interface DoctorDirectoryItem {
  id: number;
  name: string;
  spec: string;
  hospital: string;
  km: string;
  rating: number;
  next: string;
}

export interface PriorityStyle {
  bg: string;
  fg: string;
  label: string;
}

export interface BlueprintSynthesisResult {
  message?: string;
  profileId?: string;
  triagePriority?: string;
  blueprint?: {
    chief_complaint?: string;
    chiefComplaint?: string;
    triage_priority?: string;
    triagePriority?: string;
    red_flags?: string[];
    redFlags?: string[];
    ai_summary?: string;
    aiSummary?: string;
    token?: number;
    hpi?: {
      onset?: string;
      duration?: string;
      character?: string;
      radiation?: string;
      triggers?: string;
      relieving?: string;
    };
    vitals?: Record<string, string>;
    clinical_entities?: {
      medications?: string[];
      allergies?: string[];
      symptoms?: string[];
      history?: string;
    };
    ayush_pariksha?: {
      prakriti?: string;
      agni?: string;
      koshtha?: string;
      ahara_vihara?: string;
    };
  };
  appointment?: {
    token?: number;
    status?: string;
  };
}
