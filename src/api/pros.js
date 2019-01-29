import { apiUrls } from './index';
import { consts } from '../utils/consts';



export  function getPros(searchTerm, sortBy, page, authData){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	page = page - 1;
	return fetch(apiUrls.SEARCH_USERS + searchTerm + '&size=' + consts.PAGE_SIZE + '&page=' + page + '&sort=' + sortBy , { method: 'GET', headers}).then(response => {
    if (response.status === 404){
			return {};
		}
		return response.json().then(json => {
			return json;
		});

	}, error => {
		throw new Error(error.message);
	});
}

export  function getUserDetails(userId, authData, isPro = true){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	const url = isPro ? apiUrls.GET_PRO_USER_DETAILS(userId) : apiUrls.GET_CLIENT_USER_DETAILS(userId);
	return fetch(url, { method: 'GET', headers }).then(response => {
		return (response.status === 404) ? {} : response.json().then(json => json);
	}, error => {
		throw new Error(error.message);
	});
}

export  function getCallDetails(callId, authData){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	return fetch(apiUrls.CALLS + `/${callId}`, { method: 'GET', headers }).then(response => {
		return (response.status === 404) ? {} : response.json().then(json => json);
	}, error => {
		throw new Error(error.message);
	});
}

export  function getClientDetails(userId, authData){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	return fetch(apiUrls.GET_CLIENT_USER_DETAILS(userId), { method: 'GET', headers }).then(response => {
		return (response.status === 404) ? {} : response.json().then(json => json);
	}, error => {
		throw new Error(error.message);
	});
}

export function addToShortlist(userId, authData, isForDelete){

	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	return fetch(apiUrls.ADD_TO_SHORTLIST(userId), { method: isForDelete ? "DELETE" : 'POST', headers, }).then(response => {
		if (response.status === 401 || response.status === 400 ){
			return { message: 'shortlisted failure' , error: true }
		}
		
		return response.json().then(obj => {
			return obj

		}, error => {
			throw new Error(error.message);
		});

	}, error => {
		throw new Error(error.message);
	});
}
