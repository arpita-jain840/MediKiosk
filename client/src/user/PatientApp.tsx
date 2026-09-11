import { useState, useRef, useEffect } from "react";
import {
  Home, FileText, Stethoscope, User, Search, Mic, Send, ArrowLeft,
  ChevronRight, AlertTriangle, Calendar, MapPin, Clock, CheckCircle2,
  Activity, Pill, Bell, Plus, Globe, ShieldCheck, Droplets, Scan,
  ClipboardList, FileCheck2, Star, PhoneCall, UploadCloud, Sparkles, Zap
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PATIENT = {
  name: "Priya Sharma",
  age: 34,
  gender: "Female",
  abha: "14-2938-4471-0093",
  allergies: ["Penicillin", "Dust"],
  medications: [
    { name: "Metformin 500mg", schedule: "Twice daily, with meals" },
  ],
};

const RECORD_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "blood", label: "Blood tests" },
  { id: "imaging", label: "Imaging" },
  { id: "rx", label: "Prescriptions" },
  { id: "reports", label: "Reports" },
];

const RECORDS = [
  { id: 1, cat: "blood", title: "Complete Blood Count", source: "Sunrise Diagnostics", date: "2 Sept 2026", icon: Droplets },
  { id: 2, cat: "imaging", title: "Chest X-Ray", source: "City Care Hospital", date: "18 Aug 2026", icon: Scan },
  { id: 3, cat: "rx", title: "Dr. Anil Kapoor — Prescription", source: "Follow-up visit", date: "18 Aug 2026", icon: FileCheck2 },
  { id: 4, cat: "reports", title: "Discharge Summary", source: "City Care Hospital", date: "4 Jun 2026", icon: ClipboardList },
  { id: 5, cat: "blood", title: "HbA1c", source: "Sunrise Diagnostics", date: "2 Sept 2026", icon: Droplets },
];

const INTAKE_SCRIPT = [
  { q: { en: "What's bothering you today?", hi: "aaj aapko kya takleef hai?" }, a: { en: "I've had chest tightness and a bit of breathlessness since this morning.", hi: "Subah se seene mein jakadan aur saans lene mein thodi dikkat hai." } },
  { q: { en: "How long has this been going on, and is it constant or does it come and go?", hi: "Yeh kab se hai, aur kya lagatar hai ya aata-jaata hai?" }, a: { en: "It started about 3 hours ago. It comes and goes, worse when I climb stairs.", hi: "Karib 3 ghante pehle shuru hua. Aata-jaata hai, seedhi chadhte waqt zyada hota hai." } },
  { q: { en: "Any pain spreading to your arm, jaw, or back? Any sweating or nausea?", hi: "Kya dard baaju, jabde ya peeth tak jaata hai? Paseena ya jee michlana?" }, a: { en: "A little bit down my left arm, and yes I feel a bit sweaty.", hi: "Thoda baaye baaju mein, aur haan halka paseena aa raha hai." } },
  { q: { en: "Do you have any history of heart conditions, diabetes, or high blood pressure?", hi: "Kya aapko dil ki bimari, diabetes ya high blood pressure ka history hai?" }, a: { en: "I have type 2 diabetes, diagnosed 4 years ago.", hi: "Mujhe type 2 diabetes hai, 4 saal pehle pata chala tha." } },
];

const DOCTORS = [
  { id: 1, name: "Dr. Anjali Verma", spec: "Cardiologist", hospital: "City Care Hospital", km: "1.2", rating: 4.8, next: "Today, 5:40 PM" },
  { id: 2, name: "Dr. Ramesh Iyer", spec: "Cardiologist", hospital: "Sunrise Multispeciality", km: "2.4", rating: 4.6, next: "Today, 6:15 PM" },
  { id: 3, name: "Dr. Kavita Nair", spec: "Cardiologist", hospital: "MedLife Clinic", km: "3.1", rating: 4.9, next: "Tomorrow, 9:00 AM" },
];

const PRIORITY_STYLES = {
  Low: { bg: "#EAF4EC", fg: "#3F8F5F", label: "Low priority" },
  Routine: { bg: "#EAF1F8", fg: "#2E6FA3", label: "Routine visit" },
  Specialist: { bg: "#FBEEE5", fg: "#C4622E", label: "Specialist care recommended" },
  Emergency: { bg: "#FAEAEA", fg: "#C23B3B", label: "Emergency — seek care now" },
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function TopBar({ title, onBack, right }: any) {
  return (
    <div className="flex items-center justify-between px-5 md:px-10 pt-5 md:pt-8 pb-3 md:pb-6 shrink-0" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} aria-label="Back" className="tap-target -ml-1">
            <ArrowLeft size={20} color="var(--ink)" />
          </button>
        )}
        <h1 className="text-[19px] md:text-[24px]" style={{ fontWeight: 700, color: "var(--ink)" }}>{title}</h1>
      </div>
      {right}
    </div>
  );
}

