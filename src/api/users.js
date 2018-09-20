import { apiUrls } from './index';

export function logIn(authData){

	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	return fetch(apiUrls.LOG_IN, { method: 'POST', headers: headers}).then(response => {
    if (response.status === 401){
			return {};
		}
		return response.json().then(json => {
			return json;
		});

	}, error => {
		throw new Error(error.message);
	});
}

export function getCalls(authData, isProCalls){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	return fetch(isProCalls ? apiUrls.GET_PRO_CALLS : apiUrls.GET_PERSONAL_CALLS, { method: 'GET', headers: headers}).then(response => {
    if (response.status === 401){
			return {};
		}
		return response.json().then(json => {
			return json;
		});

	}, error => {
		throw new Error(error.message);
	});
}



export function getTransactions(authData, pageNumber){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	return fetch(apiUrls.GET_TRANSACTIONS, { method: 'GET', headers: headers}).then(response => {
    if (response.status === 401){
			return {};
		}
		return response.json().then(json => {
			return json;
		});

	}, error => {
		throw new Error(error.message);
	});
}

export function editDetails(data){

	let headers = new Headers();
	headers.append("Content-Type", "application/json ");
	headers.append("Authorization", "Basic " + data.userAuth);
	return fetch(apiUrls.EDIT_DETAILS + data.id, { method: 'PUT', headers: headers, body: JSON.stringify( data )}).then(response => {
    if (response.status === 401 || response.status === 400 || response.status === 415 || response.status === 500){
			return {};
		}
		return response.json().then(json => {
			return json;
		});

	}, error => {
		throw new Error(error.message);
	});
}



export function verify(token){

	return fetch(apiUrls.VERIFY_USER + '?token=' + token, { method: 'GET' }).then(response => {
    if (response.status === 401 || response.status === 400 || response.status === 415 || response.status === 500){
			return {};
		}
		return response.json().then(json => {
			return {authData: window.btoa(data.email + ':' + data.password)};
		}, error => {
			throw new Error(error.message);
		});

	}, error => {
		throw new Error(error.message);
	});
}



export function register(data){

	let headers = new Headers();
	headers.append("Content-Type", "application/json ");

	return fetch(apiUrls.REGISTER, { method: 'POST', headers: headers, body: JSON.stringify( data )}).then(response => {
		return response.json().then(json => {
			if (json.error) {
				return {
					error: true,
					message: json.message
				}
			} else {
				return {authData: window.btoa(data.email + ':' + data.password)};
			}
			
		}, error => {
			throw new Error(error.message);
		});
	}, error => {
		throw new Error(error.message);
	});
}

export function registerPro(data, authData){

	let headers = new Headers();
	headers.append("Content-Type", "application/json ");
	headers.append("Authorization", "Basic " + authData);

	return fetch(apiUrls.REGISTER_PRO, { method: 'POST', headers: headers, body: JSON.stringify(data)}).then(response => {
		return response.json().then(json => {
			return json.status === 400 ? {
				error: true,
				message: json.message
			} : json;
		})
	})
}


export function resetPassword(data){
	let headers = new Headers();
	headers.append("Content-Type", "application/json ");

	return fetch(apiUrls.RESET_PASSWORD, { method: 'POST',  headers: headers, body: JSON.stringify( data )}).then(response => {
		return response.json().then(json => {
			if (json.error) {
				return {
					error: true,
					message: json.message
				}
			} else {
				return {error: false};
			}
			
		}, error => {
			throw new Error(error.message);
		});

	}, error => {
		throw new Error(error.message);
	});
}

export function uploadPhoto(authData, photo){
	let headers = new Headers();
	headers.append("Content-Type", "multipart/from-data");
	headers.append("Authorization", "Basic " + authData);
	let formData = new FormData();
	formData.append('file', photo);
	console.log(formData.get('file'));
	return fetch(apiUrls.UPLOAD_PHOTO, { credentials: 'include', method: 'POST',  headers: headers, body: formData }).then(response => {
    if (response.status === 401){
			return {};
		} else {
			return {
				success: true
			};
		}

	}, error => {
		throw new Error(error.message);
	});
}


export function sendCode(email, reason){
	let data = {
		email,
		requestReason: reason
	}
	let headers = new Headers();
	headers.append("Content-Type", "application/json ");

	return fetch(apiUrls.SEND_CODE, { method: 'POST', headers: headers, body: JSON.stringify( data )}).then(response => {
    if (response.status === 401){
			return {};
		}
		return response.json().then(json => {
			return json;
		});

	}, error => {
		throw new Error(error.message);
	});
}

export function verifyCode(email, code){
	let data = {
		email,
		code
	}
	let headers = new Headers();
	headers.append("Content-Type", "application/json");

	return fetch(apiUrls.SEND_CODE, { method: 'PUT', headers: headers, body: JSON.stringify( data )}).then(response => {
		return response.json().then(json => {
			return json;
		});

	}, error => {
		throw new Error(error.message);
	});
}

