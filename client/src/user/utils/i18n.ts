// Centralized, concise i18n translation dictionary for MediKiosk
// Keeps sentences minimal and prevents bilingual mixing (pure English by default, pure regional language on change)

export type SupportedLang = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu" | "kn" | "ml" | "pa" | "or";

export interface Translations {
  nav: {
    home: string;
    appointments: string;
    records: string;
    ai: string;
    doctorSwitch: string;
  };
  home: {
    greeting: string;
    kioskTag: string;
    welcomeSub: string;
    heroTitle: string;
    heroDesc: string;
    btnBook: string;
    btnRecords: string;
    btnGuide: string;
    servicesHeader: string;
    cardApptsTitle: string;
    cardApptsDesc: string;
    cardRecordsTitle: string;
    cardRecordsDesc: string;
    cardAiTitle: string;
    cardAiDesc: string;
    cardHelpTitle: string;
    cardHelpDesc: string;
  };
  appointments: {
    title: string;
    tokenLabel: string;
    nextInLine: string;
    estWait: string;
    printSlip: string;
    refresh: string;
    deptTitle: string;
    doctorsTitle: string;
    operationalBadge: string;
    getToken: string;
    pastVisitsTitle: string;
    viewPrescription: string;
    depts: Record<string, string>;
  };
  records: {
    title: string;
    scannerTitle: string;
    scannerDesc: string;
    tapUpload: string;
    uploadSub: string;
    btnUpload: string;
    analyzing: string;
    viewDetails: string;
    ocrActive: string;
    categories: Record<string, string>;
  };
  aiGuide: {
    title: string;
    companionTitle: string;
    companionSub: string;
    activeGuide: string;
    replay: string;
    listening: string;
    suggestedHeader: string;
    placeholder: string;
    chips: string[];
  };
}

const EN: Translations = {
  nav: {
    home: "Home",
    appointments: "Appointments & Token",
    records: "Records & Parche",
    ai: "AI Assistant (Guide)",
    doctorSwitch: "Switch to Doctor Cockpit →",
  },
  home: {
    greeting: "Namaste",
    kioskTag: "All India Institute of Ayurveda · OPD Kiosk",
    welcomeSub: "Welcome to the OPD self-service kiosk. How can we help you today?",
    heroTitle: "Hospital Self-Service",
    heroDesc: "Book your OPD token, scan paper prescriptions, or talk with our AI hospital guide.",
    btnBook: "Book OPD Token",
    btnRecords: "Scan Prescription",
    btnGuide: "Ask AI Guide",
    servicesHeader: "Quick Services",
    cardApptsTitle: "Appointments & Token",
    cardApptsDesc: "Check live queue status (Token #2, Room 4B) and book OPD slots.",
    cardRecordsTitle: "Records & Prescriptions",
    cardRecordsDesc: "Scan handwritten prescriptions or access lab reports.",
    cardAiTitle: "AI Voice Guide",
    cardAiDesc: "Ask about doctor rooms, timings, or which department to visit.",
    cardHelpTitle: "Emergency & Helpdesk",
    cardHelpDesc: "Reception assistance and emergency desk support.",
  },
  appointments: {
    title: "Appointments & OPD Token",
    tokenLabel: "Token",
    nextInLine: "Next in queue",
    estWait: "Est. Wait: ~4 mins",
    printSlip: "Print Slip",
    refresh: "Refresh",
    deptTitle: "Select Department",
    doctorsTitle: "Available Doctors Today",
    operationalBadge: "Rooms Operational",
    getToken: "Get Token",
    pastVisitsTitle: "Past Consultations",
    viewPrescription: "View Prescription",
    depts: {
      all: "All Departments",
      kayachikitsa: "General Medicine (Kayachikitsa)",
      panchakarma: "Panchakarma Therapy",
      cardio: "Cardiology",
      shalya: "Surgery (Shalya)",
      pediatrics: "Pediatrics",
    },
  },
  records: {
    title: "Medical Records & Prescriptions",
    scannerTitle: "Prescription & Document Scanner",
    scannerDesc: "Scan physical prescriptions or upload medical reports.",
    tapUpload: "Tap to upload or take a photo",
    uploadSub: "Prescriptions, lab reports, discharge summaries",
    btnUpload: "Choose File or Capture Photo",
    analyzing: "Analyzing Document...",
    viewDetails: "View Details & OCR",
    ocrActive: "OCR Active",
    categories: {
      all: "All",
      blood: "Blood tests",
      imaging: "Imaging",
      rx: "Prescriptions",
      reports: "Reports",
    },
  },
  aiGuide: {
    title: "AI Hospital Guide",
    companionTitle: "AIIA Kiosk Guide",
    companionSub: "Ask about doctor rooms, OPD timings, or departments.",
    activeGuide: "Active Guide",
    replay: "Replay Voice",
    listening: "Listening & Thinking...",
    suggestedHeader: "Suggested Questions:",
    placeholder: "Type your query or click the microphone to speak...",
    chips: [
      "Where is OPD Room 4B?",
      "Which doctor should I see for fever?",
      "Panchakarma department timings",
      "How do I get my consultation token?",
    ],
  },
};

