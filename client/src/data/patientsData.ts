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
    time: 'Just now (QR Scanned)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'Blue Cross Shield #BC-99214'
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
    time: '10:00 am',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    status: 'In Consultation',
    insurance: 'Aetna Health #AE-44129'
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
    time: '11:00 am',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'United Healthcare #UH-87231'
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
    time: '12:00 pm',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    status: 'Waiting',
    insurance: 'Cigna Global #CG-19203'
  }
];
