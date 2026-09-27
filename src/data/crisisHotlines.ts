export interface HelplineInfo {
  name: string;
  action: string;
  phone: string;
  numberDisplay: string;
  desc: string;
  available: string;
  languages?: string;
  type: 'emergency' | 'mental_health' | 'text_chat' | 'ngo';
}

export interface CountryCrisisData {
  id: string;
  name: string;
  flag: string;
  primaryEmergencyNumber: string;
  primaryCrisisNumber: string;
  primaryCrisisName: string;
  callButtonText: string;
  shortLabel: string;
  description: string;
  hotlines: HelplineInfo[];
}

export const COUNTRIES_CRISIS_DATA: Record<string, CountryCrisisData> = {
  in: {
    id: 'in',
    name: 'India',
    flag: '🇮🇳',
    primaryEmergencyNumber: '112',
    primaryCrisisNumber: '14416',
    primaryCrisisName: 'Tele-MANAS (Govt. of India)',
    callButtonText: 'Call 14416',
    shortLabel: 'Tele-MANAS India',
    description: 'Official 24/7 free, confidential national mental health support by Ministry of Health & Family Welfare (MoHFW) and NIMHANS.',
    hotlines: [
      {
        name: 'Tele-MANAS (Govt. of India)',
        action: 'Call 14416 or 1800-891-4416',
        phone: 'tel:14416',
        numberDisplay: '14416 / 1800-891-4416',
        desc: 'National Tele Mental Health Programme of India. 24x7 free toll-free support in 20+ Indian languages managed by NIMHANS apex institute.',
        available: '24/7 Toll-Free & Free from any SIM',
        languages: 'Hindi, English, Tamil, Telugu, Marathi, Bengali, Kannada, Malayalam, Gujarati, Punjabi, Odia, Assamese, etc.',
        type: 'mental_health'
      },
      {
        name: 'KIRAN Mental Health Rehabilitation Helpline',
        action: 'Call 1800-599-0019',
        phone: 'tel:18005990019',
        numberDisplay: '1800-599-0019',
        desc: 'Ministry of Social Justice and Empowerment (Govt. of India). Psychological first aid, distress relief, anxiety, and suicide prevention.',
        available: '24/7 Toll-Free',
        languages: 'Hindi, English, and 13 Regional Languages',
        type: 'mental_health'
      },
      {
        name: 'NIMHANS Psychosocial Support Helpline',
        action: 'Call 080-46110007',
        phone: 'tel:08046110007',
        numberDisplay: '080-46110007',
        desc: 'National Institute of Mental Health & Neuro Sciences (NIMHANS), Bengaluru. Direct access to trained mental health professionals.',
        available: '24/7 Clinical Support',
        languages: 'English, Hindi, Kannada, Tamil, Telugu, Malayalam',
        type: 'mental_health'
      },
      {
        name: 'Vandrevala Foundation Helpline',
        action: 'Call or WhatsApp +91 9999 666 555',
        phone: 'tel:+919999666555',
        numberDisplay: '+91 9999 666 555',
        desc: 'Experienced clinical psychologists and psychiatrists providing free mental health counseling & crisis intervention via Call & WhatsApp.',
        available: '24/7 Free Call / WhatsApp',
        languages: 'English, Hindi, and Regional Languages',
        type: 'ngo'
      },
      {
        name: 'AASRA Suicide Prevention Helpline',
        action: 'Call +91 98204 66726',
        phone: 'tel:+919820466726',
        numberDisplay: '+91 98204 66726',
        desc: 'Dedicated 24/7 non-profit crisis intervention and suicide prevention helpline in Mumbai / Pan-India.',
        available: '24/7 Confidential',
        languages: 'English, Hindi',
        type: 'ngo'
      },
      {
        name: 'SNEHA India Crisis Helpline',
        action: 'Call +91 44 2464 0050',
        phone: 'tel:+914424640050',
        numberDisplay: '+91 44 2464 0050',
        desc: '24-hour voluntary non-profit organization offering emotional support to anyone feeling depressed, distressed, or suicidal.',
        available: '24/7 Pan-India',
        languages: 'English, Tamil, Hindi',
        type: 'ngo'
      },
      {
        name: 'iCall Psychosocial Helpline (TISS)',
        action: 'Call +91 91529 87821',
        phone: 'tel:+919152987821',
        numberDisplay: '+91 91529 87821',
        desc: 'Tata Institute of Social Sciences (TISS). Professional counseling by trained clinical psychologists for emotional and psychological distress.',
        available: 'Mon–Sat (8:00 AM – 10:00 PM)',
        languages: 'English, Hindi, Marathi',
        type: 'mental_health'
      },
      {
        name: 'National Emergency Response (ERSS)',
        action: 'Call 112',
        phone: 'tel:112',
        numberDisplay: '112',
        desc: 'Unified all-in-one emergency service in India for immediate Police, Medical Ambulance, and Fire dispatch.',
        available: '24/7 Immediate Dispatch',
        languages: 'All Indian Languages',
        type: 'emergency'
      },
      {
        name: 'National Women Helpline',
        action: 'Call 181 or 1091',
        phone: 'tel:181',
        numberDisplay: '181 / 1091',
        desc: 'Govt. of India 24-hour toll-free emergency helpline for women in distress or facing safety emergencies.',
        available: '24/7 Toll-Free',
        languages: 'Hindi, English, Regional Languages',
        type: 'emergency'
      }
    ]
  },
  us: {
    id: 'us',
    name: 'United States',
    flag: '🇺🇸',
    primaryEmergencyNumber: '911',
    primaryCrisisNumber: '988',
    primaryCrisisName: '988 Suicide & Crisis Lifeline',
    callButtonText: 'Call 988',
    shortLabel: '988 Crisis Help',
    description: 'Free, confidential, 24/7 support across the United States for mental health distress and suicidal crises.',
    hotlines: [
      {
        name: '988 Suicide & Crisis Lifeline',
        action: 'Call or Text 988',
        phone: 'tel:988',
        numberDisplay: '988',
        desc: 'Direct connection to trained crisis counselors for emotional distress, panic attacks, and suicidal crises.',
        available: '24/7 Toll-Free',
        languages: 'English, Spanish, and 240+ languages via translation',
        type: 'mental_health'
      },
      {
        name: 'Crisis Text Line',
        action: 'Text HOME to 741741',
        phone: 'sms:741741?body=HOME',
        numberDisplay: 'Text 741741',
        desc: 'Free 24/7 confidential crisis intervention via SMS messaging with trained counselors.',
        available: '24/7 Free SMS',
        languages: 'English, Spanish',
        type: 'text_chat'
      },
      {
        name: 'The Trevor Project (LGBTQ Youth)',
        action: 'Call 1-866-488-7386',
        phone: 'tel:18664887386',
        numberDisplay: '1-866-488-7386',
        desc: 'Crisis intervention and suicide prevention for LGBTQ young people.',
        available: '24/7 Free',
        languages: 'English, Spanish',
        type: 'mental_health'
      },
      {
        name: 'Veterans Crisis Line',
        action: 'Dial 988 then Press 1',
        phone: 'tel:988',
        numberDisplay: '988 (Press 1)',
        desc: 'Caring, qualified responders with the Department of Veterans Affairs.',
        available: '24/7 Toll-Free',
        type: 'mental_health'
      },
      {
        name: 'Emergency Dispatch (USA)',
        action: 'Call 911',
        phone: 'tel:911',
        numberDisplay: '911',
        desc: 'Immediate emergency police, medical, or fire assistance.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  uk: {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    primaryEmergencyNumber: '999',
    primaryCrisisNumber: '111',
    primaryCrisisName: 'NHS Mental Health & Samaritans',
    callButtonText: 'Call 111',
    shortLabel: 'NHS & Samaritans',
    description: 'Free 24/7 mental health and urgent crisis services across England, Scotland, Wales, and Northern Ireland.',
    hotlines: [
      {
        name: 'Samaritans UK',
        action: 'Call 116 123',
        phone: 'tel:116123',
        numberDisplay: '116 123',
        desc: 'Free 24/7 non-judgmental listening and emotional support for anyone struggling to cope.',
        available: '24/7 Free',
        languages: 'English, Welsh',
        type: 'mental_health'
      },
      {
        name: 'NHS Urgent Mental Health Helpline',
        action: 'Call 111',
        phone: 'tel:111',
        numberDisplay: '111',
        desc: 'Direct NHS assessment and urgent mental health support 24 hours a day.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Shout Crisis Text Line',
        action: 'Text SHOUT to 85258',
        phone: 'sms:85258?body=SHOUT',
        numberDisplay: 'Text 85258',
        desc: 'Confidential 24/7 crisis text support service in the UK.',
        available: '24/7 Free SMS',
        type: 'text_chat'
      },
      {
        name: 'Emergency Services (UK)',
        action: 'Call 999',
        phone: 'tel:999',
        numberDisplay: '999',
        desc: 'Immediate emergency police, ambulance, or fire services.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  ca: {
    id: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    primaryEmergencyNumber: '911',
    primaryCrisisNumber: '988',
    primaryCrisisName: '988 Suicide Crisis Helpline Canada',
    callButtonText: 'Call 988',
    shortLabel: '988 Canada',
    description: 'Bilingual 24/7 national suicide crisis helpline across Canada in English and French.',
    hotlines: [
      {
        name: '988 Suicide Crisis Helpline',
        action: 'Call or Text 988',
        phone: 'tel:988',
        numberDisplay: '988',
        desc: 'Toll-free 24/7 confidential support for anyone in Canada thinking about suicide or worried about someone.',
        available: '24/7 Toll-Free',
        languages: 'English, French',
        type: 'mental_health'
      },
      {
        name: 'Kids Help Phone',
        action: 'Call 1-800-668-6868 or Text 686868',
        phone: 'tel:18006686868',
        numberDisplay: '1-800-668-6868',
        desc: 'E-mental health service offering free, confidential support to young people.',
        available: '24/7 Free',
        languages: 'English, French',
        type: 'mental_health'
      },
      {
        name: 'Hope for Wellness (Indigenous Helpline)',
        action: 'Call 1-855-242-3310',
        phone: 'tel:18552423310',
        numberDisplay: '1-855-242-3310',
        desc: '24/7 culturally grounded counseling for all Indigenous people in Canada.',
        available: '24/7 Toll-Free',
        languages: 'English, French, Cree, Ojibway, Inuktitut',
        type: 'mental_health'
      },
      {
        name: 'Emergency Services (Canada)',
        action: 'Call 911',
        phone: 'tel:911',
        numberDisplay: '911',
        desc: 'Immediate emergency police, ambulance, and medical assistance.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  au: {
    id: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    primaryEmergencyNumber: '000',
    primaryCrisisNumber: '13 11 14',
    primaryCrisisName: 'Lifeline Australia',
    callButtonText: 'Call 13 11 14',
    shortLabel: 'Lifeline Australia',
    description: '24/7 national crisis support and suicide prevention services across Australia.',
    hotlines: [
      {
        name: 'Lifeline Australia',
        action: 'Call 13 11 14 or Text 0477 13 11 14',
        phone: 'tel:131114',
        numberDisplay: '13 11 14',
        desc: '24-hour national crisis support and suicide prevention service.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Beyond Blue',
        action: 'Call 1300 22 4636',
        phone: 'tel:1300224636',
        numberDisplay: '1300 22 4636',
        desc: 'Anxiety, depression, and mental health counseling support with trained mental health professionals.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Kids Helpline',
        action: 'Call 1800 55 1800',
        phone: 'tel:1800551800',
        numberDisplay: '1800 55 1800',
        desc: 'Free, private and confidential 24/7 phone and online counseling service for young people aged 5 to 25.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Triple Zero (000) Emergency',
        action: 'Call 000',
        phone: 'tel:000',
        numberDisplay: '000',
        desc: 'Immediate emergency police, ambulance, and fire rescue in Australia.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  de: {
    id: 'de',
    name: 'Germany',
    flag: '🇩🇪',
    primaryEmergencyNumber: '112',
    primaryCrisisNumber: '0800 111 0 111',
    primaryCrisisName: 'TelefonSeelsorge Deutschland',
    callButtonText: 'Call 0800 111 0 111',
    shortLabel: 'TelefonSeelsorge',
    description: 'Kostenfreie und anonyme Seelsorge und Krisenberatung rund um die Uhr in ganz Deutschland.',
    hotlines: [
      {
        name: 'TelefonSeelsorge Deutschland',
        action: 'Call 0800 111 0 111 or 0800 111 0 222',
        phone: 'tel:08001110111',
        numberDisplay: '0800 111 0 111',
        desc: 'Anonyme, gebührenfreie Beratung in Krisensituationen rund um die Uhr.',
        available: '24/7 Kostenfrei',
        languages: 'Deutsch',
        type: 'mental_health'
      },
      {
        name: 'Nummer gegen Kummer',
        action: 'Call 116 111',
        phone: 'tel:116111',
        numberDisplay: '116 111',
        desc: 'Kostenfreies Kinder- und Jugendtelefon für emotionale Notlagen.',
        available: 'Mo–Sa (14:00 – 20:00 Uhr)',
        type: 'mental_health'
      },
      {
        name: 'Notruf Feuerwehr & Rettungsdienst',
        action: 'Call 112',
        phone: 'tel:112',
        numberDisplay: '112',
        desc: 'Akuter medizinischer Notfall und Rettung in Deutschland.',
        available: '24/7 Notruf',
        type: 'emergency'
      }
    ]
  },
  sg: {
    id: 'sg',
    name: 'Singapore',
    flag: '🇸🇬',
    primaryEmergencyNumber: '995',
    primaryCrisisNumber: '1767',
    primaryCrisisName: 'Samaritans of Singapore (SOS)',
    callButtonText: 'Call 1767',
    shortLabel: 'SOS Singapore',
    description: '24-hour confidential suicide prevention and crisis hotline in Singapore.',
    hotlines: [
      {
        name: 'Samaritans of Singapore (SOS)',
        action: 'Call 1767 or WhatsApp 9151 1767',
        phone: 'tel:1767',
        numberDisplay: '1767',
        desc: '24-hour suicide prevention and emotional support lifeline.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Institute of Mental Health (IMH) Helpline',
        action: 'Call 6389 2222',
        phone: 'tel:63892222',
        numberDisplay: '6389 2222',
        desc: 'Mental health crisis and emergency psychiatric support.',
        available: '24/7',
        type: 'mental_health'
      },
      {
        name: 'Emergency Medical Services (SCDF)',
        action: 'Call 995',
        phone: 'tel:995',
        numberDisplay: '995',
        desc: 'SCDF ambulance and medical emergencies.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  ae: {
    id: 'ae',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    primaryEmergencyNumber: '998',
    primaryCrisisNumber: '800 4673',
    primaryCrisisName: 'Estepshary Mental Health Helpline',
    callButtonText: 'Call 800 4673',
    shortLabel: 'UAE Mental Health',
    description: 'National psychological support helpline by the National Program for Happiness and Wellbeing.',
    hotlines: [
      {
        name: 'Estepshary Mental Support Line',
        action: 'Call 800 4673 (800 HOPE)',
        phone: 'tel:8004673',
        numberDisplay: '800 4673',
        desc: 'Free psychological and emotional support line in the UAE.',
        available: 'Daily 8:00 AM – 8:00 PM',
        languages: 'Arabic, English',
        type: 'mental_health'
      },
      {
        name: 'National Ambulance',
        action: 'Call 998',
        phone: 'tel:998',
        numberDisplay: '998',
        desc: 'Immediate emergency medical response across UAE.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  nz: {
    id: 'nz',
    name: 'New Zealand',
    flag: '🇳🇿',
    primaryEmergencyNumber: '111',
    primaryCrisisNumber: '1737',
    primaryCrisisName: '1737 Need to Talk?',
    callButtonText: 'Call 1737',
    shortLabel: '1737 New Zealand',
    description: 'Free national 24/7 mental health and addictions counseling service in New Zealand.',
    hotlines: [
      {
        name: '1737 Need to Talk?',
        action: 'Call or Text 1737',
        phone: 'tel:1737',
        numberDisplay: '1737',
        desc: 'Free 24/7 call or text service to talk with a trained counselor.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Lifeline Aotearoa',
        action: 'Call 0800 543 354 or Text 4357',
        phone: 'tel:0800543354',
        numberDisplay: '0800 543 354',
        desc: 'Confidential 24/7 telephone counseling and crisis support.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Emergency Services (NZ)',
        action: 'Call 111',
        phone: 'tel:111',
        numberDisplay: '111',
        desc: 'Immediate police, ambulance, or fire service response.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  ie: {
    id: 'ie',
    name: 'Ireland',
    flag: '🇮🇪',
    primaryEmergencyNumber: '112',
    primaryCrisisNumber: '116 123',
    primaryCrisisName: 'Samaritans Ireland',
    callButtonText: 'Call 116 123',
    shortLabel: 'Samaritans Ireland',
    description: 'Free 24/7 listening service for anyone in Ireland who needs emotional support.',
    hotlines: [
      {
        name: 'Samaritans Ireland',
        action: 'Call 116 123',
        phone: 'tel:116123',
        numberDisplay: '116 123',
        desc: 'Free 24-hour emotional support for anyone in distress or struggling to cope.',
        available: '24/7 Free',
        type: 'mental_health'
      },
      {
        name: 'Text About It (50808)',
        action: 'Text HELLO to 50808',
        phone: 'sms:50808?body=HELLO',
        numberDisplay: 'Text 50808',
        desc: 'Free, anonymous, 24/7 text service providing crisis support.',
        available: '24/7 Free SMS',
        type: 'text_chat'
      },
      {
        name: 'Emergency Services (Ireland)',
        action: 'Call 999 or 112',
        phone: 'tel:112',
        numberDisplay: '112 / 999',
        desc: 'Immediate emergency police, ambulance, and fire rescue.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  },
  fr: {
    id: 'fr',
    name: 'France',
    flag: '🇫🇷',
    primaryEmergencyNumber: '112',
    primaryCrisisNumber: '3114',
    primaryCrisisName: '3114 Numéro National de Prévention du Suicide',
    callButtonText: 'Call 3114',
    shortLabel: '3114 France',
    description: 'Numéro gratuit, confidentiel et accessible 24h/24 et 7j/7 en France.',
    hotlines: [
      {
        name: '3114 Numéro National de Prévention du Suicide',
        action: 'Call 3114',
        phone: 'tel:3114',
        numberDisplay: '3114',
        desc: 'Ligne d’écoute pour les personnes en détresse psychologique et idées suicidaires.',
        available: '24/7 Gratuit',
        languages: 'Français',
        type: 'mental_health'
      },
      {
        name: 'SOS Amitié',
        action: 'Call 09 72 39 40 50',
        phone: 'tel:0972394050',
        numberDisplay: '09 72 39 40 50',
        desc: 'Service d’écoute anonyme et bénévole pour toute personne en détresse.',
        available: '24/7 Gratuit',
        languages: 'Français',
        type: 'ngo'
      },
      {
        name: 'SAMU / Urgences Médicales',
        action: 'Call 15 ou 112',
        phone: 'tel:15',
        numberDisplay: '15 / 112',
        desc: 'Secours médicaux urgents en France.',
        available: '24/7 Urgences',
        type: 'emergency'
      }
    ]
  },
  jp: {
    id: 'jp',
    name: 'Japan',
    flag: '🇯🇵',
    primaryEmergencyNumber: '119',
    primaryCrisisNumber: '0570-064-556',
    primaryCrisisName: 'Kokoro no Kenko Sodan Touitsu Dial',
    callButtonText: 'Call 0570-064-556',
    shortLabel: 'Japan Mental Health',
    description: 'Ministry of Health, Labour and Welfare mental health consultation line in Japan.',
    hotlines: [
      {
        name: 'Kokoro no Kenko Sodan (Govt. of Japan)',
        action: 'Call 0570-064-556',
        phone: 'tel:0570064556',
        numberDisplay: '0570-064-556',
        desc: 'Public mental health support consultation across all prefectures in Japan.',
        available: 'Daily Support',
        languages: 'Japanese',
        type: 'mental_health'
      },
      {
        name: 'TELL Lifeline (English & Japanese)',
        action: 'Call 03-5774-0992',
        phone: 'tel:0357740992',
        numberDisplay: '03-5774-0992',
        desc: 'Free, confidential crisis counseling support for the international and local community in Japan.',
        available: 'Daily 9:00 AM – 11:00 PM',
        languages: 'English, Japanese',
        type: 'mental_health'
      },
      {
        name: 'Emergency Medical / Ambulance',
        action: 'Call 119',
        phone: 'tel:119',
        numberDisplay: '119',
        desc: 'Ambulance and fire emergency dispatch in Japan.',
        available: '24/7 Emergency',
        type: 'emergency'
      }
    ]
  }
};

export const DEFAULT_COUNTRY_KEY = 'in'; // Default to India as requested

export function getCountryCrisisData(countryKey?: string): CountryCrisisData {
  const key = countryKey?.toLowerCase() || DEFAULT_COUNTRY_KEY;
  return COUNTRIES_CRISIS_DATA[key] || COUNTRIES_CRISIS_DATA['in'];
}
