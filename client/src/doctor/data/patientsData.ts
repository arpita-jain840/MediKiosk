export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  bp: string;
  pulse: string;
  spO2: string;
  temp: string;
  weight: string;
  complaint: string;
  allergies: string[];
  medications: string[];
  history: string;
  time: string;
  avatar: string;
  status: 'Waiting' | 'In Consultation' | 'Done';
  insurance: string;
  token?: number;
  triagePriority?: string;
  aiSummary?: string;
}

export const getCompletedPatientIds = (): string[] => {
  try {
    const data = localStorage.getItem('medix_completed_patients');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const markPatientAsCompleted = (patientId: string): void => {
  try {
    const completed = getCompletedPatientIds();
    if (!completed.includes(patientId)) {
      completed.push(patientId);
      localStorage.setItem('medix_completed_patients', JSON.stringify(completed));
    }
  } catch {
    // fallback
  }
};

export const getLivePatients = (): PatientRecord[] => {
  const completedIds = getCompletedPatientIds();
  return initialPatients.map((p) => ({
    ...p,
    status: completedIds.includes(p.id) ? 'Done' : p.status,
  }));
};

/**
 * Fetch real-time patient queue directly from FastAPI + PostgreSQL Layer 1/2/3
 * Falls back to local initialPatients if backend server is not reachable
 */
export const fetchLiveCockpitPatients = async (): Promise<PatientRecord[]> => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/doctor/patients');
    if (res.ok) {
      const data = await res.json();
      const completedIds = getCompletedPatientIds();
      return data.map((d: any, idx: number) => ({
        id: d.id || `MK-${100 + idx}`,
        name: d.name,
        age: d.age,
        gender: d.gender,
        bloodGroup: d.bloodGroup,
        bp: d.vitals?.bp || '120/80 mmHg',
        pulse: d.vitals?.pulse || '72 bpm',
        spO2: d.vitals?.spO2 || '98%',
        temp: d.vitals?.temp || '98.6 °F',
        weight: d.vitals?.weight || '65 kg',
        complaint: d.complaint || 'General medical follow-up',
        allergies: d.allergies || [],
        medications: d.clinicalEntities?.medications || [],
        history: d.clinicalEntities?.history || 'No prior surgeries',
        time: d.token ? `Token #${d.token}` : 'Just now',
        avatar: initialPatients[idx % initialPatients.length]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        status: completedIds.includes(d.id) ? 'Done' : (d.status === 'in_consultation' ? 'In Consultation' : 'Waiting'),
        insurance: 'ABHA Linked #14-MEDIX',
        token: d.token,
        triagePriority: d.triagePriority,
        aiSummary: d.aiSummary,
      }));
    }
  } catch (err) {
    console.warn('[MediKiosk] Server API not reachable, using offline dataset:', err);
  }
  return getLivePatients();
};

