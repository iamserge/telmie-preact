import { api } from "prismic-javascript";

export const apiRoot = 'http://sr461.2dayhost.com/api/'; // for dev server
//export const apiRoot = 'https://telmie.com/api/'; // for prod server
export const apiUrls = {
  REGISTER: apiRoot + 'users',
  EDIT_DETAILS: apiRoot + 'users/',
  SEARCH_USERS: apiRoot + 'users/pro?q=',
  GET_USER_DETAILS: apiRoot + 'users/',
  GET_PRO_USER_DETAILS: (proId) => apiRoot + 'users/pro/' + proId,
  LOG_IN: apiRoot + 'auth',
  GET_PRO_CALLS: apiRoot + 'users/activity?isPro=true',
  GET_PERSONAL_CALLS: apiRoot + 'users/activity?isPro=false',
  GET_TRANSACTIONS: apiRoot + 'wallet',
  VERIFY_USER: apiRoot + 'users/signup',
  ADD_TO_SHORTLIST: (id) => apiRoot + 'shortlist/' + id,
  RESET_PASSWORD: apiRoot  + 'security/reset',
  UPLOAD_PHOTO: apiRoot + 'image',
  SEND_CODE: apiRoot + 'code',
  REGISTER_PRO: (id) => apiRoot + 'users/'+ id + '/pro',
  GET_CATEGORIES: apiRoot + 'categories',
  SEND_CONTACT_DATA: apiRoot + 'help/contact',
  EMAIL_NOTIFICATIONS: apiRoot + 'users/emailNotifications',
  WORKING_PRO: apiRoot + 'users/pro/work',
}
