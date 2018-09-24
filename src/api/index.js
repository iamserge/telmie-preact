export const apiRoot = 'http://sr461.2dayhost.com/api/';
export const apiUrls = {
  REGISTER: apiRoot + 'users',
  EDIT_DETAILS: apiRoot + 'users/',
  SEARCH_USERS: apiRoot + 'users/pro?q=',
  GET_USER_DETAILS: apiRoot + 'users/',
  LOG_IN: apiRoot + 'auth',
  GET_PRO_CALLS: apiRoot + 'calls?isConsultant=true&size=9999&page=',
  GET_PERSONAL_CALLS: apiRoot + 'calls?isConsultant=false&size=9999&page=',
  GET_TRANSACTIONS: apiRoot + 'cards/history',
  VERIFY_USER: apiRoot + 'users/signup',
  ADD_TO_SHORTLIST: apiRoot + 'calls/shortlist',
  RESET_PASSWORD: apiRoot  + 'security/reset',
  UPLOAD_PHOTO: apiRoot + 'image',
  SEND_CODE: apiRoot + 'code'
}
