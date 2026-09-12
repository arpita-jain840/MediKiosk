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

type SeedPatient = Pick<PatientRecord, 'id' | 'name' | 'age' | 'gender' | 'bloodGroup' | 'allergies' | 'token' | 'status'> & {
  abha: string;
  status: PatientRecord['status'];
};

const avatarFor = (gender: string) => gender === 'Female'
  ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80'
  : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80';

const seedPatients: SeedPatient[] = [
  { id: 'dd282916-ac7a-4ca8-a6c0-e63ffc62066f', name: 'Emma Watson', age: 28, gender: 'Female', bloodGroup: 'O+', abha: '14-9824-3321-0012', allergies: ['Penicillin', 'Peanuts'], token: 1, status: 'Waiting' },
  { id: '89f13786-8f6b-4063-bbfa-9beec534a303', name: 'Sarah Hosten', age: 34, gender: 'Female', bloodGroup: 'A+', abha: '14-4412-8823-0101', allergies: ['Sulfa drugs'], token: 2, status: 'In Consultation' },
  { id: 'a5493a2e-120b-452f-b68a-3f0ec2c6589b', name: 'Dakota Smith', age: 52, gender: 'Male', bloodGroup: 'B+', abha: '14-8723-5561-0102', allergies: ['Aspirin'], token: 3, status: 'Waiting' },
  { id: '06fd6100-3150-42b7-bb47-63b4a2d6f421', name: 'John Smith', age: 46, gender: 'Male', bloodGroup: 'O-', abha: '14-1920-9942-0103', allergies: [], token: 4, status: 'Waiting' },
  { id: '7047ac9d-9586-42fb-8728-acb9b52a10da', name: 'Priya Sharma', age: 34, gender: 'Female', bloodGroup: 'B+', abha: '14-2938-4471-0093', allergies: ['Penicillin', 'Dust'], token: 5, status: 'Waiting' },
  { id: '34808a5f-e712-4fbc-8e22-501c4b4e1527', name: 'Rajesh Kumar', age: 59, gender: 'Male', bloodGroup: 'AB+', abha: '14-5582-7719-0104', allergies: ['Iodinated contrast'], token: 6, status: 'Waiting' },
  { id: '0579aca3-b4e7-4f7a-a3ff-dfd6f53ade48', name: 'Amina Begum', age: 41, gender: 'Female', bloodGroup: 'O+', abha: '14-7712-4439-0105', allergies: ['NSAIDs (gastric pain)'], token: 7, status: 'Waiting' },
  { id: '78dfff66-0a9c-4638-86dc-70eeb3aa28b1', name: 'David Chen', age: 23, gender: 'Male', bloodGroup: 'A-', abha: '14-3382-9901-0106', allergies: [], token: 8, status: 'Done' },
  { id: '603bc261-c74a-4f88-b35f-236c01b61e39', name: 'Fatima Noor', age: 67, gender: 'Female', bloodGroup: 'B-', abha: '14-9901-2244-0107', allergies: ['Codeine'], token: 9, status: 'Waiting' },
  { id: '84759d82-b1bf-48d7-9cb8-ee41518d7837', name: 'Vikram Malhotra', age: 38, gender: 'Male', bloodGroup: 'O+', abha: '14-1182-6632-0108', allergies: [], token: 10, status: 'Waiting' },
];

export const initialPatients: PatientRecord[] = seedPatients.map((patient) => ({
    ...patient,
    bp: '118/76',
    pulse: '72',
    spO2: '98',
    temp: '98.4°F',
    weight: '64 kg',
    complaint: 'Mild headache and fatigue',
    medications: ['Paracetamol'],
    history: 'No significant medical history',
    time: patient.token ? `Token #${patient.token}` : '',
    avatar: avatarFor(patient.gender),
    insurance: `ABHA ${patient.abha}`,
    triagePriority: 'Routine',
}));

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
    // Ignore unavailable local storage.
  }
};

export const getLivePatients = (): PatientRecord[] => {
  const completedIds = getCompletedPatientIds();
  return initialPatients.map((patient) => ({
    ...patient,
    status: completedIds.includes(patient.id) ? 'Done' : patient.status,
  }));
};

export const fetchLiveCockpitPatients = async (): Promise<PatientRecord[]> => {
  const response = await fetch('http://127.0.0.1:8000/api/doctor/patients');
  if (!response.ok) {
    throw new Error(`Unable to load doctor patients (${response.status})`);
  }

  const data = await response.json();
  const completedIds = getCompletedPatientIds();
  return data.map((patient: any): PatientRecord => ({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    bp: patient.vitals?.bp || '',
    pulse: patient.vitals?.pulse || '',
    spO2: patient.vitals?.spO2 || '',
    temp: patient.vitals?.temp || '',
    weight: patient.vitals?.weight || '',
    complaint: patient.complaint || '',
    allergies: patient.allergies || [],
    medications: patient.clinicalEntities?.medications || [],
    history: patient.clinicalEntities?.history || '',
    time: patient.token ? `Token #${patient.token}` : '',
    avatar: avatarFor(patient.gender),
    status: completedIds.includes(patient.id)
      ? 'Done'
      : patient.status === 'in_consultation' ? 'In Consultation' : patient.status === 'completed' ? 'Done' : 'Waiting',
    insurance: `ABHA ${patient.abha}`,
    token: patient.token,
    triagePriority: patient.triagePriority || 'Routine',
    aiSummary: patient.aiSummary || '',
  }));
};
