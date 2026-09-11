import { Droplets, Scan, FileCheck2, ClipboardList } from "lucide-react";
import type {
  PatientProfile,
  RecordCategory,
  MedicalRecordItem,
  ScriptQuestion,
  DoctorDirectoryItem,
  PriorityStyle,
} from "../types";

export const DEFAULT_PATIENT: PatientProfile = {
  name: "Priya Sharma",
  age: 34,
  gender: "Female",
  abha: "14-2938-4471-0093",
  allergies: ["Penicillin", "Dust"],
  medications: [
    { name: "Metformin 500mg", schedule: "Twice daily, with meals" },
  ],
};

export const RECORD_CATEGORIES: RecordCategory[] = [
  { id: "all", label: "All" },
  { id: "blood", label: "Blood tests" },
  { id: "imaging", label: "Imaging" },
  { id: "rx", label: "Prescriptions" },
  { id: "reports", label: "Reports" },
];

export const INITIAL_RECORDS: MedicalRecordItem[] = [
  { id: 1, cat: "blood", title: "Complete Blood Count", source: "Sunrise Diagnostics", date: "2 Sept 2026", icon: Droplets },
  { id: 2, cat: "imaging", title: "Chest X-Ray", source: "City Care Hospital", date: "18 Aug 2026", icon: Scan },
  { id: 3, cat: "rx", title: "Dr. Anil Kapoor — Prescription", source: "Follow-up visit", date: "18 Aug 2026", icon: FileCheck2 },
  { id: 4, cat: "reports", title: "Discharge Summary", source: "City Care Hospital", date: "4 Jun 2026", icon: ClipboardList },
  { id: 5, cat: "blood", title: "HbA1c", source: "Sunrise Diagnostics", date: "2 Sept 2026", icon: Droplets },
];

export const INTAKE_SCRIPT: ScriptQuestion[] = [
  {
    q: { en: "What's bothering you today?", hi: "आज आपको क्या तकलीफ़ है?" },
    a: { en: "I've had chest tightness and a bit of breathlessness since this morning.", hi: "सुबह से सीने में जकड़न और सांस लेने में थोड़ी दिक्कत है।" }
  },
  {
    q: { en: "How long has this been going on, and is it constant or does it come and go?", hi: "यह कब से है, और क्या लगातार है या आता-जाता है?" },
    a: { en: "It started about 3 hours ago. It comes and goes, worse when I climb stairs.", hi: "करीब 3 घंटे पहले शुरू हुआ। आता-जाता है, सीढ़ी चढ़ते वक्त ज़्यादा होता है।" }
  },
  {
    q: { en: "Any pain spreading to your arm, jaw, or back? Any sweating or nausea?", hi: "क्या दर्द बाजू, जबड़े या पीठ तक जाता है? पसीना या जी मिचलाना?" },
    a: { en: "A little bit down my left arm, and yes I feel a bit sweaty.", hi: "थोड़ा बाएं बाजू में, और हाँ हल्का पसीना आ रहा है।" }
  },
  {
    q: { en: "Do you have any history of heart conditions, diabetes, or high blood pressure?", hi: "क्या आपको दिल की बीमारी, डायबिटीज या हाई ब्लड प्रेशर की हिस्ट्री है?" },
    a: { en: "I have type 2 diabetes, diagnosed 4 years ago.", hi: "मुझे टाइप 2 डायबिटीज है, 4 साल पहले पता चला था।" }
  },
];

export const DOCTORS: DoctorDirectoryItem[] = [
  { id: 1, name: "Dr. Anjali Verma", spec: "Cardiologist", hospital: "City Care Hospital", km: "1.2", rating: 4.8, next: "Today, 5:40 PM" },
  { id: 2, name: "Dr. Ramesh Iyer", spec: "Cardiologist", hospital: "Sunrise Multispeciality", km: "2.4", rating: 4.6, next: "Today, 6:15 PM" },
  { id: 3, name: "Dr. Kavita Nair", spec: "Cardiologist", hospital: "MedLife Clinic", km: "3.1", rating: 4.9, next: "Tomorrow, 9:00 AM" },
];

export const PRIORITY_STYLES: Record<string, PriorityStyle> = {
  Low: { bg: "#EAF4EC", fg: "#3F8F5F", label: "Low priority" },
  Routine: { bg: "#EAF1F8", fg: "#2E6FA3", label: "Routine visit" },
  Specialist: { bg: "#FBEEE5", fg: "#C4622E", label: "Specialist care recommended" },
  Emergency: { bg: "#FAEAEA", fg: "#C23B3B", label: "Emergency — seek care now" },
};
