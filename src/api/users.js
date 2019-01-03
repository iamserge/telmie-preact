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

export function getCalls(authData, num, isProCalls){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	const additionalQuery = num ? `&size=${num}` : '';
	return fetch(
		(isProCalls ? apiUrls.GET_PRO_CALLS : apiUrls.GET_PERSONAL_CALLS) + additionalQuery,
		{ method: 'GET', headers}
	).then(response => {
		if (response.status === 401){
			return {};
		}
		return response.json().then(json =>  json);

	}, error => {
		throw new Error(error.message);
	});
}



export function getTransactions(authData, num){
	let headers = new Headers();
	headers.append("Content-Type", "application/json ");
	headers.append("Authorization", "Basic " + authData);

	const additionalQuery = num ? `?size=${num}` : '';
	return fetch(apiUrls.GET_TRANSACTIONS + additionalQuery, { method: 'POST', headers}).then(response => {
    if (response.status === 401){
			return {};
		}
		return response.json()
			.then(json => json)
			.catch(err => {
				console.log(err);
				return {error: true}
			});

	}, error => {
		throw new Error(error.message);
	});
}

export function editDetails(data, userAuth){

	let headers = new Headers();
	headers.append("Content-Type", "application/json ");
	headers.append("Authorization", "Basic " + userAuth);
	return fetch(apiUrls.EDIT_DETAILS + data.id, { method: 'PUT', headers, body: JSON.stringify( data )}).then(response => {
    if (response.status === 401 || response.status === 400 || response.status === 415 || response.status === 500){
			return { error: true };
		}
		return response.json()
			.then(json => json)
			.catch(err => {
				console.log(err);
				return { error: true };
			});

	}, error => {
		throw new Error(error.message);
	});
}

export function switchEmailNotif(isOn, userAuth){
	let headers = new Headers();
	headers.append("Authorization", "Basic " + userAuth);
	return fetch(apiUrls.EMAIL_NOTIFICATIONS, { method: isOn ? 'POST' : 'DELETE', headers, }).then(response => {
		return response.status !== 200 ?
			{ error: true } 
			: response.json().then(json => json)
				.catch(err => {
					console.log(err);
					return { error: true };
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

	return fetch(apiUrls.REGISTER_PRO, { method: 'POST', headers, body: JSON.stringify(data)}).then(response => {
		return response.json().then(json => {
			return json.status === 400 ? {
				error: true,
				message: json.message
			} : json;
		})
		.catch(err => {
			return response.status === 400 ? (
				{ 
					error: true,
					message: 'User already registered as pro'
				}
			) : (
				response.status === 401 && 
					{
						error: true, 
						message: 'Full authentication is required to access this resource'
					} 
			)
		})
		
		
	})
}

export function updatePro(data, authData){

	let headers = new Headers();
	headers.append("Content-Type", "application/json ");
	headers.append("Authorization", "Basic " + authData);

	return fetch(apiUrls.REGISTER_PRO, { method: 'PUT', headers, body: JSON.stringify(data)}).then(response => {
		return response.json().then(json => {
			return json.status === 400 ? {
				error: true,
				message: json.message
			} : json;
		})
		.catch(err => {
			return response.status === 403 ? (
				{ 
					error: true,
					message: 'User is not registered as pro'
				}
			) : (
				response.status === 401 && 
					{
						error: true, 
						message: 'Full authentication is required to access this resource'
					} 
			)
		})
		
		
	})
}

export function getCategories(authData) {
	let headers = new Headers();
	headers.append("Authorization", "Basic " + authData);

	return fetch(apiUrls.GET_CATEGORIES, {method: 'GET', headers}).then(response => {
		return response.json().then(json => {
			return json;
		})
		.catch(err => {
			console.log(err);
			return { error: true }
		})
	});
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

export function sendContactData(data){
	let headers = new Headers();
	headers.append("Content-Type", "application/json ");

	return fetch(apiUrls.SEND_CONTACT_DATA, { method: 'PUT', headers, body: JSON.stringify(data)}).then(response => {
		return response.status !== 200 ? {
			error: true,
			message: "Fields can't be empty or Invalid email",
		} : {};
	})
	.catch(err => ({
			error: true,
			message: `Error! ${err.message && err.message}`,
	}))
}