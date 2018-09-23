import { h, Component } from 'preact';
import style from './style.scss';
import Select from '../../select'
import Input from '../../input'
import Radio from '../../radio'
import  Timer from "react-time-counter";
import SimpleReactValidator from 'simple-react-validator';


import {testArr} from './mock-data'

const accountTypeArr = [{
	name: 'Individual',
	value: 'INDIVIDUAL'
},{
	name: 'Company',
	value: 'COMPANY'
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

const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const getDefaultState = () => {
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
		costPerMinute: '',
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

const getPreparedProState = (userData) => { // in future find field for individual or company toggle
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
			month: `${d.getMonth() + 1}`.padStart(2,0),
			year: `${d.getFullYear()}`.padStart(2,0),
		},
		address,
		mobile,
		...pro,
	}
}

export default class RegisterProForm extends Component{
    constructor(props){
		super(props);

		const data = props.userData.pro === null ? 
			localStorage.getItem('register_pro_data') ?
				JSON.parse(localStorage.getItem('register_pro_data')) 
				: getDefaultState()
			: getPreparedProState(props.userData);

		this.state = {
			regInfo: data,
			isFieldCorrect: {},
		}
		
		this.validator = new SimpleReactValidator({
			decimal: {
			  message: 'The :attribute must be decimal.',
			  rule: val => !isNaN(val),
			}
		  });
    }
    
    componentWillUnmount(){
		this.props.userData.pro === null && 
			localStorage.setItem('register_pro_data', JSON.stringify(this.state.regInfo));
	}

	componentWillReceiveProps(nextProps){
		( nextProps.userData.pro !== null && this.props.userData.pro == null ) 
			&& this.setState({ regInfo: getPreparedProState(nextProps.userData) });
	}

	updateHandler = () => {
		this.registerHandler(true);
	}
	
	registerHandler = (isForUpdate = false) => {
		if (this.validator.allValid()) {
			let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 

			this.setState({
				isFieldCorrect: {}
			})

			if(userAuth) {
				const {dob,costPerMinute} = this.state.regInfo;
				const {day,month,year} = dob;

				const data = {
					...this.state.regInfo,
					dob: {
						day: Number.parseInt(day),
						month: Number.parseInt(month),
						year: Number.parseInt(year),
					},
					costPerMinute: Number.parseFloat(costPerMinute),
				}

				//this.props.registerPro(data, userAuth, isForUpdate);
				alert("OK")
			}
		} else {
			/*this.validator.showMessages();
			this.forceUpdate();*/
			this.setState({
				isFieldCorrect: {
					error: true,
					...this.validator.fields
				}
			})
		}
	}
    
    /*sendCode = () => {
        console.log('sendCode');
        //this.props.sendCode();
    }

    codeOnChange = (e) => {
		let { name, value } = e.target,
			number = name.slice(4,5);

		const nextEl = document.getElementById(`code${parseInt(number) + 1}`);
		(nextEl != null) && nextEl.focus();
		this.setState({[name]:value.slice(0,1)});
	}

	verifyCode = () => {
		let code = `${this.state.code1}${this.state.code2}${this.state.code3}${this.state.code4}`,
			{email} = this.props.userData;
		if (code.length == 4) {
			console.log('verifyCode', email, code);
			//this.props.verifyCode(email, code);
		}
	}*/
	
	dobFormat = (strDate) => {
		const obj = strDate.split("-");
		return {
			year: obj[0],
			month: obj[1],
			day: obj[2],
		}
	}

	addressFormat = (prev, name, value) => {
		return {
			...prev,
			[name]: value,
		}
	}
    
    onChangeHandler = (e) => {
		const {name, value} = e.target;

		let that = this;

		this.setState(prev => {
            return (['country','city','line1','postCode'].indexOf(name) === -1) ? (
				name === 'dob' ? (
					{
						regInfo: {	
							...prev.regInfo,
							[name]: that.dobFormat(value),
						}
					}
				) : (
					{
						regInfo: {	
							...prev.regInfo,
							[name]: value,
						}
					}
				)
			) : (
				{
					regInfo: {	
						...prev.regInfo,
						address: that.addressFormat(prev.regInfo.address, name, value),
					}
				}
			)
		});
    }
    
    renderApplyArea = () => {
		let regControl;

		switch (this.state.regInfo.active) {
			case true:
				regControl = (<button className={"uk-button " + style.applyBtn} onClick={this.updateHandler}>
					Edit pro details
				</button>);
			  	break;
			case false:
				regControl = (<div class={style.approvalWaiting}>Your application is waiting for approval.</div>);
			  break;
			default:
				regControl = (<button className={"uk-button " + style.applyBtn} onClick={this.registerHandler}>
					Apply as {this.state.regInfo.accountType && this.state.regInfo.accountType.toLowerCase()}
				</button>)
		  }
		
		return (
			<div class={ style.applyArea }>
				
				{ /*!this.state.codeVerified && (
					<div class={style.codeMsg}>
						We've sent you a verification code via email. <br/>
						Please enter the code below to continue.
					</div>
				)}
							
				{(!this.state.codeVerified) true ? (
					<div class={style.timer}>
						Code expires in: 
						<Timer minutes={5} backward={true}  />
					</div>					
				): (
					<div className={style.success}>Code verified</div>
				)}

				<div class="code-input-container">
					<div class={style.inputContainer}>
						<input type="text" disabled={this.state.codeVerified} name="code1" value={this.state.code1} onKeyUp={this.codeOnChange} className={ style.verifyInput } id="code1"/>
						<input type="text" /*disabled={this.state.codeVerified} name="code2" value={this.state.code2} onKeyUp={this.codeOnChange} className={ style.verifyInput } id="code2"/>
						<input type="text" /*disabled={this.state.codeVerified} name="code3" value={this.state.code3} onKeyUp={this.codeOnChange} className={ style.verifyInput } id="code3"/>
						<input type="text" /*disabled={this.state.codeVerified} name="code4" value={this.state.code4} onKeyUp={this.codeOnChange} className={ style.verifyInput } id="code4"/>
					</div>
			</div>*/}

				{(this.state.isFieldCorrect.error) && (
					<div className={style.error} style={{padding: 10, fontSize: 20}}>Please fill in all missing fields in the form to proceed.</div>
				)}

				{(this.props.registerFailureMessage.length > 0) && (
					<div className={style.failure}>Error: {this.props.registerFailureMessage}</div>
				)}

				{regControl}

			</div>
		)
    }
    
    renderCompanyFields = (fieldsDisabled) => {
		const {
			businessName,
			compHouseNumber,
			compAddress,
			compCity,
			compPostCode,
			compCountry,
		} = this.state.regInfo;

		// Add validation

		return (
			<div class={style.content}>
				<Input name='businessName' 
						label='Business name' 
						value={businessName} 
						disabled={fieldsDisabled}
						onChange = {this.onChangeHandler}/>

				<Input name='compHouseNumber' 
						label='Companies House registration number' 
						value={compHouseNumber} 
						disabled={fieldsDisabled}
						onChange = {this.onChangeHandler}/>

				<Input name='compAddress' 
						label='Company address' 
						value={compAddress} 
						disabled={fieldsDisabled}
						onChange = {this.onChangeHandler}/>

				<div style={{width: '50%', display: 'inline-block'}}>
					<Input name='compCity' 
						label='City' 
						value={compCity} 
						disabled={fieldsDisabled}
						onChange = {this.onChangeHandler}/>
				</div>
				<div style={{display: 'inline-block',width: '47%', marginLeft: '3%'}}>
					<Input name='compPostCode' 
						label='Post Code' 
						value={compPostCode} 
						disabled={fieldsDisabled}
						onChange = {this.onChangeHandler}/>
				</div>

				<Input name='compCountry' 
							label='Country' 
							value={compCountry} 
							disabled={fieldsDisabled}
							onChange = {this.onChangeHandler}/>
			</div>
		)
    }
    
    renderIndividualFields = (fieldsDisabled) => {
		const {
			address,
			profession,
			category,
			subCategory,
			professionDescription,
			currency,
			costPerMinute,
			time,
			mobile,
			video,
			dob,
		} = this.state.regInfo;

		const {
			country,
			city,
			line1,
			postCode,
		} = address;

		const {
			day,
			month,
			year,
		} = dob;

		const {isFieldCorrect} = this.state;

		const isErrorInField = val =>  val === false;

		const dateOfBirth = year ? `${year}-${month}-${day}` : '';

		return (
			<div class={style.content}>
					{
						this.state.regInfo.accountType !== accountTypeArr[0].value 
							&& this.renderCompanyFields(fieldsDisabled)
					}

						<div class={style.fieldContainer}>
							<label class = {isErrorInField(isFieldCorrect.line1)? style.error : ''}>Personal address</label>
							<div class={style.taElement}>
								<textarea rows="2" 
										name='line1' 
										value={line1} 
										disabled={fieldsDisabled}
										class = {isErrorInField(isFieldCorrect.line1)? style.error : ''}
										onChange = {this.onChangeHandler}/>
							</div>
							{this.validator.message('line1', line1, 'required')}
						</div>

						<div style={{width: '50%', display: 'inline-block',position: 'relative'}}>
							<Input name='city'
								label='City' 
								value={city} 
								disabled={fieldsDisabled}
								error={isErrorInField(isFieldCorrect.city)}
								onChange = {this.onChangeHandler}/>
							{this.validator.message('city', city, 'required')}
						</div>
						<div style={{display: 'inline-block',width: '47%', marginLeft: '3%',position: 'relative'}}>
							<Input name='postCode' 
								label='Post Code' 
								value={postCode} 
								disabled={fieldsDisabled}
								error={isErrorInField(isFieldCorrect.postCode)}
								onChange = {this.onChangeHandler}/>
							{this.validator.message('postCode', postCode, 'required')}
						</div>

							<Input name='country' 
									label='Country' 
									value={country} 
									disabled={true || fieldsDisabled}
									error={isErrorInField(isFieldCorrect.country)}
									onChange = {this.onChangeHandler}/>
							{this.validator.message('country', country, 'required')}
						
						<div class = {style.fieldContainer}>
							<label class = {isErrorInField(isFieldCorrect.dob)? style.error : ''}>Date of birth</label>
							<input type="date" 
								name="dob" 
								value={dateOfBirth} 
								disabled={fieldsDisabled}
								class = {isErrorInField(isFieldCorrect.dob)? style.error : ''}
								onChange={this.onChangeHandler}/>
							{this.validator.message('dob', dateOfBirth, 'required')}
						</div>


							<Input name='profession' 
									label='Service Name' 
									value={profession}
									disabled={fieldsDisabled}
									error={isErrorInField(isFieldCorrect.profession)}
									onChange = {this.onChangeHandler}/>
							{this.validator.message('profession', profession, 'required|max:20')}

							<Select name='category' 
									label='Service category'
									value={category}
									disabled={fieldsDisabled}
									onChange = {this.onChangeHandler}
									error={isErrorInField(isFieldCorrect.category)}
									data = {testArr}/>
							{this.validator.message('category', category, 'required')}

							<Select name='subCategory' 
									label='Service sub-category'
									value={subCategory} 
									disabled={fieldsDisabled}
									onChange = {this.onChangeHandler}
									error={isErrorInField(isFieldCorrect.subCategory)}
									data = {testArr}/>
							{this.validator.message('subCategory', subCategory, 'required')}

						<div class={style.fieldContainer}>
							<label class = {isErrorInField(isFieldCorrect.professionDescription)? style.error : ''}>Service description </label>
							<div class={style.taElement}>
								<textarea rows="2" 
										name='professionDescription' 
										value={professionDescription} 
										disabled={fieldsDisabled}
										class = {isErrorInField(isFieldCorrect.professionDescription)? style.error : ''}
										onChange = {this.onChangeHandler}/>
							</div>
							{this.validator.message('professionDescription', professionDescription, 'required')}
						</div>

						<div style={{display: 'inline-block',width: '20%'}}>
							<Select name='currency' 
									value={currency} 
									disabled={true || fieldsDisabled}
									onChange = {this.onChangeHandler}
									data = {currencyArr}/>
						</div>
						<div style={{display: 'inline-block',width: '47%', marginLeft: '3%', position: 'relative'}}>
							<Input name='costPerMinute' 
								value={costPerMinute}
								placeholder = "Rate"
								disabled={fieldsDisabled}
								error={isErrorInField(isFieldCorrect.costPerMinute)}
								onChange = {this.onChangeHandler}/>
							{this.validator.message('costPerMinute', costPerMinute, 'required|decimal')}
						</div>
						<div style={{display: 'inline-block',width: '27%', marginLeft: '3%'}}>
							<Select name='time' 
										value={time} 
										disabled={true || fieldsDisabled}
										onChange = {this.onChangeHandler}
										data = {timeArr}/>
						</div>

						{/*<div style={{display: 'inline-block',width: '60%'}}>*/}
							<Input name='mobile' 
								value={mobile}
								label="Mobile"
								disabled={fieldsDisabled}
								error={isErrorInField(isFieldCorrect.mobile)}
								onChange = {this.onChangeHandler}/>
							{this.validator.message('mobile', mobile, 'required|phone')}
						{/*</div>
						<div style={{display: 'inline-block',width: '30%', marginLeft: '10%'}}>
							<button onClick={this.sendCode}>
								Send code
							</button>
						</div>*/}

							<Input name='video' 
									value={video}
									label="YouTube ID"
									postTab="optional"
									disabled={fieldsDisabled}
									error={isErrorInField(isFieldCorrect.video)}
									onChange = {this.onChangeHandler}/>
							{this.validator.message('video', video, 'required')}
			</div>
		)
    }
    
    renderGeneralInfo = () => {
        const {name, lastName, email} = this.props.userData;
        
		return (
			<div class = {style.generalInfo}>
				<div>
					<div class = { style.generalField }>Name:</div>
					<div class = { style.generalField }>{ name } { lastName }</div>
				</div>

				<div>
					<div class = { style.generalField }>Email:</div>
					<div class = { style.generalField }>{email}</div>
				</div>

				<Radio name='accountType'
					disabled = {true}
					value={this.state.regInfo.accountType} 
					label='I am:' 
					onChange = {this.onChangeHandler}
					labelClass = {style.radioLabel}
					data = {accountTypeArr}/>
			</div>
		)
    }
    
    render() {

		const fieldsDisabled = this.state.regInfo.active === false;

        return  (
			<div class = {style.registerPro}>
				<div class={ style.content }>
				{
					this.state.regInfo.active === true ?
						(<h2>Edit pro details</h2>) : (<h2>Register as a Pro</h2>)
				}
					
				{this.renderGeneralInfo()}

				{this.renderIndividualFields(fieldsDisabled)}

				{this.renderApplyArea()}
				
                
				</div>
			</div>)
    }
}