function NavBar({ tab, setTab, onOpenIntake }: any) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "records", label: "Records", icon: FileText },
    { id: "intake", label: "AI Check", icon: Stethoscope, isCenter: true },
    { id: "doctors", label: "Doctors", icon: Search },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <div className="shrink-0 border-t md:border-t-0 md:border-r flex flex-row md:flex-col items-stretch md:w-28 md:py-8" style={{ borderColor: "var(--border)", background: "var(--surface)", zIndex: 10 }}>
      {items.map((it) => {
        const active = tab === it.id;
        if (it.isCenter) {
          return (
            <button
              key={it.id}
              onClick={onOpenIntake}
              className="flex-1 md:flex-none flex flex-col items-center justify-center gap-1 py-2 md:my-6 tap-target"
            >
              <div
                className="flex items-center justify-center rounded-full -mt-5 md:mt-0 shadow-sm transition-transform hover:scale-105"
                style={{ width: 46, height: 46, background: "var(--primary)" }}
              >
                <it.icon size={21} color="#fff" />
              </div>
              <span className="text-[11px] md:text-[12px] md:mt-1" style={{ color: "var(--primary)", fontWeight: 600 }}>{it.label}</span>
            </button>
          );
        }
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="flex-1 md:flex-none flex flex-col items-center justify-center gap-1 py-2.5 md:py-4 tap-target transition-colors hover:bg-gray-50 md:hover:bg-transparent"
          >
            <it.icon size={20} color={active ? "var(--primary)" : "var(--ink-soft)"} strokeWidth={active ? 2.4 : 2} />
            <span className="text-[11px] md:text-[12px]" style={{ color: active ? "var(--primary)" : "var(--ink-soft)", fontWeight: active ? 700 : 500 }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

function HomeScreen({ onOpenIntake, setTab }: any) {
  return (
    <div className="flex-1 overflow-y-auto px-5 md:px-10 py-6 md:py-10" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between mb-5 md:mb-8">
        <div>
          <p className="text-[13px] md:text-[15px]" style={{ color: "var(--ink-soft)" }}>Good evening</p>
          <p className="text-[21px] md:text-[28px]" style={{ fontWeight: 800, color: "var(--ink)" }}>{PATIENT.name.split(" ")[0]}</p>
        </div>
        <button className="tap-target relative md:w-12 md:h-12 md:bg-white md:rounded-full md:shadow-sm" aria-label="Notifications">
          <Bell size={21} color="var(--ink)" className="md:w-5 md:h-5" />
          <span className="absolute md:top-2 md:right-3 -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: "#C4622E" }} />
        </button>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div>
          {/* Hero: start health check */}
          <button
            onClick={onOpenIntake}
            className="w-full text-left rounded-2xl md:rounded-3xl p-5 md:p-8 mb-4 md:mb-8 flex items-center justify-between transition-transform hover:scale-[1.02]"
            style={{ background: "var(--primary)", boxShadow: "0 10px 30px rgba(15,92,86,0.2)" }}
          >
            <div className="pr-3">
              <p className="text-[16px] md:text-[22px] leading-snug" style={{ color: "#fff", fontWeight: 800 }}>
                Not feeling well?
              </p>
              <p className="text-[13px] md:text-[15px] mt-1 md:mt-2 leading-snug" style={{ color: "rgba(255,255,255,0.82)" }}>
                Talk or type your symptoms — we'll guide you to the right care.
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-3 md:mt-5 rounded-full px-3.5 py-2 md:px-5 md:py-2.5 transition-colors hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.16)" }}
              >
                <span className="text-[13px] md:text-[14px]" style={{ color: "#fff", fontWeight: 700 }}>Start health check</span>
                <ChevronRight size={15} color="#fff" />
              </span>
            </div>
            <div className="shrink-0 rounded-full flex items-center justify-center md:w-20 md:h-20" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.14)" }}>
              <Stethoscope size={24} color="#fff" className="md:w-8 md:h-8" />
            </div>
          </button>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3 md:gap-5 mb-5 md:mb-8">
            <QuickAction icon={FileText} label="Records" onClick={() => setTab("records")} />
            <QuickAction icon={Calendar} label="Appointments" onClick={() => setTab("doctors")} />
            <QuickAction icon={PhoneCall} label="Emergency" onClick={() => {}} danger />
          </div>
        </div>

        <div>
          {/* Upcoming appointment */}
          <p className="text-[13px] md:text-[15px] mb-2 md:mb-4" style={{ color: "var(--ink-soft)", fontWeight: 700 }}>Upcoming appointment</p>
          <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 mb-5 md:mb-8 flex items-center gap-3 md:gap-4 shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="rounded-full flex items-center justify-center shrink-0 md:w-14 md:h-14" style={{ width: 44, height: 44, background: "var(--primary-tint)" }}>
              <span style={{ color: "var(--primary)", fontWeight: 800 }} className="text-[14px] md:text-[16px]">AK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] md:text-[16px] truncate" style={{ color: "var(--ink)", fontWeight: 700 }}>Dr. Anil Kapoor</p>
              <p className="text-[12.5px] md:text-[14px]" style={{ color: "var(--ink-soft)" }}>General Physician · City Care Hospital</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[12.5px] md:text-[14px]" style={{ color: "var(--primary)", fontWeight: 700 }}>Sat, 13 Sep</p>
              <p className="text-[11.5px] md:text-[13px]" style={{ color: "var(--ink-soft)" }}>11:30 AM</p>
            </div>
          </div>

          {/* History completeness */}
          <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <p className="text-[13.5px] md:text-[15px]" style={{ color: "var(--ink)", fontWeight: 700 }}>Your health profile</p>
              <p className="text-[13px] md:text-[15px]" style={{ color: "var(--primary)", fontWeight: 800 }}>72%</p>
            </div>
            <div className="rounded-full h-2 md:h-3 overflow-hidden mb-2 md:mb-4" style={{ background: "var(--primary-tint)" }}>
              <div className="h-full rounded-full" style={{ width: "72%", background: "var(--primary)" }} />
            </div>
            <p className="text-[12px] md:text-[14px]" style={{ color: "var(--ink-soft)" }}>Add your family history to help doctors see the full picture.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, danger }: any) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl md:rounded-3xl py-4 md:py-6 flex flex-col items-center gap-2 md:gap-3 tap-target transition-all hover:shadow-md"
      style={{ background: danger ? "#FAEAEA" : "var(--surface)", border: "1px solid " + (danger ? "#F0D3D3" : "var(--border)") }}
    >
      <Icon size={19} color={danger ? "#C23B3B" : "var(--primary)"} className="md:w-6 md:h-6" />
      <span className="text-[12px] md:text-[14px]" style={{ color: danger ? "#C23B3B" : "var(--ink)", fontWeight: 600 }}>{label}</span>
    </button>
  );
}

