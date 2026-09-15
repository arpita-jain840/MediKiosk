import asyncio
from datetime import date
from sqlalchemy import select, text
from database import AsyncSessionLocal, Base, engine
from models import Appointment, Doctor, Patient, User, RawRecord, ClinicalBlueprint

# Exactly 5 patients and 1 doctor account as requested
PATIENTS_SEED = [
    {
        "id": "7047ac9d-9586-42fb-8728-acb9b52a1001",
        "code": "MK-1001",
        "username": "user1",
        "password": "user1",
        "name": "Priya Sharma",
        "age": 34,
        "gender": "Female",
        "blood": "B+",
        "abha": "14-2938-4471-0091",
        "allergies": ["Penicillin", "Dust Mites"],
        "token": 1,
        "status": "waiting",
        "conditions": ["Bronchial Asthma", "Allergic Rhinitis", "Sinusitis"],
        "medications": ["Budecort Inhaler 200 mcg (BD)", "Levocetirizine 5 mg (OD)", "Montelukast 10 mg (HS)"],
        "complaint": "Seasonal asthma flare, persistent rhinitis, and inhaler review",
        "vitals": {"bp": "118/76 mmHg", "pulse": "74 bpm", "spO2": "98%", "temp": "98.4 °F", "weight": "58 kg"},
        "priority": "Priority",
        "report": {
            "patient": {
                "id": "7047ac9d-9586-42fb-8728-acb9b52a1001",
                "patientId": "MK-1001",
                "name": "Priya Sharma",
                "age": 34,
                "gender": "Female",
                "bloodGroup": "B+",
                "allergies": ["Penicillin", "Dust Mites"],
                "knownConditions": ["Bronchial Asthma", "Allergic Rhinitis", "Sinusitis"],
                "currentMedications": ["Budecort Inhaler 200 mcg (BD)", "Levocetirizine 5 mg (OD)", "Montelukast 10 mg (HS)"],
                "lastUpdated": "12 Aug 2026 by Patient",
            },
            "metrics": {
                "priorityFindings": 2,
                "abnormalValues": 4,
                "normalValues": 16,
                "totalParameters": 22,
            },
            "reportTypes": {
                "bloodTest": 2,
                "mri": 0,
                "ctScan": 0,
                "xray": 1,
                "ecg": 0,
                "ultrasound": 0,
                "prescription": 2,
                "others": 2,
            },
            "aiSummary": {
                "keyTakeaways": [
                    "Patient has documented history of persistent bronchial asthma and perennial allergic rhinitis.",
                    "Recent spirometry reveals moderate airflow limitation responding to bronchodilators.",
                    "Serum total IgE is elevated at 380 IU/mL with positive reactivity to indoor dust mites.",
                    "Chest X-Ray shows no active parenchymal lesions or consolidations.",
                ],
                "mostImportantFindings": [
                    {"id": "p1", "title": "Elevated Serum IgE (380 IU/mL)", "detail": "active allergic diathesis", "source": "Allergy Panel (10 Aug 2026)", "priority": "high"},
                    {"id": "p2", "title": "Reduced Peak Expiratory Flow (320 L/min)", "detail": "bronchial hyperreactivity", "source": "Spirometry (08 Aug 2026)", "priority": "high"},
                    {"id": "p3", "title": "Eosinophilia (9.5%)", "detail": "airway allergic inflammation", "source": "CBC (08 Aug 2026)", "priority": "moderate"},
                ],
                "positiveHighlights": [
                    {"id": "ph1", "title": "Chest X-Ray Normal — clear lung fields", "source": "Chest X-Ray (05 Aug 2026)"},
                    {"id": "ph2", "title": "Oxygen Saturation Normal (SpO2 98%)", "source": "Kiosk Sensors"},
                    {"id": "ph3", "title": "Normal Renal and Liver Panels", "source": "Metabolic Panel (08 Aug 2026)"},
                ],
                "trends": [
                    {"metric": "Serum IgE", "unit": "IU/mL", "values": [{"label": "Nov 25", "value": 310}, {"label": "Apr 26", "value": 345}, {"label": "Aug 26", "value": 380}], "statusText": "Increasing", "direction": "up", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Peak Flow", "unit": "L/min", "values": [{"label": "Nov 25", "value": 390}, {"label": "Apr 26", "value": 360}, {"label": "Aug 26", "value": 320}], "statusText": "Decreasing", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Eosinophils", "unit": "%", "values": [{"label": "Nov 25", "value": 5.5}, {"label": "Apr 26", "value": 7.2}, {"label": "Aug 26", "value": 9.5}], "statusText": "Increasing", "direction": "up", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "SpO2 Level", "unit": "%", "values": [{"label": "Nov 25", "value": 97}, {"label": "Apr 26", "value": 98}, {"label": "Aug 26", "value": 98}], "statusText": "Normal", "direction": "up", "isAbnormal": False, "color": "#10b981"},
                ],
            },
            "detailedReports": [
                {"id": "rep-pft", "title": "Spirometry & Pulmonary Function Test", "type": "others", "date": "08 Aug 2026", "pages": 3, "status": "Requires Review", "statusColor": "red", "summary": "FEV1/FVC ratio 68%, reversible with Salbutamol."},
                {"id": "rep-ige", "title": "Serum Total IgE & Aeroallergen Panel", "type": "lab", "date": "10 Aug 2026", "pages": 2, "status": "Abnormal Values", "statusColor": "amber", "summary": "Total IgE 380 IU/mL, high dust mite reactivity."},
                {"id": "rep-cbc", "title": "Complete Blood Count (CBC)", "type": "lab", "date": "08 Aug 2026", "pages": 3, "status": "Abnormal Values", "statusColor": "amber", "summary": "Hb 11.8 g/dL, TLC 8,200, Eosinophils 9.5%."},
                {"id": "rep-cxr", "title": "Chest X-Ray PA View", "type": "imaging", "date": "05 Aug 2026", "pages": 1, "status": "Normal", "statusColor": "green", "summary": "Clear lung fields, normal cardiothoracic ratio."},
                {"id": "rep-rx", "title": "Pulmonology Outpatient Prescription", "type": "prescription", "date": "10 Aug 2026", "pages": 2, "status": "Medications Extracted", "statusColor": "cyan", "summary": "Budecort 200mcg, Levocetirizine 5mg, Montelukast 10mg."},
            ],
            "medicationSummary": [
                {"medicine": "Budecort Inhaler", "dose": "200 mcg", "frequency": "Twice daily", "duration": "Ongoing"},
                {"medicine": "Levocetirizine", "dose": "5 mg", "frequency": "Once daily", "duration": "As needed"},
                {"medicine": "Montelukast", "dose": "10 mg", "frequency": "Once daily (HS)", "duration": "60 days"},
            ],
            "recentDocuments": [
                {"id": "p-doc1", "title": "Spirometry Report", "date": "08 Aug 2026", "type": "pft"},
                {"id": "p-doc2", "title": "Allergy Panel", "date": "10 Aug 2026", "type": "lab"},
                {"id": "p-doc3", "title": "Chest X-Ray", "date": "05 Aug 2026", "type": "xray"},
            ],
            "timeline": [
                {"date": "Jan 2025", "title": "Asthma Diagnosed"},
                {"date": "Jun 2025", "title": "Spirometry Test"},
                {"date": "Nov 2025", "title": "Allergy Panel"},
                {"date": "Mar 2026", "title": "Acute Flare-up"},
                {"date": "Aug 2026", "title": "Maintenance Follow-up"},
            ],
            "disclaimer": "Note: This medical summary is based on the uploaded reports and may contain uncertainties. Please verify critical findings with the original reports.",
        },
        "docs": [
            {"type": "lab_report", "name": "Allergy_IgE_Panel.pdf", "text": "Allergy Profile: Total Serum IgE: 380 IU/mL [Elevated]. Dust Mite D. pteronyssinus: Class 3 positive."},
            {"type": "lab_report", "name": "CBC_Differential.pdf", "text": "Complete Blood Count: TLC: 8,200 /mcL, Eosinophils: 9.5% [Elevated], Absolute Eosinophils: 779 /mcL."},
            {"type": "xray", "name": "Chest_XRay_PA.pdf", "text": "Chest X-Ray PA: Clear bilateral lung fields without active consolidations or effusion."},
            {"type": "prescription", "name": "Pulmonology_Rx.pdf", "text": "Rx: Budecort Inhaler 200 mcg 2 puffs BD. Tab Levocetirizine 5mg OD. Tab Montelukast 10mg HS."},
        ],
    },
    {
        "id": "dd282916-ac7a-4ca8-a6c0-e63ffc621002",
        "code": "MK-1002",
        "username": "user2",
        "password": "user2",
        "name": "Emma Watson",
        "age": 28,
        "gender": "Female",
        "blood": "O+",
        "abha": "14-9824-3321-0092",
        "allergies": ["Penicillin", "Peanuts"],
        "token": 2,
        "status": "waiting",
        "conditions": ["Hashimoto Thyroiditis", "Iron Deficiency Anemia", "Vitamin D Deficiency"],
        "medications": ["Levothyroxine 50 mcg (OD)", "Ferrous Ascorbate 100 mg (OD)", "Cholecalciferol 60K (Weekly)"],
        "complaint": "Chronic fatigue, cold intolerance, hair shedding, and thyroid dose review",
        "vitals": {"bp": "112/72 mmHg", "pulse": "64 bpm", "spO2": "99%", "temp": "97.8 °F", "weight": "54 kg"},
        "priority": "Urgent",
        "report": {
            "patient": {
                "id": "dd282916-ac7a-4ca8-a6c0-e63ffc621002",
                "patientId": "MK-1002",
                "name": "Emma Watson",
                "age": 28,
                "gender": "Female",
                "bloodGroup": "O+",
                "allergies": ["Penicillin", "Peanuts"],
                "knownConditions": ["Hashimoto Thyroiditis", "Iron Deficiency Anemia", "Vitamin D Deficiency"],
                "currentMedications": ["Levothyroxine 50 mcg (OD)", "Ferrous Ascorbate 100 mg (OD)", "Cholecalciferol 60K (Weekly)"],
                "lastUpdated": "11 Aug 2026 by Patient",
            },
            "metrics": {
                "priorityFindings": 3,
                "abnormalValues": 5,
                "normalValues": 17,
                "totalParameters": 25,
            },
            "reportTypes": {
                "bloodTest": 3,
                "mri": 0,
                "ctScan": 0,
                "xray": 0,
                "ecg": 1,
                "ultrasound": 1,
                "prescription": 2,
                "others": 1,
            },
            "aiSummary": {
                "keyTakeaways": [
                    "Primary hypothyroidism secondary to autoimmune Hashimoto thyroiditis.",
                    "TSH remains elevated at 8.4 mIU/L with sub-optimal Free T4, indicating need for Levothyroxine titration.",
                    "Concurrent iron deficiency anemia with depleted serum ferritin (9 ng/mL) and low hemoglobin (9.8 g/dL).",
                    "Thyroid ultrasound shows heterogeneous parenchyma without suspicious solitary nodules.",
                ],
                "mostImportantFindings": [
                    {"id": "e1", "title": "Elevated TSH (8.4 mIU/L)", "detail": "sub-optimally controlled hypothyroidism", "source": "Thyroid Profile (11 Aug 2026)", "priority": "critical"},
                    {"id": "e2", "title": "Low Serum Ferritin (9 ng/mL)", "detail": "depleted iron storage reserves", "source": "Iron Profile (11 Aug 2026)", "priority": "high"},
                    {"id": "e3", "title": "Low Hemoglobin (9.8 g/dL)", "detail": "microcytic hypochromic anemia", "source": "CBC (11 Aug 2026)", "priority": "high"},
                    {"id": "e4", "title": "Severe Peanut Allergy Alert", "detail": "risk of anaphylaxis", "source": "Allergy Alert", "priority": "critical"},
                ],
                "positiveHighlights": [
                    {"id": "eh1", "title": "12-Lead ECG Normal Sinus Rhythm", "source": "ECG (11 Aug 2026)"},
                    {"id": "eh2", "title": "Kidney Function & Electrolytes Normal", "source": "KFT (11 Aug 2026)"},
                    {"id": "eh3", "title": "Vitamin D improving with supplement", "source": "Vitamin Panel (11 Aug 2026)"},
                ],
                "trends": [
                    {"metric": "TSH Level", "unit": "mIU/L", "values": [{"label": "Nov 25", "value": 4.8}, {"label": "Apr 26", "value": 6.5}, {"label": "Aug 26", "value": 8.4}], "statusText": "Increasing", "direction": "up", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Ferritin", "unit": "ng/mL", "values": [{"label": "Nov 25", "value": 22}, {"label": "Apr 26", "value": 14}, {"label": "Aug 26", "value": 9}], "statusText": "Decreasing", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Hemoglobin", "unit": "g/dL", "values": [{"label": "Nov 25", "value": 11.2}, {"label": "Apr 26", "value": 10.4}, {"label": "Aug 26", "value": 9.8}], "statusText": "Decreasing", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Vitamin D", "unit": "ng/mL", "values": [{"label": "Nov 25", "value": 12}, {"label": "Apr 26", "value": 19}, {"label": "Aug 26", "value": 28}], "statusText": "Improving", "direction": "up", "isAbnormal": False, "color": "#10b981"},
                ],
            },
            "detailedReports": [
                {"id": "rep-tsh", "title": "Thyroid Profile (TSH, Free T3, Free T4)", "type": "lab", "date": "11 Aug 2026", "pages": 2, "status": "Requires Review", "statusColor": "red", "summary": "TSH 8.4 mIU/L, FT4 0.82 ng/dL, Anti-TPO > 300 IU/mL."},
                {"id": "rep-iron", "title": "Iron Studies & Serum Ferritin", "type": "lab", "date": "11 Aug 2026", "pages": 2, "status": "Abnormal Values", "statusColor": "amber", "summary": "Serum Ferritin 9 ng/mL, Iron 38 ug/dL, TIBC 420 ug/dL."},
                {"id": "rep-cbc2", "title": "Complete Blood Count (CBC)", "type": "lab", "date": "11 Aug 2026", "pages": 3, "status": "Abnormal Values", "statusColor": "amber", "summary": "Hb 9.8 g/dL, MCV 72 fL (microcytic), Platelets 260,000."},
                {"id": "rep-usg", "title": "Ultrasound Thyroid Doppler", "type": "imaging", "date": "04 Aug 2026", "pages": 2, "status": "Normal", "statusColor": "green", "summary": "Diffuse micronodular echotexture characteristic of Hashimoto thyroiditis."},
                {"id": "rep-rx2", "title": "Endocrinology Prescription", "type": "prescription", "date": "11 Aug 2026", "pages": 1, "status": "Medications Extracted", "statusColor": "cyan", "summary": "Levothyroxine 50mcg OD, Ferrous Ascorbate 100mg OD."},
            ],
            "medicationSummary": [
                {"medicine": "Levothyroxine", "dose": "50 mcg", "frequency": "Once daily (empty stomach)", "duration": "Ongoing"},
                {"medicine": "Ferrous Ascorbate", "dose": "100 mg", "frequency": "Once daily with meals", "duration": "90 days"},
                {"medicine": "Cholecalciferol", "dose": "60,000 IU", "frequency": "Once weekly", "duration": "8 weeks"},
            ],
            "recentDocuments": [
                {"id": "e-doc1", "title": "Thyroid Profile", "date": "11 Aug 2026", "type": "lab"},
                {"id": "e-doc2", "title": "Iron Studies", "date": "11 Aug 2026", "type": "lab"},
                {"id": "e-doc3", "title": "Thyroid Ultrasound", "date": "04 Aug 2026", "type": "usg"},
            ],
            "timeline": [
                {"date": "Feb 2025", "title": "Fatigue & Cold Intolerance"},
                {"date": "Jul 2025", "title": "Hypothyroidism Diagnosed"},
                {"date": "Dec 2025", "title": "Thyroid Ultrasound"},
                {"date": "Apr 2026", "title": "Anemia Detected"},
                {"date": "Aug 2026", "title": "Dosage Titration"},
            ],
            "disclaimer": "Note: This medical summary is based on the uploaded reports and may contain uncertainties. Please verify critical findings with the original reports.",
        },
        "docs": [
            {"type": "lab_report", "name": "Thyroid_Panel_Aug2026.pdf", "text": "Thyroid Panel: TSH: 8.4 mIU/L [High], Free T4: 0.82 ng/dL [Low-Normal], Anti-TPO: > 350 IU/mL."},
            {"type": "lab_report", "name": "Iron_Ferritin_Report.pdf", "text": "Iron Profile: Serum Ferritin: 9 ng/mL [Low], Serum Iron: 38 ug/dL, Transferrin Saturation: 11%."},
            {"type": "ultrasound", "name": "Thyroid_Ultrasound.pdf", "text": "USG Neck: Both thyroid lobes show coarsened heterogeneous echotexture without discrete focal nodules."},
            {"type": "prescription", "name": "Endocrine_Prescription.pdf", "text": "Rx: Tab Levothyroxine 50 mcg early morning empty stomach. Tab Ferrous Ascorbate 100 mg post-lunch."},
        ],
    },
    {
        "id": "34808a5f-e712-4fbc-8e22-501c4b4e1003",
        "code": "MK-1003",
        "username": "user3",
        "password": "user3",
        "name": "Rajesh Kumar",
        "age": 59,
        "gender": "Male",
        "blood": "AB+",
        "abha": "14-5582-7719-0093",
        "allergies": ["Iodinated Contrast"],
        "token": 3,
        "status": "waiting",
        "conditions": ["Coronary Artery Disease (CAD)", "Hyperlipidemia", "Essential Hypertension"],
        "medications": ["Rosuvastatin 20 mg (OD)", "Metoprolol Succinate 50 mg (OD)", "Ecosprin 75 mg (OD)", "Telmisartan 40 mg (OD)"],
        "complaint": "Exertional chest heaviness, lipid profile review, and cardiac follow-up",
        "vitals": {"bp": "136/86 mmHg", "pulse": "68 bpm", "spO2": "98%", "temp": "98.6 °F", "weight": "76 kg"},
        "priority": "Urgent",
        "report": {
            "patient": {
                "id": "34808a5f-e712-4fbc-8e22-501c4b4e1003",
                "patientId": "MK-1003",
                "name": "Rajesh Kumar",
                "age": 59,
                "gender": "Male",
                "bloodGroup": "AB+",
                "allergies": ["Iodinated Contrast"],
                "knownConditions": ["Coronary Artery Disease (CAD)", "Hyperlipidemia", "Essential Hypertension"],
                "currentMedications": ["Rosuvastatin 20 mg (OD)", "Metoprolol Succinate 50 mg (OD)", "Ecosprin 75 mg (OD)", "Telmisartan 40 mg (OD)"],
                "lastUpdated": "12 Aug 2026 by Patient",
            },
            "metrics": {
                "priorityFindings": 4,
                "abnormalValues": 7,
                "normalValues": 15,
                "totalParameters": 26,
            },
            "reportTypes": {
                "bloodTest": 3,
                "mri": 0,
                "ctScan": 0,
                "xray": 1,
                "ecg": 2,
                "ultrasound": 1,
                "prescription": 3,
                "others": 1,
            },
            "aiSummary": {
                "keyTakeaways": [
                    "Known patient of ischemic heart disease with prior exertional angina and hypertension.",
                    "Resting 12-lead ECG demonstrates T-wave inversion in lateral precordial leads (V5-V6).",
                    "Recent lipid profile shows non-target LDL-C (142 mg/dL) and triglycerides (228 mg/dL).",
                    "Crucial alert: Documented severe anaphylactoid allergy to iodinated radiological contrast media.",
                ],
                "mostImportantFindings": [
                    {"id": "r1", "title": "Lateral T-Wave Inversion (V5-V6)", "detail": "myocardial lateral ischemia", "source": "12-Lead ECG (12 Aug 2026)", "priority": "critical"},
                    {"id": "r2", "title": "Elevated LDL Cholesterol (142 mg/dL)", "detail": "above secondary prevention target <70 mg/dL", "source": "Lipid Panel (10 Aug 2026)", "priority": "high"},
                    {"id": "r3", "title": "Elevated Triglycerides (228 mg/dL)", "detail": "mixed dyslipidemia", "source": "Lipid Panel (10 Aug 2026)", "priority": "moderate"},
                    {"id": "r4", "title": "Absolute Allergy: Iodinated Contrast", "detail": "anaphylaxis risk on angiogram", "source": "EMR Allergy Record", "priority": "critical"},
                ],
                "positiveHighlights": [
                    {"id": "rh1", "title": "2D Echocardiogram EF Preserved (55%)", "source": "2D Echo (06 Aug 2026)"},
                    {"id": "rh2", "title": "Normal Kidney Function (Creatinine 1.0 mg/dL)", "source": "KFT (10 Aug 2026)"},
                    {"id": "rh3", "title": "Normal HbA1c (5.6%) — no diabetes", "source": "Blood Test (10 Aug 2026)"},
                ],
                "trends": [
                    {"metric": "LDL-C", "unit": "mg/dL", "values": [{"label": "Nov 25", "value": 185}, {"label": "Apr 26", "value": 160}, {"label": "Aug 26", "value": 142}], "statusText": "Improving", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Systolic BP", "unit": "mmHg", "values": [{"label": "Nov 25", "value": 152}, {"label": "Apr 26", "value": 142}, {"label": "Aug 26", "value": 134}], "statusText": "Improving", "direction": "down", "isAbnormal": False, "color": "#10b981"},
                    {"metric": "Heart Rate", "unit": "bpm", "values": [{"label": "Nov 25", "value": 86}, {"label": "Apr 26", "value": 74}, {"label": "Aug 26", "value": 66}], "statusText": "Improving", "direction": "down", "isAbnormal": False, "color": "#10b981"},
                    {"metric": "Triglycerides", "unit": "mg/dL", "values": [{"label": "Nov 25", "value": 290}, {"label": "Apr 26", "value": 255}, {"label": "Aug 26", "value": 228}], "statusText": "Improving", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                ],
            },
            "detailedReports": [
                {"id": "rep-ecg", "title": "12-Lead Electrocardiogram (ECG)", "type": "others", "date": "12 Aug 2026", "pages": 2, "status": "Requires Review", "statusColor": "red", "summary": "Sinus rhythm, HR 68 bpm, T-wave inversion in V5-V6."},
                {"id": "rep-echo", "title": "2D Transthoracic Echocardiogram", "type": "imaging", "date": "06 Aug 2026", "pages": 4, "status": "Normal", "statusColor": "green", "summary": "LVEF 55%, mild concentric LVH, no regional wall motion abnormality."},
                {"id": "rep-lipid", "title": "Comprehensive Lipid Profile", "type": "lab", "date": "10 Aug 2026", "pages": 3, "status": "Abnormal Values", "statusColor": "amber", "summary": "Total Cholesterol 235, LDL 142, HDL 42, Triglycerides 228."},
                {"id": "rep-kft", "title": "Renal Function & Electrolytes", "type": "lab", "date": "10 Aug 2026", "pages": 2, "status": "Normal", "statusColor": "green", "summary": "Creatinine 1.0 mg/dL, Urea 28 mg/dL, Potassium 4.4 mEq/L."},
                {"id": "rep-rx3", "title": "Cardiology Follow-up Prescription", "type": "prescription", "date": "12 Aug 2026", "pages": 2, "status": "Medications Extracted", "statusColor": "cyan", "summary": "Rosuvastatin 20mg, Metoprolol 50mg, Ecosprin 75mg, Telmisartan 40mg."},
            ],
            "medicationSummary": [
                {"medicine": "Rosuvastatin", "dose": "20 mg", "frequency": "Once daily (night)", "duration": "Ongoing"},
                {"medicine": "Metoprolol Succinate", "dose": "50 mg", "frequency": "Once daily (morning)", "duration": "Ongoing"},
                {"medicine": "Ecosprin", "dose": "75 mg", "frequency": "Once daily (post-lunch)", "duration": "Ongoing"},
                {"medicine": "Telmisartan", "dose": "40 mg", "frequency": "Once daily", "duration": "Ongoing"},
            ],
            "recentDocuments": [
                {"id": "r-doc1", "title": "12-Lead ECG", "date": "12 Aug 2026", "type": "ecg"},
                {"id": "r-doc2", "title": "2D Echo Report", "date": "06 Aug 2026", "type": "echo"},
                {"id": "r-doc3", "title": "Lipid Profile", "date": "10 Aug 2026", "type": "lab"},
            ],
            "timeline": [
                {"date": "Mar 2024", "title": "Angina Onset"},
                {"date": "Aug 2024", "title": "TMT Stress Test Positive"},
                {"date": "Feb 2025", "title": "2D Echocardiogram"},
                {"date": "Nov 2025", "title": "Statin Titration"},
                {"date": "Aug 2026", "title": "Cardiology Consultation"},
            ],
            "disclaimer": "Note: This medical summary is based on the uploaded reports and may contain uncertainties. Please verify critical findings with the original reports.",
        },
        "docs": [
            {"type": "ecg", "name": "12Lead_ECG_Aug2026.pdf", "text": "12-Lead ECG: Normal sinus rhythm 68 bpm. T-wave inversions in lateral leads V5, V6, aVL. No acute ST elevations."},
            {"type": "lab_report", "name": "Lipid_Profile_Aug2026.pdf", "text": "Lipid Profile: Total Cholesterol: 235 mg/dL [High], LDL: 142 mg/dL [High], Triglycerides: 228 mg/dL [High]."},
            {"type": "ultrasound", "name": "2D_Echocardiography.pdf", "text": "2D Echo: LVEF 55%. Normal chamber dimensions. Mild concentric left ventricular hypertrophy."},
            {"type": "prescription", "name": "Cardio_Prescription.pdf", "text": "Rx: Tab Rosuvastatin 20mg OD HS. Tab Metoprolol 50mg OD. Tab Ecosprin 75mg OD. Tab Telmisartan 40mg OD."},
        ],
    },
    {
        "id": "89f13786-8f6b-4063-bbfa-9beec5341004",
        "code": "MK-1004",
        "username": "user4",
        "password": "user4",
        "name": "Sarah Hosten",
        "age": 34,
        "gender": "Female",
        "blood": "A+",
        "abha": "14-4412-8823-0094",
        "allergies": ["Sulfa Drugs"],
        "token": 4,
        "status": "waiting",
        "conditions": ["Chronic Migraine with Visual Aura", "Cervical Spondylosis", "Tension Headache"],
        "medications": ["Flunarizine 10 mg (HS)", "Naproxen 500 mg (SOS)", "Amitriptyline 10 mg (HS)", "Magnesium Glycinate 400 mg (OD)"],
        "complaint": "Recurrent throbbing hemicranial headaches with shimmering visual scotomas",
        "vitals": {"bp": "120/78 mmHg", "pulse": "72 bpm", "spO2": "99%", "temp": "98.4 °F", "weight": "61 kg"},
        "priority": "Routine",
        "report": {
            "patient": {
                "id": "89f13786-8f6b-4063-bbfa-9beec5341004",
                "patientId": "MK-1004",
                "name": "Sarah Hosten",
                "age": 34,
                "gender": "Female",
                "bloodGroup": "A+",
                "allergies": ["Sulfa Drugs"],
                "knownConditions": ["Chronic Migraine with Visual Aura", "Cervical Spondylosis", "Tension Headache"],
                "currentMedications": ["Flunarizine 10 mg (HS)", "Naproxen 500 mg (SOS)", "Amitriptyline 10 mg (HS)", "Magnesium Glycinate 400 mg (OD)"],
                "lastUpdated": "09 Aug 2026 by Patient",
            },
            "metrics": {
                "priorityFindings": 2,
                "abnormalValues": 3,
                "normalValues": 20,
                "totalParameters": 25,
            },
            "reportTypes": {
                "bloodTest": 2,
                "mri": 1,
                "ctScan": 0,
                "xray": 0,
                "ecg": 0,
                "ultrasound": 0,
                "prescription": 2,
                "others": 1,
            },
            "aiSummary": {
                "keyTakeaways": [
                    "Patient has episodic migraine with scintillating visual aura (6-8 attacks/month).",
                    "MRI Brain with contrast confirmed no intracranial mass lesion, aneurysm, or vascular malformation.",
                    "Cervical spine MRI demonstrates mild C5-C6 degenerative disc desiccation without canal stenosis.",
                    "Symptom frequency is decreasing on Flunarizine prophylaxis and lifestyle sleep regularity.",
                ],
                "mostImportantFindings": [
                    {"id": "s1", "title": "Recurrent Migraine with Visual Aura", "detail": "requires preventative maintenance", "source": "Neuro Consult (09 Aug 2026)", "priority": "high"},
                    {"id": "s2", "title": "C5-C6 Disc Desiccation", "detail": "contributes to cervicogenic occipital pain", "source": "MRI Spine (02 Aug 2026)", "priority": "moderate"},
                    {"id": "s3", "title": "Severe Sulfa Drug Allergy", "detail": "avoid sulfonamide antimicrobials", "source": "EMR Allergy Record", "priority": "high"},
                ],
                "positiveHighlights": [
                    {"id": "sh1", "title": "Brain MRI Normal — no intracranial space occupying lesion", "source": "Brain MRI (02 Aug 2026)"},
                    {"id": "sh2", "title": "Video EEG Normal — no epileptiform paroxysms", "source": "EEG Lab (05 Aug 2026)"},
                    {"id": "sh3", "title": "Complete Blood Count & Inflammatory Markers Normal", "source": "Lab Profile (09 Aug 2026)"},
                ],
                "trends": [
                    {"metric": "Monthly Attacks", "unit": "days/mo", "values": [{"label": "Nov 25", "value": 12}, {"label": "Apr 26", "value": 9}, {"label": "Aug 26", "value": 6}], "statusText": "Improving", "direction": "down", "isAbnormal": False, "color": "#10b981"},
                    {"metric": "Pain Severity", "unit": "/10", "values": [{"label": "Nov 25", "value": 9}, {"label": "Apr 26", "value": 7}, {"label": "Aug 26", "value": 5}], "statusText": "Improving", "direction": "down", "isAbnormal": False, "color": "#10b981"},
                    {"metric": "Rescue Meds", "unit": "days/wk", "values": [{"label": "Nov 25", "value": 5}, {"label": "Apr 26", "value": 3}, {"label": "Aug 26", "value": 2}], "statusText": "Improving", "direction": "down", "isAbnormal": False, "color": "#10b981"},
                    {"metric": "Sleep Score", "unit": "index", "values": [{"label": "Nov 25", "value": 45}, {"label": "Apr 26", "value": 62}, {"label": "Aug 26", "value": 78}], "statusText": "Improving", "direction": "up", "isAbnormal": False, "color": "#10b981"},
                ],
            },
            "detailedReports": [
                {"id": "rep-mri2", "title": "MRI Brain & Cervical Spine Screening", "type": "imaging", "date": "02 Aug 2026", "pages": 3, "status": "Normal", "statusColor": "green", "summary": "Normal brain parenchyma. Mild C5-C6 disc bulge without cord compression."},
                {"id": "rep-eeg", "title": "Routine Electroencephalogram (EEG)", "type": "others", "date": "05 Aug 2026", "pages": 2, "status": "Normal", "statusColor": "green", "summary": "Symmetrical alpha rhythm, no focal slowing or spike-wave discharges."},
                {"id": "rep-esr", "title": "Complete Blood Count & ESR", "type": "lab", "date": "09 Aug 2026", "pages": 3, "status": "Normal", "statusColor": "green", "summary": "Hb 12.4 g/dL, ESR 12 mm/hr, CRP negative."},
                {"id": "rep-rx4", "title": "Neurology Outpatient Prescription", "type": "prescription", "date": "09 Aug 2026", "pages": 2, "status": "Medications Extracted", "statusColor": "cyan", "summary": "Flunarizine 10mg HS, Naproxen 500mg SOS, Amitriptyline 10mg HS."},
            ],
            "medicationSummary": [
                {"medicine": "Flunarizine", "dose": "10 mg", "frequency": "Once daily (bedtime)", "duration": "90 days"},
                {"medicine": "Naproxen", "dose": "500 mg", "frequency": "At attack onset (SOS)", "duration": "As needed"},
                {"medicine": "Amitriptyline", "dose": "10 mg", "frequency": "Once daily (night)", "duration": "Ongoing"},
                {"medicine": "Magnesium Glycinate", "dose": "400 mg", "frequency": "Once daily", "duration": "Ongoing"},
            ],
            "recentDocuments": [
                {"id": "s-doc1", "title": "Brain MRI", "date": "02 Aug 2026", "type": "mri"},
                {"id": "s-doc2", "title": "EEG Report", "date": "05 Aug 2026", "type": "eeg"},
                {"id": "s-doc3", "title": "CBC & ESR Panel", "date": "09 Aug 2026", "type": "lab"},
            ],
            "timeline": [
                {"date": "Oct 2024", "title": "Visual Aura Onset"},
                {"date": "Mar 2025", "title": "Brain MRI Screen"},
                {"date": "Aug 2025", "title": "EEG Normal"},
                {"date": "Jan 2026", "title": "Flunarizine Prophylaxis"},
                {"date": "Aug 2026", "title": "Neurology Review"},
            ],
            "disclaimer": "Note: This medical summary is based on the uploaded reports and may contain uncertainties. Please verify critical findings with the original reports.",
        },
        "docs": [
            {"type": "mri", "name": "MRI_Brain_Spine.pdf", "text": "MRI Brain: Normal study. No acute infarction, hemorrhage, or mass effect. Spine: Mild C5-C6 degenerative disc desiccation."},
            {"type": "lab_report", "name": "CBC_ESR_Markers.pdf", "text": "Laboratory Report: Hemoglobin: 12.4 g/dL, Platelets: 275,000, ESR: 12 mm/hr, Thyroid TSH: 2.1 mIU/L."},
            {"type": "prescription", "name": "Neuro_Prescription.pdf", "text": "Rx: Tab Flunarizine 10mg HS. Tab Naproxen 500mg SOS at headache onset. Tab Amitriptyline 10mg HS."},
        ],
    },
    {
        "id": "84759d82-b1bf-48d7-9cb8-ee41518d1005",
        "code": "MK-1005",
        "username": "user5",
        "password": "user5",
        "name": "Vikram Malhotra",
        "age": 38,
        "gender": "Male",
        "blood": "O+",
        "abha": "14-1182-6632-0095",
        "allergies": ["NSAIDs (gastric pain)"],
        "token": 5,
        "status": "waiting",
        "conditions": ["Type 2 Diabetes Mellitus", "Non-Alcoholic Fatty Liver Disease (NAFLD)", "Metabolic Syndrome"],
        "medications": ["Metformin 1000 mg ER (BD)", "Saroglitazar 4 mg (OD)", "Empagliflozin 10 mg (OD)", "Vitamin E 400 IU (OD)"],
        "complaint": "Type 2 diabetes management, elevated transaminases, and fatty liver review",
        "vitals": {"bp": "124/80 mmHg", "pulse": "76 bpm", "spO2": "98%", "temp": "98.6 °F", "weight": "82.5 kg"},
        "priority": "Priority",
        "report": {
            "patient": {
                "id": "84759d82-b1bf-48d7-9cb8-ee41518d1005",
                "patientId": "MK-1005",
                "name": "Vikram Malhotra",
                "age": 38,
                "gender": "Male",
                "bloodGroup": "O+",
                "allergies": ["NSAIDs (gastric pain)"],
                "knownConditions": ["Type 2 Diabetes Mellitus", "Non-Alcoholic Fatty Liver Disease (NAFLD)", "Metabolic Syndrome"],
                "currentMedications": ["Metformin 1000 mg ER (BD)", "Saroglitazar 4 mg (OD)", "Empagliflozin 10 mg (OD)", "Vitamin E 400 IU (OD)"],
                "lastUpdated": "12 Aug 2026 by Patient",
            },
            "metrics": {
                "priorityFindings": 3,
                "abnormalValues": 6,
                "normalValues": 18,
                "totalParameters": 27,
            },
            "reportTypes": {
                "bloodTest": 3,
                "mri": 0,
                "ctScan": 0,
                "xray": 0,
                "ecg": 1,
                "ultrasound": 1,
                "prescription": 2,
                "others": 1,
            },
            "aiSummary": {
                "keyTakeaways": [
                    "Metabolic syndrome with sub-optimally controlled Type 2 Diabetes Mellitus (HbA1c 8.2%).",
                    "Abdominal ultrasound and FibroScan indicate Grade 2 Hepatic Steatosis (CAP score 298 dB/m) without advanced fibrosis.",
                    "Elevated liver enzymes (ALT 64 U/L, AST 52 U/L) indicating active steatohepatitis.",
                    "Demonstrating consistent improvement in glycemic metrics and weight on dual PPAR agonist & SGLT2i.",
                ],
                "mostImportantFindings": [
                    {"id": "v1", "title": "Sub-optimal Glycemic Control (HbA1c 8.2%)", "detail": "ongoing metabolic risk", "source": "Lab Panel (12 Aug 2026)", "priority": "critical"},
                    {"id": "v2", "title": "Elevated ALT (64 U/L) & AST (52 U/L)", "detail": "active non-alcoholic steatohepatitis", "source": "LFT Panel (12 Aug 2026)", "priority": "high"},
                    {"id": "v3", "title": "Grade 2 Hepatic Steatosis (CAP 298 dB/m)", "detail": "moderate liver fat accumulation", "source": "FibroScan (06 Aug 2026)", "priority": "high"},
                    {"id": "v4", "title": "Severe NSAID Gastric Intolerance", "detail": "history of severe erosive gastritis", "source": "GI Record", "priority": "high"},
                ],
                "positiveHighlights": [
                    {"id": "vh1", "title": "FibroScan Stiffness 5.8 kPa (F0-F1) — no advanced fibrosis", "source": "FibroScan (06 Aug 2026)"},
                    {"id": "vh2", "title": "Normal Renal Function (Creatinine 0.9 mg/dL)", "source": "KFT (12 Aug 2026)"},
                    {"id": "vh3", "title": "Blood Pressure Controlled (124/80 mmHg)", "source": "Kiosk Vitals"},
                ],
                "trends": [
                    {"metric": "HbA1c", "unit": "%", "values": [{"label": "Nov 25", "value": 9.2}, {"label": "Apr 26", "value": 8.7}, {"label": "Aug 26", "value": 8.2}], "statusText": "Improving", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "ALT Enzyme", "unit": "U/L", "values": [{"label": "Nov 25", "value": 88}, {"label": "Apr 26", "value": 76}, {"label": "Aug 26", "value": 64}], "statusText": "Improving", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Fasting Glucose", "unit": "mg/dL", "values": [{"label": "Nov 25", "value": 192}, {"label": "Apr 26", "value": 174}, {"label": "Aug 26", "value": 152}], "statusText": "Improving", "direction": "down", "isAbnormal": True, "color": "#ef4444"},
                    {"metric": "Body Weight", "unit": "kg", "values": [{"label": "Nov 25", "value": 89}, {"label": "Apr 26", "value": 86}, {"label": "Aug 26", "value": 82.5}], "statusText": "Improving", "direction": "down", "isAbnormal": False, "color": "#10b981"},
                ],
            },
            "detailedReports": [
                {"id": "rep-cmp", "title": "Comprehensive Metabolic Panel (CMP & HbA1c)", "type": "lab", "date": "12 Aug 2026", "pages": 5, "status": "Abnormal Values", "statusColor": "amber", "summary": "HbA1c 8.2%, Fasting Glucose 152 mg/dL, Creatinine 0.9 mg/dL."},
                {"id": "rep-fibro", "title": "Liver FibroScan Transient Elastography", "type": "others", "date": "06 Aug 2026", "pages": 3, "status": "Requires Review", "statusColor": "red", "summary": "CAP 298 dB/m (Grade 2 Steatosis), Stiffness 5.8 kPa (F0-F1)."},
                {"id": "rep-usg2", "title": "Ultrasound Whole Abdomen", "type": "imaging", "date": "04 Aug 2026", "pages": 2, "status": "Abnormal Values", "statusColor": "amber", "summary": "Diffuse increase in hepatic echogenicity consistent with Grade II steatosis."},
                {"id": "rep-lft", "title": "Liver Function Tests (LFT)", "type": "lab", "date": "12 Aug 2026", "pages": 2, "status": "Abnormal Values", "statusColor": "amber", "summary": "ALT 64 U/L, AST 52 U/L, Bilirubin 0.8 mg/dL, Albumin 4.2 g/dL."},
                {"id": "rep-rx5", "title": "Diabetology & Hepatology Prescription", "type": "prescription", "date": "12 Aug 2026", "pages": 2, "status": "Medications Extracted", "statusColor": "cyan", "summary": "Metformin 1000mg ER BD, Saroglitazar 4mg OD, Empagliflozin 10mg OD."},
            ],
            "medicationSummary": [
                {"medicine": "Metformin ER", "dose": "1000 mg", "frequency": "Twice daily (after meals)", "duration": "Ongoing"},
                {"medicine": "Saroglitazar", "dose": "4 mg", "frequency": "Once daily (morning)", "duration": "Ongoing"},
                {"medicine": "Empagliflozin", "dose": "10 mg", "frequency": "Once daily", "duration": "Ongoing"},
                {"medicine": "Vitamin E", "dose": "400 IU", "frequency": "Once daily", "duration": "90 days"},
            ],
            "recentDocuments": [
                {"id": "v-doc1", "title": "Metabolic Panel", "date": "12 Aug 2026", "type": "lab"},
                {"id": "v-doc2", "title": "Liver FibroScan", "date": "06 Aug 2026", "type": "fibro"},
                {"id": "v-doc3", "title": "Abdominal USG", "date": "04 Aug 2026", "type": "usg"},
            ],
            "timeline": [
                {"date": "Jan 2025", "title": "Diabetes Diagnosed"},
                {"date": "May 2025", "title": "Ultrasound Fatty Liver"},
                {"date": "Oct 2025", "title": "FibroScan Ingestion"},
                {"date": "Apr 2026", "title": "SGLT2i Added"},
                {"date": "Aug 2026", "title": "Hepatology Review"},
            ],
            "disclaimer": "Note: This medical summary is based on the uploaded reports and may contain uncertainties. Please verify critical findings with the original reports.",
        },
        "docs": [
            {"type": "lab_report", "name": "CMP_Metabolic_HbA1c.pdf", "text": "Metabolic Panel: HbA1c: 8.2% [High], Fasting Glucose: 152 mg/dL, ALT: 64 U/L [High], AST: 52 U/L [High]."},
            {"type": "lab_report", "name": "FibroScan_Elastography.pdf", "text": "FibroScan: CAP Score: 298 dB/m (S2 Moderate Steatosis), Liver Stiffness: 5.8 kPa (F0-F1 No Significant Fibrosis)."},
            {"type": "ultrasound", "name": "USG_Abdomen.pdf", "text": "Ultrasound Abdomen: Liver enlarged with diffuse bright echo pattern suggestive of Grade 2 Fatty Infiltration."},
            {"type": "prescription", "name": "Metabolic_Prescription.pdf", "text": "Rx: Tab Metformin 1000mg ER BD. Tab Saroglitazar 4mg OD. Tab Empagliflozin 10mg OD. Cap Vitamin E 400IU OD."},
        ],
    },
]


async def reset_and_seed_db():
    print("[Database] Resetting prototype database with 5 distinct patients and 1 doctor...")
    async with engine.begin() as conn:
        drop_suffix = " CASCADE" if engine.dialect.name == "postgresql" else ""
        for table in ("patient_documents", "patient_clinical_profiles", "clinical_blueprints", "raw_records", "appointments", "doctors", "patients", "users"):
            await conn.execute(text(f"DROP TABLE IF EXISTS {table}{drop_suffix};"))
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Doctor Accounts (admindoc and specialists)
        doctor_user = User(
            email="admindoc",
            password_hash="admindoc",
            full_name="Dr. Neha Sharma",
            role="doctor",
            phone="+91 98765 43210",
        )
        session.add(doctor_user)
        await session.flush()

        doctor = Doctor(
            user_id=doctor_user.id,
            specialization="Cardiologist & Internal Medicine",
            license_number="DOC-ADMIN-001",
            hospital_name="City Care Hospital - AIIA OPD",
            room_number="Room 4B",
        )
        session.add(doctor)
        await session.flush()

        doc2_user = User(
            email="dr.kulkarni@medikiosk.in",
            password_hash="doctor123",
            full_name="Dr. Rajesh Kulkarni",
            role="doctor",
            phone="+91 98765 43211",
        )
        session.add(doc2_user)
        await session.flush()

        doc2 = Doctor(
            user_id=doc2_user.id,
            specialization="Panchakarma & AYUSH Medicine",
            license_number="DOC-ADMIN-002",
            hospital_name="AIIA OPD Center",
            room_number="Room 5B",
        )
        session.add(doc2)
        await session.flush()

        doc3_user = User(
            email="dr.nair@medikiosk.in",
            password_hash="doctor123",
            full_name="Dr. Kavita Nair",
            role="doctor",
            phone="+91 98765 43212",
        )
        session.add(doc3_user)
        await session.flush()

        doc3 = Doctor(
            user_id=doc3_user.id,
            specialization="Endocrinology & Diabetology",
            license_number="DOC-ADMIN-003",
            hospital_name="MedLife Super Specialty Clinic",
            room_number="Room 3C",
        )
        session.add(doc3)
        await session.flush()

        # 2. Exactly 5 Patient Accounts (user1..user5 / user1..user5)
        for seed in PATIENTS_SEED:
            user = User(
                email=seed["username"],
                password_hash=seed["password"],
                full_name=seed["name"],
                role="patient",
                phone="+91 91234 56789",
            )
            session.add(user)
            await session.flush()

            patient = Patient(
                id=seed["id"],
                user_id=user.id,
                abha_id=seed["abha"],
                dob=date(2026 - seed["age"], 1, 1),
                gender=seed["gender"],
                blood_group=seed["blood"],
                allergies=seed["allergies"],
            )
            session.add(patient)
            await session.flush()

            appt = Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                token_number=seed["token"],
                status=seed["status"],
            )
            session.add(appt)
            await session.flush()

            # Seed realistic multi-modal document records
            for doc in seed["docs"]:
                raw_doc = RawRecord(
                    patient_id=patient.id,
                    document_type=doc["type"],
                    file_name=doc["name"],
                    file_url=f"/uploads/{doc['name']}",
                    mime_type="application/pdf",
                    file_size=150000,
                    raw_extracted_text=doc["text"],
                )
                session.add(raw_doc)
            await session.flush()

            # Seed complete distinct pre-computed Health Report Blueprint
            bp = ClinicalBlueprint(
                patient_id=patient.id,
                appointment_id=appt.id,
                triage_priority=seed["priority"],
                chief_complaint=seed["complaint"],
                vitals=seed["vitals"],
                ai_summary=seed["report"]["aiSummary"]["keyTakeaways"][0],
                clinical_entities={
                    "patient_code": seed["code"],
                    "known_conditions": seed["conditions"],
                    "medications": seed["medications"],
                    "health_report": seed["report"],
                },
                hpi={"onset": "Documented in clinic records", "duration": "Chronic", "triggers": "Reported at kiosk"},
                red_flags=[f["title"] for f in seed["report"]["aiSummary"]["mostImportantFindings"]],
            )
            session.add(bp)

        await session.commit()
        print("[Database] Successfully seeded 1 Doctor (admindoc) and 5 unique Patients (user1..user5) with custom medical datasets.")


async def init_db_and_seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        user_count = (await session.execute(select(User))).scalars().all()
        # If already seeded with 3 doctors + 5 patients = 8 users, don't wipe
        if len(user_count) == 8:
            return

    await reset_and_seed_db()


if __name__ == "__main__":
    asyncio.run(reset_and_seed_db())
