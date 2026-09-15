import type {
  RecordCategory,
  ScriptQuestion,
  PriorityStyle,
} from "../types";

export const RECORD_CATEGORIES: RecordCategory[] = [
  { id: "all", label: "All" },
  { id: "blood", label: "Blood tests" },
  { id: "imaging", label: "Imaging" },
  { id: "rx", label: "Prescriptions" },
  { id: "reports", label: "Reports" },
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

export const PRIORITY_STYLES: Record<string, PriorityStyle> = {
  Low: { bg: "#EAF4EC", fg: "#3F8F5F", label: "Low priority" },
  Routine: { bg: "#EAF1F8", fg: "#2E6FA3", label: "Routine visit" },
  Specialist: { bg: "#FBEEE5", fg: "#C4622E", label: "Specialist care recommended" },
  Emergency: { bg: "#FAEAEA", fg: "#C23B3B", label: "Emergency — seek care now" },
};
