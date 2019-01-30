import { apiUrls } from './index';

export function createCall(cid, isPro = false, authData) {
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	const additionalQuery = isPro ? `?cid=${cid}&isPro=${isPro}` : `?cid=${cid}`;

	return fetch(apiUrls.CALLS + additionalQuery, {method: 'POST', headers}).then(response => {
		return response.json().then(json => {
			return json;
		})
		.catch(err => {
			console.log(err);
			return { error: true }
		})
	});
}