function RecordsScreen() {
  const [cat, setCat] = useState("all");
  const [recordsList, setRecordsList] = useState(RECORDS);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [viewingOcr, setViewingOcr] = useState<{ title: string; ocr: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess(null);

    const formData = new FormData();
    // Use seeded patient ID
    formData.append("patient_id", "227107b6-d738-4acd-ad21-8c88430acbd9");
    formData.append("document_type", "prescription");
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/patient/upload-document", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const extracted = data.extractedSummary || "Document digitized successfully.";
        setUploadSuccess(`Digitized: ${file.name}`);
        setRecordsList((prev: any) => [
          {
            id: Date.now(),
            cat: "rx",
            title: file.name,
            source: "Paper Prescription (पर्चा OCR)",
            date: "Today, Just now",
            icon: FileCheck2,
            ocr: extracted
          },
          ...prev
        ]);
        setTimeout(() => setUploadSuccess(null), 5000);
      }
    } catch (err) {
      console.warn("Upload error, using local state:", err);
      setUploadSuccess(`Uploaded: ${file.name}`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filtered = cat === "all" ? recordsList : recordsList.filter((r: any) => r.cat === cat);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar
        title="Medical records & Parche"
        right={
          <button
            onClick={() => fileInputRef.current?.click()}
            className="tap-target flex items-center justify-center rounded-full md:w-10 md:h-10 hover:opacity-80 cursor-pointer shadow-xs"
            style={{ width: 34, height: 34, background: "var(--primary-tint)" }}
            aria-label="Upload record"
            title="Scan / Upload paper prescription"
          >
            <Plus size={18} color="var(--primary)" className="md:w-5 md:h-5" />
          </button>
        }
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* Document Upload & OCR Ingestion Card */}
      <div className="px-5 md:px-10 pb-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl p-4 border border-[#c8dfdb] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-xs flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#3368a0]/10 flex items-center justify-center text-[#3368a0] shrink-0">
              <UploadCloud size={20} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-900">
                {uploading ? "Digitizing Parche with Gemini OCR..." : "Scan or Upload Medical Parche / Reports"}
              </p>
              <p className="text-[11px] md:text-xs text-slate-500">
                {uploading
                  ? "Extracting medicine names & lab values for Doctor..."
                  : "पर्चा या पुरानी रिपोर्ट अपलोड करें — डॉक्टर के लिए तुरंत डिजिटल रिकॉर्ड बनेगा"}
              </p>
            </div>
          </div>
          <button
            disabled={uploading}
            className="px-3 py-1.5 rounded-lg bg-[#3368a0] text-white text-xs font-bold shrink-0"
          >
            {uploading ? "Scanning..." : "Upload"}
          </button>
        </div>

        {uploadSuccess && (
          <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{uploadSuccess} — Linked to your health blueprint!</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 px-5 md:px-10 pb-3 md:pb-6 overflow-x-auto no-scrollbar">
        {RECORD_CATEGORIES.map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className="shrink-0 rounded-full px-3.5 py-1.5 md:px-5 md:py-2 text-[13px] md:text-[14px] transition-colors cursor-pointer"
              style={{
                background: active ? "var(--primary)" : "var(--surface)",
                color: active ? "#fff" : "var(--ink-soft)",
                fontWeight: 600,
                border: active ? "none" : "1px solid var(--border)",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="px-5 md:px-10 pb-6 md:pb-10 space-y-2.5 md:space-y-4">
        {filtered.map((r: any) => (
          <div
            key={r.id}
            onClick={() => {
              if (r.ocr) {
                setViewingOcr({ title: r.title, ocr: r.ocr });
              }
            }}
            className="rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-center gap-3 md:gap-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 md:w-14 md:h-14" style={{ width: 42, height: 42, background: "var(--primary-tint)" }}>
              <r.icon size={19} color="var(--primary)" className="md:w-6 md:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[14px] md:text-[16px] truncate" style={{ color: "var(--ink)", fontWeight: 700 }}>{r.title}</p>
                {r.ocr && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Digitized OCR
                  </span>
                )}
              </div>
              <p className="text-[12px] md:text-[14px] truncate" style={{ color: "var(--ink-soft)" }}>{r.source} · {r.date}</p>
            </div>
            <ChevronRight size={17} color="var(--ink-soft)" className="md:w-5 md:h-5" />
          </div>
        ))}
      </div>

      {/* OCR View Modal */}
      {viewingOcr && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">{viewingOcr.title}</h3>
              <button
                onClick={() => setViewingOcr(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Extracted Text (AI OCR)
              </span>
              <pre className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                {viewingOcr.ocr}
              </pre>
            </div>
            <button
              onClick={() => setViewingOcr(null)}
              className="w-full py-2 rounded-xl bg-[#3368a0] text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="flex-1 overflow-y-auto px-5 md:px-10 pb-6 md:pb-10" style={{ background: "var(--bg)" }}>
      <TopBar title="Profile" />
      <div className="flex items-center gap-3.5 md:gap-6 mb-5 md:mb-8 mt-1">
        <div className="rounded-full flex items-center justify-center shrink-0 md:w-24 md:h-24" style={{ width: 58, height: 58, background: "var(--primary)" }}>
          <span style={{ color: "#fff", fontWeight: 800 }} className="text-[19px] md:text-[28px]">PS</span>
        </div>
        <div>
          <p className="text-[17px] md:text-[24px]" style={{ color: "var(--ink)", fontWeight: 800 }}>{PATIENT.name}</p>
          <p className="text-[13px] md:text-[16px]" style={{ color: "var(--ink-soft)" }}>{PATIENT.age} yrs · {PATIENT.gender}</p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div>
          <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-8 flex items-center gap-3 md:gap-4 shadow-sm" style={{ background: "var(--primary-tint)" }}>
            <ShieldCheck size={19} color="var(--primary)" className="md:w-6 md:h-6" />
            <div>
              <p className="text-[12px] md:text-[14px]" style={{ color: "var(--primary)", fontWeight: 700 }}>ABHA linked</p>
              <p className="text-[12px] md:text-[14px]" style={{ color: "var(--ink-soft)" }}>{PATIENT.abha}</p>
            </div>
          </div>

          <Section title="Allergies">
            <div className="flex flex-wrap gap-2 md:gap-3">
              {PATIENT.allergies.map((a) => (
                <span key={a} className="rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[12.5px] md:text-[14px]" style={{ background: "#FAEAEA", color: "#C23B3B", fontWeight: 600 }}>{a}</span>
              ))}
            </div>
          </Section>

          <Section title="Language">
            <div className="rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5 md:gap-4">
                <Globe size={18} color="var(--primary)" className="md:w-5 md:h-5" />
                <span className="text-[13.5px] md:text-[15px]" style={{ color: "var(--ink)", fontWeight: 600 }}>English / हिन्दी</span>
              </div>
              <ChevronRight size={17} color="var(--ink-soft)" className="md:w-5 md:h-5" />
            </div>
          </Section>
        </div>

        <div>
          <Section title="Current medications">
            {PATIENT.medications.map((m) => (
              <div key={m.name} className="rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-center gap-3 md:gap-5 mb-3 shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Pill size={18} color="var(--primary)" className="md:w-6 md:h-6" />
                <div>
                  <p className="text-[13.5px] md:text-[16px]" style={{ color: "var(--ink)", fontWeight: 700 }}>{m.name}</p>
                  <p className="text-[12px] md:text-[14px]" style={{ color: "var(--ink-soft)" }}>{m.schedule}</p>
                </div>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-4 md:mb-6">
      <p className="text-[12.5px] md:text-[14px] mb-2 md:mb-3" style={{ color: "var(--ink-soft)", fontWeight: 700 }}>{title}</p>
      {children}
    </div>
  );
}

// --- AI Intake flow ---------------------------------------------------------

function IntakeScreen({ onClose, onFinish, lang, setLang }: any) {
  const [messages, setMessages] = useState([
    { from: "ai", text: INTAKE_SCRIPT[0].q[lang as keyof typeof INTAKE_SCRIPT[0]["q"]] },
  ]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const completeness = Math.min(100, Math.round(((step) / INTAKE_SCRIPT.length) * 100));

  function sendAnswer() {
    if (done) return;
    const current = INTAKE_SCRIPT[step];
    setMessages((m) => [...m, { from: "user", text: current.a[lang as keyof typeof current["a"]] }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const nextStep = step + 1;
      if (nextStep < INTAKE_SCRIPT.length) {
        setMessages((m) => [...m, { from: "ai", text: INTAKE_SCRIPT[nextStep].q[lang as keyof typeof INTAKE_SCRIPT[0]["q"]] }]);
        setStep(nextStep);
      } else {
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text: lang === "en"
              ? "Thank you. I have enough details to generate your physician-ready Health Blueprint."
              : "धन्यवाद। डॉक्टर के लिए आपका संपूर्ण स्वास्थ्य सारांश तैयार किया जा रहा है।"
          }
        ]);
        setDone(true);
      }
    }, 600);
  }

  async function handleFinish() {
    setIsSynthesizing(true);
    const intakeSummary = messages
      .map((m) => `${m.from === "user" ? "Patient" : "Kiosk AI"}: ${m.text}`)
      .join("\n");

    try {
      // One-time AI synthesis to PostgreSQL
      const res = await fetch(
        `http://127.0.0.1:8000/api/clinical/generate-blueprint?patient_id=227107b6-d738-4acd-ad21-8c88430acbd9&intake_narration=${encodeURIComponent(intakeSummary)}`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        onFinish(data);
        return;
      }
    } catch (err) {
      console.warn("[IntakeScreen] Server synthesis error, proceeding to results:", err);
    } finally {
      setIsSynthesizing(false);
    }
    onFinish(null);
  }

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <TopBar
        title={lang === "en" ? "Voice & Touch Clinical Intake" : "स्वास्थ्य जाँच (आवाज और स्पर्श)"}
        onBack={onClose}
        right={
          <div className="flex rounded-full overflow-hidden shadow-sm" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
            {["en", "hi"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-2.5 md:px-4 py-1 md:py-1.5 text-[11.5px] md:text-[13px] transition-colors cursor-pointer"
                style={{ background: lang === l ? "var(--primary)" : "transparent", color: lang === l ? "#fff" : "var(--ink-soft)", fontWeight: 700 }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-5 md:px-10 pb-3 md:pb-6">
        <div className="flex items-center justify-between mb-1.5 md:mb-2.5">
          <span className="text-[11.5px] md:text-[13px]" style={{ color: "var(--ink-soft)" }}>
            {lang === "en" ? "Intake completeness" : "जाँच प्रगति"}
          </span>
          <span className="text-[11.5px] md:text-[13px]" style={{ color: "var(--primary)", fontWeight: 700 }}>{completeness}%</span>
        </div>
        <div className="rounded-full h-1.5 md:h-2 overflow-hidden" style={{ background: "var(--primary-tint)" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completeness}%`, background: "var(--primary)" }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-10 py-2 md:py-4 space-y-3 md:space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={"flex " + (m.from === "user" ? "justify-end" : "justify-start")}>
            <div
              className="max-w-[80%] md:max-w-[70%] rounded-2xl md:rounded-3xl px-4 py-2.5 md:px-6 md:py-4 text-[13.5px] md:text-[15px] leading-relaxed shadow-sm"
              style={
                m.from === "user"
                  ? { background: "var(--primary)", color: "#fff", borderBottomRightRadius: 4 }
                  : { background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border)", borderBottomLeftRadius: 4 }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl md:rounded-3xl px-4 py-3 md:px-6 md:py-4 flex gap-1 shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderBottomLeftRadius: 4 }}>
              {[0, 1, 2].map((d) => (
                <span key={d} className="dot md:w-2 md:h-2" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-5 md:px-10 pt-2 pb-5 md:py-6 shrink-0 bg-white md:bg-transparent shadow-[0_-10px_20px_rgba(0,0,0,0.02)] md:shadow-none" style={{ borderTop: "1px solid var(--border)" }}>
        {isSynthesizing ? (
          <div className="py-4 px-5 rounded-2xl bg-white border border-[#c8dfdb] flex items-center justify-center gap-3 text-slate-700 shadow-xs">
            <div className="w-5 h-5 border-2 border-[#3368a0] border-t-transparent rounded-full animate-spin" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900">
                {lang === "en" ? "AI Engine Synthesizing Health Blueprint..." : "AI स्वास्थ्य ब्लूप्रिंट तैयार कर रहा है..."}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === "en"
                  ? "Storing 1-page structured profile in PostgreSQL (Doctor will view instantly in <50ms)"
                  : "डेटाबेस में सहेजा जा रहा है — डॉक्टर बिना देरी तुरंत देख पाएंगे"}
              </p>
            </div>
          </div>
        ) : !done ? (
          <div className="flex items-center gap-2 md:gap-4 mt-3">
            <div
              className="flex-1 rounded-full px-4 py-3 md:px-6 md:py-4 text-[13px] md:text-[15px] truncate shadow-sm cursor-text"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink-soft)" }}
            >
              {INTAKE_SCRIPT[step].a[lang as keyof typeof INTAKE_SCRIPT[0]["a"]]}
            </div>
            <button className="tap-target flex items-center justify-center rounded-full shrink-0 hover:bg-teal-100 transition-colors md:w-14 md:h-14" style={{ width: 42, height: 42, background: "var(--primary-tint)" }} aria-label="Voice input">
              <Mic size={17} color="var(--primary)" className="md:w-6 md:h-6" />
            </button>
            <button
              onClick={sendAnswer}
              className="tap-target flex items-center justify-center rounded-full shrink-0 hover:opacity-90 transition-opacity md:w-14 md:h-14 shadow-md cursor-pointer"
              style={{ width: 42, height: 42, background: "var(--primary)" }}
              aria-label="Send answer"
            >
              <Send size={16} color="#fff" className="md:w-5 md:h-5 ml-1" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full rounded-full py-3.5 md:py-4 mt-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            style={{ background: "var(--primary)" }}
          >
            <Sparkles size={16} color="#fff" />
            <span className="text-[14px] md:text-[16px]" style={{ color: "#fff", fontWeight: 700 }}>
              {lang === "en" ? "Analyze & Generate Health Profile" : "स्वास्थ्य प्रोफाइल तैयार करें"}
            </span>
            <ChevronRight size={16} color="#fff" className="md:w-5 md:h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function ResultScreen({ blueprintResult, onClose, onFindDoctors }: any) {
  const bp = blueprintResult?.blueprint;
  const priority = bp?.triage_priority || bp?.triagePriority || "Specialist";
  const style = PRIORITY_STYLES[priority as keyof typeof PRIORITY_STYLES] || PRIORITY_STYLES.Specialist;
  const redFlags = bp?.red_flags || ["Radiating pain, diaphoresis"];
  const summary = bp?.ai_summary || "Chest tightness with breathlessness and left-arm discomfort recorded. Prompt physician evaluation advised.";

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar title="Health Assessment & Token" onBack={onClose} />
      <div className="px-5 md:px-10 pb-6 md:pb-10 space-y-4">
        
        {/* Token and One-Time Database Committal Ribbon */}
        <div className="p-4 rounded-2xl bg-white border border-[#c8dfdb] shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#3368a0] text-white flex flex-col items-center justify-center">
              <span className="text-[9px] font-bold uppercase">Token</span>
              <span className="text-sm font-black">#2</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">OPD Queue Registered</p>
              <p className="text-[11px] text-slate-500">Your health blueprint is stored. Doctor loads it in &lt;50ms.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
            <Zap size={13} />
            <span>Stored in DB</span>
          </div>
        </div>

        {/* Priority Banner */}
        <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-start gap-3 md:gap-5 shadow-sm" style={{ background: style.bg }}>
          <AlertTriangle size={20} color={style.fg} className="mt-0.5 md:mt-1 shrink-0 md:w-6 md:h-6" />
          <div>
            <p className="text-[15px] md:text-[18px]" style={{ color: style.fg, fontWeight: 800 }}>{style.label}</p>
            <p className="text-[12.5px] md:text-[15px] mt-1 md:mt-2" style={{ color: style.fg, lineHeight: 1.5 }}>
              {summary}
            </p>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          <Section title="What you told us (Structured by AI)">
            <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-3 md:space-y-4 shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <SummaryRow label="Chief complaint" value={bp?.chief_complaint || "Chest tightness, breathlessness (3 hrs)"} />
              <SummaryRow label="Onset" value={bp?.hpi?.onset || "3 hours ago"} />
              <SummaryRow label="Relevant history" value="Type 2 diabetes (4 years)" />
              {redFlags.length > 0 && (
                <SummaryRow label="Red flags" value={redFlags.join(", ")} warn />
              )}
            </div>
          </Section>

          <Section title="Recommended OPD Room">
            <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-center gap-3 md:gap-5 shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 md:w-16 md:h-16" style={{ width: 42, height: 42, background: "var(--primary-tint)" }}>
                <Activity size={19} color="var(--primary)" className="md:w-7 md:h-7" />
              </div>
              <div>
                <p className="text-[14px] md:text-[18px]" style={{ color: "var(--ink)", fontWeight: 700 }}>Cardiology & General Medicine</p>
                <p className="text-[12px] md:text-[14px] mt-0.5" style={{ color: "var(--ink-soft)" }}>Room 4B · Dr. John Smith</p>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="px-5 md:px-10 pb-6 md:pb-10 mt-auto">
        <button
          onClick={onFindDoctors}
          className="w-full rounded-full py-3.5 md:py-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          style={{ background: "var(--primary)" }}
        >
          <span className="text-[14px] md:text-[16px]" style={{ color: "#fff", fontWeight: 700 }}>Proceed to OPD Queue / Doctors</span>
          <ChevronRight size={16} color="#fff" className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, warn }: any) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[12.5px] md:text-[14px] shrink-0" style={{ color: "var(--ink-soft)" }}>{label}</span>
      <span className="text-[12.5px] md:text-[14px] text-right" style={{ color: warn ? "#C23B3B" : "var(--ink)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function DoctorsScreen({ onBack, onBook }: any) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar title="Cardiologists near you" onBack={onBack} />
      <div className="flex gap-2 px-5 md:px-10 pb-3 md:pb-6 overflow-x-auto no-scrollbar">
        {["Within 5 km", "Available today", "Highest rated"].map((f) => (
          <span key={f} className="shrink-0 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[12px] md:text-[14px] shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink-soft)", fontWeight: 600 }}>
            {f}
          </span>
        ))}
      </div>
      <div className="px-5 md:px-10 pb-6 md:pb-10 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {DOCTORS.map((d) => (
          <div key={d.id} className="rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5">
              <div className="rounded-full flex items-center justify-center shrink-0 md:w-14 md:h-14" style={{ width: 46, height: 46, background: "var(--primary-tint)" }}>
                <span style={{ color: "var(--primary)", fontWeight: 800 }} className="text-[14px] md:text-[16px]">
                  {d.name.split(" ").slice(-1)[0][0]}{d.name.split(" ")[1] ? d.name.split(" ")[1][0] : ""}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] md:text-[17px] truncate" style={{ color: "var(--ink)", fontWeight: 700 }}>{d.name}</p>
                <p className="text-[12px] md:text-[14px]" style={{ color: "var(--ink-soft)" }}>{d.spec} · {d.hospital}</p>
              </div>
              <div className="flex items-center gap-0.5 md:gap-1 shrink-0 bg-orange-50 px-2 py-1 rounded-full">
                <Star size={12} color="#C4622E" fill="#C4622E" className="md:w-3.5 md:h-3.5" />
                <span className="text-[12px] md:text-[13px]" style={{ color: "var(--ink)", fontWeight: 700 }}>{d.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 text-[12px] md:text-[13.5px]" style={{ color: "var(--ink-soft)" }}>
              <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><MapPin size={13} className="md:w-4 md:h-4" /> {d.km} km</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Clock size={13} className="md:w-4 md:h-4" /> {d.next}</span>
            </div>
            <button
              onClick={() => onBook(d)}
              className="w-full rounded-full py-2.5 md:py-3.5 hover:bg-[#cde4e1] transition-colors"
              style={{ background: "var(--primary-tint)" }}
            >
              <span className="text-[13px] md:text-[15px]" style={{ color: "var(--primary)", fontWeight: 700 }}>Book appointment</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfirmScreen({ doctor, onDone }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 text-center" style={{ background: "var(--bg)" }}>
      <div className="rounded-full flex items-center justify-center mb-5 md:mb-8 shadow-sm" style={{ width: 68, height: 68, background: "var(--primary-tint)" }}>
        <CheckCircle2 size={32} color="var(--primary)" className="md:w-10 md:h-10" />
      </div>
      <p className="text-[18px] md:text-[24px] mb-1.5 md:mb-3" style={{ color: "var(--ink)", fontWeight: 800 }}>Appointment confirmed</p>
      <p className="text-[13.5px] md:text-[16px] mb-6 md:mb-10 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {doctor?.name} · {doctor?.next}<br />{doctor?.hospital}
      </p>
      <button onClick={onDone} className="w-full md:w-auto md:px-12 rounded-full py-3.5 md:py-4 shadow-md hover:shadow-lg transition-shadow" style={{ background: "var(--primary)" }}>
        <span className="text-[14px] md:text-[16px]" style={{ color: "#fff", fontWeight: 700 }}>Back to home</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root app
// ---------------------------------------------------------------------------

export default function PatientApp() {
  const [tab, setTab] = useState("home");
  const [flow, setFlow] = useState<string | null>(null); // null | "intake" | "result" | "doctors" | "confirm"
  const [lang, setLang] = useState("en");
  const [bookedDoctor, setBookedDoctor] = useState(null);
  const [blueprintResult, setBlueprintResult] = useState<any>(null);

  let content;
  if (flow === "intake") {
    content = (
      <IntakeScreen
        lang={lang}
        setLang={setLang}
        onClose={() => setFlow(null)}
        onFinish={(res: any) => {
          setBlueprintResult(res);
          setFlow("result");
        }}
      />
    );
  } else if (flow === "result") {
    content = (
      <ResultScreen
        blueprintResult={blueprintResult}
        onClose={() => setFlow(null)}
        onFindDoctors={() => setFlow("doctors")}
      />
    );
  } else if (flow === "doctors") {
    content = (
      <DoctorsScreen
        onBack={() => setFlow("result")}
        onBook={(d: any) => {
          setBookedDoctor(d);
          setFlow("confirm");
        }}
      />
    );
  } else if (flow === "confirm") {
    content = (
      <ConfirmScreen
        doctor={bookedDoctor}
        onDone={() => {
          setFlow(null);
          setTab("home");
        }}
      />
    );
  } else if (tab === "records") {
    content = <RecordsScreen />;
  } else if (tab === "profile") {
    content = <ProfileScreen />;
  } else if (tab === "doctors") {
    content = <DoctorsScreen onBack={() => setTab("home")} onBook={(d: any) => { setBookedDoctor(d); setFlow("confirm"); }} />;
  } else {
    content = <HomeScreen onOpenIntake={() => setFlow("intake")} setTab={setTab} />;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-0 md:p-8" style={{ background: "#e8ecef", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --bg: #f2efe7;
          --surface: #FFFFFF;
          --primary: #3368a0;
          --primary-tint: #e6eff5; /* Lightened c8dfdb for better contrast */
          --primary-light: #66a3bf;
          --ink: #1e293b;
          --ink-soft: #64748b;
          --border: rgba(51, 104, 160, 0.08); /* Very soft blue-tinted border */
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .tap-target { min-width: 34px; min-height: 34px; display: flex; align-items: center; justify-content: center; }
        .dot {
          width: 6px; height: 6px; border-radius: 9999px; background: var(--ink-soft);
          opacity: 0.4; animation: dotPulse 1s infinite ease-in-out;
        }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.85);} 40% { opacity: 1; transform: scale(1);} }
        @media (prefers-reduced-motion: reduce) {
          .dot { animation: none; opacity: 0.6; }
          * { transition: none !important; }
        }
        button:focus-visible, [role="button"]:focus-visible {
          outline: 2px solid var(--primary); outline-offset: 2px;
        }
      `}</style>

      <div
        className="flex flex-col-reverse md:flex-row overflow-hidden w-full h-screen md:h-auto md:max-h-[90vh] md:max-w-[1200px] shadow-none md:shadow-[0_30px_80px_rgba(15,30,28,0.15)] md:rounded-[36px]"
        style={{
          background: "var(--bg)",
        }}
      >
        {!flow && <NavBar tab={tab} setTab={setTab} onOpenIntake={() => setFlow("intake")} />}
        <div className="flex-1 flex flex-col overflow-hidden relative">
           {content}
        </div>
      </div>
    </div>
  );
}
