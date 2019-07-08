export const accountTypes = {
	INDIVIDUAL: 'INDIVIDUAL',
	COMPANY: 'COMPANY',
}

export const accountTypeArr = [{
	name: 'Individual',
	value: accountTypes.INDIVIDUAL,
},{
	name: 'Company',
	value: accountTypes.COMPANY,
}];

const currencyArr = [
	{
		name: '£',
		value: '£'
	}
];

const timeArr = [{
	name: 'min',
	value: 'min',
}];

// in future ebit getDefaultState() & getPreparedProState() fields for individual or company validations

export const getDefaultState = () => {
	return {
		accountType: accountTypeArr[0].value,
		address: {
			country: "GB",
			city: '',
			line1: '',
			postCode: '',
		},
		dob: {
			day: '',
			month: '',
			year: '',
		},
		profession: '',
		professionDescription: '',
		category: '',
		subCategory: '',
		costPerMinute: 0,
		mobile: '',
		video: '',
		time: timeArr[0].value,
		currency: currencyArr[0].value,
						
		businessName: '',
		compHouseNumber: '',
		compAddress: '',
		compCity: '',
		compPostCode: '',
		compCountry: '',
	}
}

export const getPreparedProState = (userData) => { 
	const { dob={}, address={} } = userData;
	
	return {
		...userData,
		address: {
			country: "GB",
			...address,
		},
		accountType: userData.accountType || accountTypeArr[0].value,
		time: timeArr[0].value,
		currency: currencyArr[0].value,
		dob: {
			day: `${dob.day}`.padStart(2,0),
			month: `${dob.month}`.padStart(2,0),
			year: `${dob.year}`.padStart(2,0),
		},
	}
}

export const convertProState = (userData) => { 
	const {dateOfBirth,location, pro, mobile} = userData;

	const d = new Date(dateOfBirth);
	
	const address = location ? 
		JSON.parse(location) : {
			country: "GB",
			city: '',
			line1: '',
			postCode: '',
		};

	return {
		accountType: accountTypeArr[0].value,
		time: timeArr[0].value,
		currency: currencyArr[0].value,
		dob: {
			day: `${d.getDate()}`.padStart(2,0),
			month: `${parseInt(d.getMonth()) + 1}`.padStart(2,0),
			year: `${d.getFullYear()}`.padStart(2,0),
		},
		address,
		mobile,
		...pro,
	}
}