const HI: Translations = {
  nav: {
    home: "होम",
    appointments: "अपॉइंटमेंट और टोकन",
    records: "मेडिकल रिकॉर्ड व पर्चे",
    ai: "एआई गाइड",
    doctorSwitch: "डॉक्टर कॉकपिट पर जाएं →",
  },
  home: {
    greeting: "नमस्ते",
    kioskTag: "अखिल भारतीय आयुर्वेद संस्थान · ओपीडी कियोस्क",
    welcomeSub: "ओपीडी कियोस्क में आपका स्वागत है। आज हम आपकी क्या सहायता कर सकते हैं?",
    heroTitle: "अस्पताल स्वयं-सेवा",
    heroDesc: "ओपीडी टोकन प्राप्त करें, पर्चा स्कैन करें या एआई गाइड से जानकारी लें।",
    btnBook: "टोकन प्राप्त करें",
    btnRecords: "पर्चा स्कैन करें",
    btnGuide: "एआई से पूछें",
    servicesHeader: "मुख्य सेवाएं",
    cardApptsTitle: "अपॉइंटमेंट व टोकन",
    cardApptsDesc: "कतार स्थिति (टोकन #2, कमरा 4B) देखें और परामर्श टोकन लें।",
    cardRecordsTitle: "मेडिकल रिकॉर्ड व पर्चे",
    cardRecordsDesc: "हाथ से लिखे पर्चे स्कैन करें और लैब टेस्ट देखें।",
    cardAiTitle: "एआई वॉइस गाइड",
    cardAiDesc: "कमरे, डॉक्टर, ओपीडी समय या लक्षणों की जानकारी पूछें।",
    cardHelpTitle: "सहायता केंद्र",
    cardHelpDesc: "रिसेप्शन और आपातकालीन सहायता डेस्क।",
  },
  appointments: {
    title: "अपॉइंटमेंट और ओपीडी टोकन",
    tokenLabel: "टोकन",
    nextInLine: "कतार में अगला नंबर आपका है",
    estWait: "अनुमानित समय: ~4 मिनट",
    printSlip: "पर्ची प्रिंट करें",
    refresh: "रिफ्रेश",
    deptTitle: "विभाग चुनें",
    doctorsTitle: "आज उपलब्ध चिकित्सक",
    operationalBadge: "कमरे उपलब्ध",
    getToken: "टोकन प्राप्त करें",
    pastVisitsTitle: "पिछली मुलाक़ातें",
    viewPrescription: "पर्चा देखें",
    depts: {
      all: "सभी विभाग",
      kayachikitsa: "कायाचिकित्सा",
      panchakarma: "पंचकर्म",
      cardio: "हृदय रोग",
      shalya: "शल्य तंत्र",
      pediatrics: "बाल रोग",
    },
  },
  records: {
    title: "डिजिटल मेडिकल रिकॉर्ड व पर्चे",
    scannerTitle: "पर्चा एवं दस्तावेज़ स्कैनर",
    scannerDesc: "कागज़ी पर्चा स्कैन करें या डिजिटल रिपोर्ट अपलोड करें।",
    tapUpload: "अपलोड करने या फ़ोटो खींचने के लिए टैप करें",
    uploadSub: "पर्चे, लैब रिपोर्ट, डिस्चार्ज सारांश",
    btnUpload: "फ़ाइल चुनें या फ़ोटो लें",
    analyzing: "दस्तावेज़ की जाँच हो रही है...",
    viewDetails: "विवरण और ओसीआर देखें",
    ocrActive: "ओसीआर सक्रिय",
    categories: {
      all: "सभी",
      blood: "रक्त जाँच",
      imaging: "इमेजिंग",
      rx: "पर्चे",
      reports: "रिपोर्ट",
    },
  },
  aiGuide: {
    title: "एआई अस्पताल गाइड",
    companionTitle: "एआईआईए कियोस्क गाइड",
    companionSub: "डॉक्टर के कमरे, समय या विभाग के बारे में पूछें।",
    activeGuide: "सक्रिय गाइड",
    replay: "दोबारा सुनें",
    listening: "सुन रहे हैं...",
    suggestedHeader: "सुझाए गए प्रश्न:",
    placeholder: "यहाँ लिखें या बोलने के लिए माइक दबाएँ...",
    chips: [
      "ओपीडी कक्ष 4B कहाँ है?",
      "बुखार के लिए कौन सा डॉक्टर देखना चाहिए?",
      "पंचकर्म विभाग का समय क्या है?",
      "परामर्श टोकन कैसे प्राप्त करें?",
    ],
  },
};

