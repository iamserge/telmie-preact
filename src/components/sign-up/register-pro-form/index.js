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

export default class RegisterProForm extends Component{
    constructor(props){
		super(props);

		const data = localStorage.getItem('register_pro_data');
		this.state = data ? {
            regInfo: JSON.parse(data)
        }
		 : {
			regInfo: {
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
            },
		}

		this.validator = new SimpleReactValidator({
			decimal: {
			  message: 'The :attribute must be decimal.',
			  rule: function(val, options){ 
				// check that it is a valid IP address and is not blacklisted
				console.log(!isNaN(val));
				return !isNaN(val)
			  }
			}
		  });
    }
    
    componentWillUnmount(){
		this.props.userData.pro === null && (
			localStorage.setItem('register_pro_data', JSON.stringify(this.state.regInfo)),
			console.log('noted to localStorage')
		) 
	}
	
	registerHandler = () => {
		if (this.validator.allValid()) {
			let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 

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

				//this.props.registerPro(data, userAuth);
			}
		} else {
			this.validator.showMessages();
			this.forceUpdate();
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

				<button className={"uk-button " + style.applyBtn} onClick={this.registerHandler}>
					Apply as {this.state.regInfo.accountType && this.state.regInfo.accountType.toLowerCase()}
				</button>

			</div>
		)
    }
    
    renderCompanyFields = () => {
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
						onChange = {this.onChangeHandler}/>

				<Input name='compHouseNumber' 
						label='Companies House registration number' 
						value={compHouseNumber} 
						onChange = {this.onChangeHandler}/>

				<Input name='compAddress' 
						label='Company address' 
						value={compAddress} 
						onChange = {this.onChangeHandler}/>

				<div style={{width: '50%', display: 'inline-block'}}>
					<Input name='compCity' 
						label='City' 
						value={compCity} 
						onChange = {this.onChangeHandler}/>
				</div>
				<div style={{display: 'inline-block',width: '47%', marginLeft: '3%'}}>
					<Input name='compPostCode' 
						label='Post Code' 
						value={compPostCode} 
						onChange = {this.onChangeHandler}/>
				</div>

				<Input name='compCountry' 
							label='Country' 
							value={compCountry} 
							onChange = {this.onChangeHandler}/>
			</div>
		)
    }
    
    renderIndividualFields = () => {
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

		const dateOfBirth = year ? `${year}-${month}-${day}` : '';

		return (
			<div class={style.content}>
					{
						this.state.regInfo.accountType !== accountTypeArr[0].value 
							&& this.renderCompanyFields()
					}

						<div class={style.fieldContainer}>
							<label>Personal address</label>
							<div class={style.taElement}>
								<textarea rows="2" 
										name='line1' 
										value={line1} 
										onChange = {this.onChangeHandler}/>
							</div>
							{this.validator.message('line1', line1, 'required', 'validation-tooltip',  {required: 'Please enter personal address.'})}
						</div>

						<div style={{width: '50%', display: 'inline-block',position: 'relative'}}>
							<Input name='city' 
								label='City' 
								value={city} 
								onChange = {this.onChangeHandler}/>
							{this.validator.message('city', city, 'required', 'validation-tooltip',  {required: 'Please enter city.'})}
						</div>
						<div style={{display: 'inline-block',width: '47%', marginLeft: '3%',position: 'relative'}}>
							<Input name='postCode' 
								label='Post Code' 
								value={postCode} 
								onChange = {this.onChangeHandler}/>
							{this.validator.message('postCode', postCode, 'required', 'validation-tooltip',  {required: 'Please enter post code.'})}
						</div>

						<div class={style.validationDiv}>
							<Input name='country' 
									label='Country' 
									value={country} 
									disabled={true}
									onChange = {this.onChangeHandler}/>
							{this.validator.message('country', country, 'required', 'validation-tooltip',  {required: 'Please enter country.'})}
						</div>
						
						<div class = {style.fieldContainer}>
							<label>Date of birth</label>
							<input type="date" 
								name="dob" 
								value={dateOfBirth} 
								onChange={this.onChangeHandler}/>
							{this.validator.message('dob', dateOfBirth, 'required', 'validation-tooltip',  {required: 'Please enter date.'})}
						</div>


						<div class={style.validationDiv}>
							<Input name='profession' 
									label='Service Name' 
									value={profession}
									onChange = {this.onChangeHandler}/>
							{this.validator.message('profession', profession, 'required|max:20', 'validation-tooltip',  {required: 'Please enter profession.', min: 'Must have less than 20 characters.'})}
						</div>
						<div class={style.validationDiv}>
							<Select name='category' 
									label='Service category'
									value={category}
									onChange = {this.onChangeHandler}
									data = {testArr}/>
							{this.validator.message('category', category, 'required', 'validation-tooltip',  {required: 'Please enter service category.'})}
						</div>
						<div class={style.validationDiv}>
							<Select name='subCategory' 
									label='Service sub-category'
									value={subCategory} 
									onChange = {this.onChangeHandler}
									data = {testArr}/>
							{this.validator.message('subCategory', subCategory, 'required', 'validation-tooltip',  {required: 'Please enter service sub-category.'})}
						</div>
						<div class={style.fieldContainer}>
							<label>Service description </label>
							<div class={style.taElement}>
								<textarea rows="2" 
										name='professionDescription' 
										value={professionDescription} 
										onChange = {this.onChangeHandler}/>
							</div>
							{this.validator.message('professionDescription', professionDescription, 'required', 'validation-tooltip',  {required: 'Please enter profession description.'})}
						</div>

						<div style={{display: 'inline-block',width: '20%'}}>
							<Select name='currency' 
									value={currency} 
									disabled={true}
									onChange = {this.onChangeHandler}
									data = {currencyArr}/>
						</div>
						<div style={{display: 'inline-block',width: '47%', marginLeft: '3%', position: 'relative'}}>
							<Input name='costPerMinute' 
								value={costPerMinute}
								placeholder = "Rate"
								onChange = {this.onChangeHandler}/>
							{this.validator.message('costPerMinute', costPerMinute, 'required|decimal', 'validation-tooltip',  {required: 'Please enter cost.', decimal: 'Please enter correct cost.'})}
						</div>
						<div style={{display: 'inline-block',width: '27%', marginLeft: '3%'}}>
							<Select name='time' 
										value={time} 
										disabled={true}
										onChange = {this.onChangeHandler}
										data = {timeArr}/>
						</div>

						{/*<div style={{display: 'inline-block',width: '60%'}}>*/}
						<div class={style.validationDiv}>
							<Input name='mobile' 
								value={mobile}
								label="Mobile"
								onChange = {this.onChangeHandler}/>
							{this.validator.message('mobile', mobile, 'required|phone', 'validation-tooltip',  {required: 'Please enter mobile.', phone: 'Please enter correct mobile.'})}
						</div>
						{/*</div>
						<div style={{display: 'inline-block',width: '30%', marginLeft: '10%'}}>
							<button onClick={this.sendCode}>
								Send code
							</button>
						</div>*/}

						<div class={style.validationDiv}>
							<Input name='video' 
									value={video}
									label="YouTube ID"
									postTab="optional"
									onChange = {this.onChangeHandler}/>
							{this.validator.message('video', video, 'required', 'validation-tooltip',  {required: 'Please enter video.'})}
						</div>
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
        return  (
			<div class = {style.registerPro}>
				<div class={ style.content }>
				<h2>Register as a Pro</h2>
					
				{this.renderGeneralInfo()}

				{this.renderIndividualFields()}

				{this.renderApplyArea()}
				
                
				</div>
			</div>)
    }
}