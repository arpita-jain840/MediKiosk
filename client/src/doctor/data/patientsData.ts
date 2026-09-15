import { getApiUrl } from '../../config/api';

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

export const avatarFor = (gender: string) => gender?.toLowerCase() === 'female'
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80';

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

/**
 * Single source of truth: Fetches active patient records directly from database API.
 */
export const fetchLiveCockpitPatients = async (): Promise<PatientRecord[]> => {
    const response = await fetch(getApiUrl('/api/doctor/patients'));
    if (!response.ok) {
        throw new Error(`Unable to load doctor patients from database (${response.status})`);
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
        pulse: String(patient.vitals?.pulse || ''),
        spO2: String(patient.vitals?.spO2 || patient.vitals?.spo2 || ''),
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
        insurance: `ABHA ${patient.abha || ''}`,
        token: patient.token,
        triagePriority: patient.triagePriority || 'Routine',
        aiSummary: patient.aiSummary || '',
    }));
};
