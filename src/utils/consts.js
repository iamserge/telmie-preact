export const consts = {
  PAGE_SIZE: 20,
  CHAT: 'CHAT',
  CALL: 'CALL',
};

export const EN = 'en-us',
  RU = 'ru',
  IT = 'it-it',
  ES = 'es-es',
  PL = 'pl',
  AE = 'ar-ae',
  PT = 'pt-br';

export const langs = {
  [EN]: {
    code: 'en',
    lang: EN,
    name: 'eng',
    emoji: '🇬🇧',
  },
  [RU]: {
    code: 'ru',
    lang: RU,
    name: 'рус',
    emoji: '🇷🇺',
  },
  [IT]: {
    code: 'it',
    lang: IT,
    name: 'ita',
    emoji: '🇮🇹',
  },
  [ES]: {
    code: 'es',
    lang: ES,
    name: 'esp',
    emoji: '🇪🇸',
  },
  [PL]: {
    code: 'pl',
    lang: PL,
    name: 'pol',
    emoji: '🇵🇱',
  },
  [AE]: {
    code: 'ar',
    lang: AE,
    name: 'ar',
    emoji: '🇦🇪',
  },
  [PT]: {
    code: 'pt',
    lang: PT,
    name: 'pt',
    emoji: '🇧🇷',
  },
};

export const labelsGA = {
  downloadAppClick: 'Clicked Download App'
};

export const activityTypes = {
  'c': 'RECEIVED CALL',
  'mc': 'MISSED CALL',
  'fc': 'FAILED CALL',
  'im': 'READ message',
  'uim': 'NEW message',
  'om': 'OUTGOING message',
  's': 'SHORTLISTED',
}

export const chatBtns = {
  decline: 'Decline',
  pickUp: 'Pick up',
  textMe: 'Text me',
  cancel: 'Cancel',
  finish: 'Hang up',
  control: {
    speaker: 'speaker',
    video: 'video',
    mute: 'mute',
  }
};