const BN: Translations = {
  ...EN,
  nav: {
    home: "হোম",
    appointments: "অ্যাপয়েন্টমেন্ট ও টোকেন",
    records: "মেডিকেল রেকর্ড",
    ai: "এআই গাইড",
    doctorSwitch: "ডাক্তার ককপিট →",
  },
  home: {
    ...EN.home,
    greeting: "নমস্কার",
    heroTitle: "হাসপাতাল স্ব-সেবা",
    btnBook: "টোকেন নিন",
    btnRecords: "প্রেসক্রিপশন স্ক্যান",
    btnGuide: "এআই সাহায্য",
  },
};

const TA: Translations = {
  ...EN,
  nav: {
    home: "முகப்பு",
    appointments: "டோக்கன் மற்றும் சந்திப்பு",
    records: "மருத்துவ பதிவுகள்",
    ai: "AI வழிகாட்டி",
    doctorSwitch: "மருத்துவர் பக்கம் →",
  },
  home: {
    ...EN.home,
    greeting: "வணக்கம்",
    heroTitle: "மருத்துவமனை சேவை",
    btnBook: "டோக்கன் பெறுக",
    btnRecords: "மருந்து சீட்டு ஸ்கேன்",
    btnGuide: "AI கேட்க",
  },
};

const TE: Translations = {
  ...EN,
  nav: {
    home: "హోమ్",
    appointments: "టోకెన్ & అపాయింట్‌మెంట్",
    records: "వైద్య రికార్డులు",
    ai: "AI గైడ్",
    doctorSwitch: "డాక్టర్ కాక్‌పిట్ →",
  },
  home: {
    ...EN.home,
    greeting: "నమస్కారం",
    heroTitle: "హాస్పిటల్ సేవలు",
    btnBook: "టోకెన్ బుక్ చేయండి",
    btnRecords: "ప్రిస్క్రిప్షన్ స్కాన్",
    btnGuide: "AI గైడ్",
  },
};

const MR: Translations = {
  ...EN,
  nav: {
    home: "होम",
    appointments: "अपॉइंटमेंट आणि टोकन",
    records: "वैद्यकीय नोंदी",
    ai: "एआय मार्गदर्शक",
    doctorSwitch: "डॉक्टर कॉकपिट →",
  },
  home: {
    ...EN.home,
    greeting: "नमस्कार",
    heroTitle: "रुग्णालय स्वयंसेवा",
    btnBook: "टोकन घ्या",
    btnRecords: "प्रिस्क्रिप्शन स्कॅन",
    btnGuide: "एआय मदत",
  },
};

