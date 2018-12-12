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


export  function getProDetails(userId, authData){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	return fetch(apiUrls.GET_PRO_USER_DETAILS(userId), { method: 'GET', headers }).then(response => {
		return (response.status === 404) ? {} : response.json().then(json => json);
	}, error => {
		throw new Error(error.message);
	});
}

export function addToShortlist(userId, authData){

	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	headers.append("Content-Type", "application/json ");

	return fetch(apiUrls.ADD_TO_SHORTLIST, { method: 'POST', headers: headers, body: JSON.stringify( { id: userId } )}).then(response => {
    if (response.status === 401 || response.status === 400 || response.status === 415 || response.status === 500){
			return {shortlisted: 'failure'}
		}
		return response.text().then(text => {
			return {shortlisted: 'success'}

		}, error => {
			throw new Error(error.message);
		});

	}, error => {
		throw new Error(error.message);
	});
}
