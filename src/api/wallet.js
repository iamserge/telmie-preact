import { apiUrls } from './index';

function cardManipulation(method, authData, token){
	const isGet = method === 'GET';
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	!isGet && headers.append("Content-Type", "application/json ");

	const req = isGet ? 
		{ method, headers } 
		: { method, headers, body: JSON.stringify({ token }) }

	return fetch(apiUrls.GET_CARDS, req).then(response => {
		return response.status !== 200 ? ({
			error: true,
			message: `Error! ${response.statusText}`,
		}) : response.json().then(json => {
			return json;
		})
		.catch(err => {
			console.log(err);
			return { 
				error: true,
			}
		})
	})
}

export function getCards(authData){
	return cardManipulation("GET", authData);
}

export function deleteCard(token, authData){
	return cardManipulation('DELETE', authData, token);
}

export function addCard(token, authData){
	return cardManipulation('POST', authData, token);
}

function bankAccManipulation(method, authData, token){
	const isGet = method === 'GET';
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);
	!isGet && headers.append("Content-Type", "application/json ");

	const req = isGet ? 
		{ method, headers } 
		: { method, headers, body: JSON.stringify({ token }) }

	return fetch(apiUrls.GET_BANK_ACC, req).then(response => {
		return response.status !== 200 ? ({
			error: true,
			message: `Error! ${response.statusText}`,
		}) : response.json().then(json => {
			return json;
		})
		.catch(err => {
			console.log(err);
			return { 
				error: true,
			}
		})
	})
}

export function getBankAcc(authData){
	return bankAccManipulation("GET", authData);
}

export function deleteBankAcc(token, authData){
	return bankAccManipulation('DELETE', authData, token);
}

export function addBankAcc(token, authData){
	return bankAccManipulation('POST', authData, token);
}

export function getStripeKey(authData){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	return fetch(apiUrls.GET_STRIPE_KEY, { method: 'GET', headers }).then(response => {
		return response.status !== 200 ? ({
			error: true,
			message: `Error! ${response.statusText}`,
		}) : response.text().then(text => text)
		.catch(err => {
			console.log(err);
			return { 
				error: true,
			}
		})
	})
}