import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

class FHIRService:
    """
    Generates ABDM (Ayushman Bharat Digital Mission) compliant HL7 FHIR R4
    OPConsultRecord Document Bundles from MediKiosk Clinical Blueprints.
    """

    @staticmethod
    def generate_op_consult_bundle(
        patient_data: Dict[str, Any],
        blueprint_data: Dict[str, Any],
        doctor_data: Optional[Dict[str, Any]] = None,
        appointment_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        bundle_id = str(uuid.uuid4())
        patient_id = patient_data.get("id", str(uuid.uuid4()))
        doctor_id = (doctor_data or {}).get("id", "doc-001")
        encounter_id = str(uuid.uuid4())
        composition_id = str(uuid.uuid4())
        now_iso = datetime.utcnow().isoformat() + "Z"

        doc_name = (doctor_data or {}).get("name", "Dr. Admin Doc")
        doc_license = (doctor_data or {}).get("license_number", "DOC-ADMIN-001")
        pat_name = patient_data.get("name", "Unknown Patient")
        pat_abha = patient_data.get("abha", "14-0000-0000-0000")
        pat_gender = (patient_data.get("gender") or "unknown").lower()
        pat_dob = patient_data.get("dob", "1995-01-01")

        # 1. Patient Resource
        patient_resource = {
            "resourceType": "Patient",
            "id": patient_id,
            "meta": {
                "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"]
            },
            "identifier": [
                {
                    "type": {
                        "coding": [
                            {
                                "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code",
                                "code": "ABHA",
                                "display": "Ayushman Bharat Health Account"
                            }
                        ]
                    },
                    "system": "https://healthid.ndhm.gov.in",
                    "value": pat_abha
                }
            ],
            "name": [{"text": pat_name}],
            "gender": pat_gender if pat_gender in ["male", "female", "other"] else "other",
            "birthDate": pat_dob
        }

        # 2. Practitioner Resource
        practitioner_resource = {
            "resourceType": "Practitioner",
            "id": doctor_id,
            "meta": {
                "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Practitioner"]
            },
            "identifier": [
                {
                    "system": "https://doctor.ndhm.gov.in",
                    "value": doc_license
                }
            ],
            "name": [{"text": doc_name}]
        }

        # 3. Encounter Resource
        encounter_resource = {
            "resourceType": "Encounter",
            "id": encounter_id,
            "status": "finished" if (appointment_data or {}).get("status") == "completed" else "in-progress",
            "class": {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code": "AMB",
                "display": "Ambulatory OPD Consultation"
            },
            "subject": {"reference": f"Patient/{patient_id}"},
            "participant": [
                {
                    "individual": {"reference": f"Practitioner/{doctor_id}"}
                }
            ],
            "period": {"start": now_iso}
        }

        # 4. Condition Resource (Chief Complaint)
        condition_id = str(uuid.uuid4())
        complaint_text = blueprint_data.get("chief_complaint") or blueprint_data.get("chiefComplaint") or "General OPD Consultation"
        condition_resource = {
            "resourceType": "Condition",
            "id": condition_id,
            "meta": {
                "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Condition"]
            },
            "clinicalStatus": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                        "code": "active"
                    }
                ]
            },
            "subject": {"reference": f"Patient/{patient_id}"},
            "code": {
                "text": complaint_text
            }
        }

        # 5. Observations (Vitals & AYUSH Pariksha)
        vitals = blueprint_data.get("vitals", {})
        observations: List[Dict[str, Any]] = []
        
        if vitals:
            obs_vitals_id = str(uuid.uuid4())
            observations.append({
                "resourceType": "Observation",
                "id": obs_vitals_id,
                "status": "final",
                "category": [
                    {
                        "coding": [
                            {
                                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                                "code": "vital-signs",
                                "display": "Vital Signs"
                            }
                        ]
                    }
                ],
                "code": {"text": "Patient Vitals Panel"},
                "subject": {"reference": f"Patient/{patient_id}"},
                "valueString": f"BP: {vitals.get('bp', 'N/A')}, Pulse: {vitals.get('pulse', 'N/A')}, SpO2: {vitals.get('spO2', 'N/A')}, Temp: {vitals.get('temp', 'N/A')}"
            })

        ayush = blueprint_data.get("ayush_pariksha") or blueprint_data.get("ayushPariksha")
        if ayush:
            obs_ayush_id = str(uuid.uuid4())
            observations.append({
                "resourceType": "Observation",
                "id": obs_ayush_id,
                "status": "final",
                "category": [
                    {
                        "coding": [
                            {
                                "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-observation-category",
                                "code": "ayush-assessment",
                                "display": "Ayush Pariksha Assessment"
                            }
                        ]
                    }
                ],
                "code": {"text": "Ayurvedic Dashavidha Pariksha"},
                "subject": {"reference": f"Patient/{patient_id}"},
                "valueString": f"Prakriti: {ayush.get('prakriti')}, Agni: {ayush.get('agni')}, Koshtha: {ayush.get('koshtha')}"
            })

        # 6. MedicationRequests
        med_entities = blueprint_data.get("clinical_entities", {}).get("medications", [])
        if not med_entities:
            med_entities = blueprint_data.get("clinicalEntities", {}).get("medications", [])

        med_resources: List[Dict[str, Any]] = []
        for med in med_entities:
            med_id = str(uuid.uuid4())
            med_resources.append({
                "resourceType": "MedicationRequest",
                "id": med_id,
                "status": "active",
                "intent": "order",
                "medicationCodeableConcept": {
                    "text": str(med)
                },
                "subject": {"reference": f"Patient/{patient_id}"}
            })

        # 7. Composition Resource (Document Header)
        composition_resource = {
            "resourceType": "Composition",
            "id": composition_id,
            "meta": {
                "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/OPConsultRecord"]
            },
            "status": "final",
            "type": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "34108-1",
                        "display": "Outpatient Consultation Note"
                    }
                ]
            },
            "subject": {"reference": f"Patient/{patient_id}"},
            "encounter": {"reference": f"Encounter/{encounter_id}"},
            "date": now_iso,
            "author": [{"reference": f"Practitioner/{doctor_id}"}],
            "title": "MediKiosk Clinical OPD Intake Summary",
            "section": [
                {
                    "title": "Chief Complaints & History",
                    "entry": [{"reference": f"Condition/{condition_id}"}]
                },
                {
                    "title": "Clinical Observations & Vitals",
                    "entry": [{"reference": f"Observation/{obs['id']}"} for obs in observations]
                },
                {
                    "title": "Medications",
                    "entry": [{"reference": f"MedicationRequest/{m['id']}"} for m in med_resources]
                }
            ]
        }

        # Assemble Full Document Bundle
        all_entries = (
            [composition_resource, patient_resource, practitioner_resource, encounter_resource, condition_resource]
            + observations
            + med_resources
        )

        bundle = {
            "resourceType": "Bundle",
            "id": bundle_id,
            "meta": {
                "versionId": "1",
                "lastUpdated": now_iso,
                "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"]
            },
            "identifier": {
                "system": "https://medikiosk.gov.in/bundles",
                "value": f"MK-FHIR-{bundle_id[:8].upper()}"
            },
            "type": "document",
            "timestamp": now_iso,
            "entry": [{"fullUrl": f"urn:uuid:{res['id']}", "resource": res} for res in all_entries]
        }

        return bundle

fhir_service = FHIRService()
