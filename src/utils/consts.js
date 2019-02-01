export const consts = {
  PAGE_SIZE: 20,
  CHAT: 'CHAT',
  CALL: 'CALL',
};

export const EN = 'en-us',
  RU = 'ru',
  IT = 'it-it';

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
};

export const activityTypes = {
  'c': 'CALLED',
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
}