export const initialPatients: PatientRecord[] = [
  {
    id: 'MK-9824',
    name: 'Emma Watson',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    bp: '118/76 mmHg',
    pulse: '74 bpm',
    spO2: '99%',
    temp: '98.4 °F',
    weight: '58 kg',
    complaint: 'Seasonal allergies, nasal congestion & mild tension headache',
    allergies: ['Penicillin', 'Peanuts'],
    medications: ['Cetirizine 10mg', 'Vitamin D3'],
    history: 'Mild asthma diagnosed in 2021. No prior surgeries.',
    time: 'Token #1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'Blue Cross Shield #BC-99214',
    token: 1,
    triagePriority: 'Routine'
  },
  {
    id: 'MK-101',
    name: 'Sarah Hosten',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    bp: '124/82 mmHg',
    pulse: '80 bpm',
    spO2: '97%',
    temp: '99.1 °F',
    weight: '64 kg',
    complaint: 'Persistent dry bronchitis cough for 5 days',
    allergies: ['Sulfa drugs'],
    medications: ['Albuterol Inhaler'],
    history: 'Frequent seasonal upper respiratory infections.',
    time: 'Token #2',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    status: 'In Consultation',
    insurance: 'Aetna Health #AE-44129',
    token: 2,
    triagePriority: 'Specialist'
  },
  {
    id: 'MK-102',
    name: 'Dakota Smith',
    age: 52,
    gender: 'Male',
    bloodGroup: 'B+',
    bp: '138/88 mmHg',
    pulse: '76 bpm',
    spO2: '98%',
    temp: '98.6 °F',
    weight: '78 kg',
    complaint: 'Post-stroke neurological rehabilitation follow-up',
    allergies: ['Aspirin (mild sensitivity)'],
    medications: ['Atorvastatin 20mg', 'Clopidogrel 75mg'],
    history: 'Ischemic stroke 6 months ago; physical therapy ongoing.',
    time: 'Token #3',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'United Healthcare #UH-87231',
    token: 3,
    triagePriority: 'Specialist'
  },
  {
    id: 'MK-103',
    name: 'John Smith',
    age: 46,
    gender: 'Male',
    bloodGroup: 'O-',
    bp: '130/84 mmHg',
    pulse: '72 bpm',
    spO2: '98%',
    temp: '98.8 °F',
    weight: '82 kg',
    complaint: 'Liver function panel review & abdominal ultrasound follow-up',
    allergies: ['None'],
    medications: ['Spironolactone 50mg', 'Multivitamins'],
    history: 'Non-alcoholic fatty liver disease (NAFLD) stage 2.',
    time: 'Token #4',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'Cigna Global #CG-19203',
    token: 4,
    triagePriority: 'Routine'
  },
  {
    id: 'MK-104',
    name: 'Priya Sharma',
    age: 34,
    gender: 'Female',
    bloodGroup: 'B+',
    bp: '128/82 mmHg',
    pulse: '88 bpm',
    spO2: '98%',
    temp: '98.6 °F',
    weight: '62 kg',
    complaint: 'Chest tightness and mild breathlessness when climbing stairs',
    allergies: ['Penicillin', 'Dust'],
    medications: ['Metformin 500mg'],
    history: 'Type 2 diabetes mellitus diagnosed 4 years ago.',
    time: 'Token #5',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'ABHA Linked #14-2938-4471',
    token: 5,
    triagePriority: 'Specialist'
  },
  {
    id: 'MK-105',
    name: 'Rajesh Kumar',
    age: 59,
    gender: 'Male',
    bloodGroup: 'AB+',
    bp: '150/94 mmHg',
    pulse: '82 bpm',
    spO2: '96%',
    temp: '98.7 °F',
    weight: '84 kg',
    complaint: 'Hypertensive follow-up with recurring morning dizziness',
    allergies: ['Iodinated contrast'],
    medications: ['Amlodipine 5mg', 'Telmisartan 40mg'],
    history: 'Essential hypertension for 8 years.',
    time: 'Token #6',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'Star Health #SH-8812',
    token: 6,
    triagePriority: 'Routine'
  },
  {
    id: 'MK-106',
    name: 'Amina Begum',
    age: 41,
    gender: 'Female',
    bloodGroup: 'O+',
    bp: '114/72 mmHg',
    pulse: '70 bpm',
    spO2: '99%',
    temp: '98.2 °F',
    weight: '55 kg',
    complaint: 'Severe acute migraine with visual aura & nausea',
    allergies: ['NSAIDs'],
    medications: ['Sumatriptan 50mg PRN'],
    history: 'Chronic episodic migraine since age 25.',
    time: 'Token #7',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'HDFC ERGO #HD-3391',
    token: 7,
    triagePriority: 'Specialist'
  },
  {
    id: 'MK-107',
    name: 'David Chen',
    age: 23,
    gender: 'Male',
    bloodGroup: 'A-',
    bp: '120/78 mmHg',
    pulse: '65 bpm',
    spO2: '99%',
    temp: '98.4 °F',
    weight: '70 kg',
    complaint: 'Right knee swelling and twisting injury during football',
    allergies: ['None'],
    medications: ['Ibuprofen 400mg'],
    history: 'No prior orthopedic injuries or surgeries.',
    time: 'Token #8',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    status: 'Done',
    insurance: 'Care Health #CH-1992',
    token: 8,
    triagePriority: 'Low'
  },
  {
    id: 'MK-108',
    name: 'Fatima Noor',
    age: 67,
    gender: 'Female',
    bloodGroup: 'B-',
    bp: '136/84 mmHg',
    pulse: '75 bpm',
    spO2: '95%',
    temp: '98.6 °F',
    weight: '68 kg',
    complaint: 'COPD maintenance visit, mild exertion dyspnea with weather change',
    allergies: ['Codeine'],
    medications: ['Tiotropium Respimat', 'Formoterol'],
    history: 'COPD Stage 2, diagnosed in 2018.',
    time: 'Token #9',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'Max Bupa #MB-4410',
    token: 9,
    triagePriority: 'Specialist'
  },
  {
    id: 'MK-109',
    name: 'Vikram Malhotra',
    age: 38,
    gender: 'Male',
    bloodGroup: 'O+',
    bp: '122/80 mmHg',
    pulse: '78 bpm',
    spO2: '99%',
    temp: '98.6 °F',
    weight: '75 kg',
    complaint: 'Annual preventive executive health checkup and lipid panel',
    allergies: ['None'],
    medications: [],
    history: 'Family history of coronary artery disease.',
    time: 'Token #10',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'ICICI Lombard #IC-8802',
    token: 10,
    triagePriority: 'Low'
  }
];