const GU: Translations = {
  ...EN,
  nav: {
    home: "હોમ",
    appointments: "એપોઇન્ટમેન્ટ અને ટોકન",
    records: "મેડિકલ રેકોર્ડ્સ",
    ai: "AI માર્ગદર્શક",
    doctorSwitch: "ડોક્ટર કોકપિટ →",
  },
  home: {
    ...EN.home,
    greeting: "નમસ્તે",
    heroTitle: "હોસ્પિટલ સેવાઓ",
    btnBook: "ટોકન બુક કરો",
    btnRecords: "પ્રિસ્ક્રિપ્શન સ્કેન",
    btnGuide: "AI પૂછો",
  },
};

const KN: Translations = {
  ...EN,
  nav: {
    home: "ಮುಖಪುಟ",
    appointments: "ನೇಮಕಾತಿ & ಟೋಕನ್",
    records: "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    ai: "AI ಮಾರ್ಗದರ್ಶಿ",
    doctorSwitch: "ವೈದ್ಯರ ವಿಭಾಗ →",
  },
  home: {
    ...EN.home,
    greeting: "ನಮಸ್ಕಾರ",
    heroTitle: "ಆಸ್ಪತ್ರೆ ಸ್ವಯಂ ಸೇವೆ",
    btnBook: "ಟೋಕನ್ ಪಡೆಯಿರಿ",
    btnRecords: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್",
    btnGuide: "AI ಸಹಾಯ",
  },
};

const ML: Translations = {
  ...EN,
  nav: {
    home: "ഹോം",
    appointments: "ടോക്കൺ & അപ്പോയിന്റ്മെന്റ്",
    records: "മെഡിക്കൽ രേഖകൾ",
    ai: "AI വഴികാട്ടി",
    doctorSwitch: "ഡോക്ടർ കോക്ക്പിറ്റ് →",
  },
  home: {
    ...EN.home,
    greeting: "നമസ്കാരം",
    heroTitle: "ആശുപത്രി സ്വയം സേവനം",
    btnBook: "ടോക്കൺ എടുക്കുക",
    btnRecords: "കുറിപ്പടി സ്കാൻ ചെയ്യുക",
    btnGuide: "AI ചോദിക്കുക",
  },
};

const PA: Translations = {
  ...EN,
  nav: {
    home: "ਹੋਮ",
    appointments: "ਮੁਲਾਕਾਤ ਅਤੇ ਟੋਕਨ",
    records: "ਮੈਡੀਕਲ ਰਿਕਾਰਡ",
    ai: "AI ਗਾਈਡ",
    doctorSwitch: "ਡਾਕਟਰ ਕਾਕਪਿਟ →",
  },
  home: {
    ...EN.home,
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    heroTitle: "ਹਸਪਤਾਲ ਸਵੈ-ਸੇਵਾ",
    btnBook: "ਟੋਕਨ ਲਵੋ",
    btnRecords: "ਪਰਚੀ ਸਕੈਨ ਕਰੋ",
    btnGuide: "AI ਪੁੱਛੋ",
  },
};

const OR: Translations = {
  ...EN,
  nav: {
    home: "ମୂଳପୃଷ୍ଠା",
    appointments: "ନିଯୁକ୍ତି ଏବଂ ଟୋକନ୍",
    records: "ଡାକ୍ତରୀ ରେକର୍ଡ",
    ai: "AI ମାର୍ଗଦର୍ଶକ",
    doctorSwitch: "ଡାକ୍ତର କକପିଟ୍ →",
  },
  home: {
    ...EN.home,
    greeting: "ନମସ୍କାର",
    heroTitle: "ଡାକ୍ତରଖାନା ସେବା",
    btnBook: "ଟୋକନ୍ ନିଅନ୍ତୁ",
    btnRecords: "ପ୍ରେସକ୍ରିପସନ୍ ସ୍କାନ",
    btnGuide: "AI ସହାୟତା",
  },
};

const DICTIONARY: Record<string, Translations> = {
  en: EN,
  hi: HI,
  bn: BN,
  ta: TA,
  te: TE,
  mr: MR,
  gu: GU,
  kn: KN,
  ml: ML,
  pa: PA,
  or: OR,
};

export function getTranslations(lang: string = "en"): Translations {
  return DICTIONARY[lang] || EN;
}
