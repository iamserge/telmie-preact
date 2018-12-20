export const consts = {
  PAGE_SIZE: 20
};

export const EN = 'en-us',
  RU = 'ru';

export const langs = {
  [EN]: {
    code: 'en-us',
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