import type { LucideIcon } from "lucide-react";

export interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  abha: string;
  allergies: string[];
  bloodGroup?: string;
  phone?: string;
  medications: Array<{
    name: string;
    schedule: string;
  }>;
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
