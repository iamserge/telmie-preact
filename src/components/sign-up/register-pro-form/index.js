import { h, Component } from 'preact';
import style from './style.scss';
import Radio from '../../radio'
import Timer from "react-time-counter";
import SimpleReactValidator from 'simple-react-validator';
import Modal from '../../modal'
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

const STORAGE_ITEM_NAME = 'register_pro_data';

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

// in future ebit getDefaultState() & getPreparedProState() fields for individual or company validations

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

const getPreparedProState = (userData) => { 
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
			localStorage.getItem(STORAGE_ITEM_NAME) ?
				JSON.parse(localStorage.getItem(STORAGE_ITEM_NAME)) 
				: getDefaultState()
			: getPreparedProState(props.userData);

		this.state = {
			regInfo: data,
			isFieldCorrect: true,
			isSaveVisible: false,
			isInfoRegisterVisible: false,
		}

		let that = this;
		
		this.validator = new SimpleReactValidator({
			compRequired: { 
				message: 'Please enter :attribute',
				rule: val => that.state.regInfo.accountType === accountTypeArr[0].value ? true : val != '',
			},
		});
    }
    
    componentWillUnmount(){
		(this.props.userData.pro === null 
			&& window.confirm('Do you want to save your application before you leave?')) 
				&& localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(this.state.regInfo));
	}

	componentDidMount(){
		const that = this;

		window.onbeforeunload = window.onunload = () => {
			if (that.props.userData.pro === null) {
				that.setState({isSaveVisible: true});
				return 'You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.';
			}
		};
	}

	componentWillReceiveProps(nextProps){
		( nextProps.userData.pro !== null && this.props.userData.pro == null ) 
			&& (
				this.setState({ regInfo: getPreparedProState(nextProps.userData) }),
				localStorage.removeItem(STORAGE_ITEM_NAME)
		);
	}

	updateHandler = () => {
		this.registerHandler(true);
	}
	
	registerHandler = (isForUpdate = false) => {
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
				}

				this.props.registerPro(data, userAuth, isForUpdate);
				this.setState({isInfoRegisterVisible: true, isFieldCorrect: true});
			}
		} else {
			this.validator.showMessages();
			this.forceUpdate();
			this.setState({isFieldCorrect: false});
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
				name === 'dob' ? ({
					regInfo: {	
						...prev.regInfo,
						[name]: that.dobFormat(value),
					}
				}) : ({
					regInfo: {	
						...prev.regInfo,
						[name]: value,
					}
				})
			) : ({
				regInfo: {	
					...prev.regInfo,
					address: that.addressFormat(prev.regInfo.address, name, value),
				}
			})
		});
	}
	
	onSelectCategory = (category) => {
		this.setState(prev => {
			return ({
				regInfo: {	
					...prev.regInfo,
					category,
					subCategory: '',
				}
			})
		})
	}

	onSliderChange = (rate, disabled = false) => {
		!disabled && this.setState(prev => {
			return {
				regInfo: { ...prev.regInfo, costPerMinute: Number.parseFloat(rate.toFixed(2))  }
			}
		})
	}
    
    renderApplyArea = () => {
		let regControl;

		const {accountType} = this.state.regInfo;

		switch (this.state.regInfo.active) {
			case true:
				regControl = accountType == accountTypeArr[0].value && 
					(<button className={`uk-button ${style.applyBtn}`} onClick={this.updateHandler}>
						Edit pro details
					</button>);
			  	break;
			case false:
				regControl = (<div class={style.approvalWaiting}>Your application is waiting for approval.</div>);
			  break;
			default:
				regControl = accountType == accountTypeArr[0].value && 
					(<button className={`uk-button ${style.applyBtn}`} onClick={this.registerHandler}>
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

				{(!this.state.isFieldCorrect) && (
					<div className={style.error} style={{padding: 10, fontSize: 20}}>Please fill in all missing fields in the form to proceed.</div>
				)}

				{(this.props.registerFailureMessage.length > 0) && (
					<div className={style.error}>Error: {this.props.registerFailureMessage}</div>
				)}

				{regControl}

			</div>
		)
    }
    
    renderCompanyFields = (fieldsDisabled, isShow) => {
		const {
			businessName,
			compHouseNumber,
			compAddress,
			compCity,
			compPostCode,
			compCountry,
		} = this.state.regInfo;

		return <div style = {isShow && {display: 'none'}}>
				<div className="input-container">
					<label for="businessName">Business name</label>
					<input type="text" name="businessName" value={businessName} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('businessName', businessName, 'compRequired', 'validation-tooltip',  {required: 'Please enter name'})}
				</div>
				<div className="input-container">
					<label for="compHouseNumber">Companies House registration number</label>
					<input type="text" name="compHouseNumber" value={compHouseNumber} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('compHouseNumber', compHouseNumber, 'compRequired', 'validation-tooltip',  {required: 'Please enter registration number'})}
				</div>
				<div className="input-container">
					<label for="compAddress">Company address</label>
					<input type="text" name="compAddress" value={compAddress} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('compAddress', compAddress, 'compRequired', 'validation-tooltip',  {required: 'Please enter address'})}
				</div>
				<div className="double-input-container">
					<div className="input-container">
						<label for="compCity">City</label>
						<input type="text" name="compCity" value={compCity} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

						{this.validator.message('compCity', compCity, 'compRequired', 'validation-tooltip', {required: 'Please enter city'})}
					</div>
					<div className="input-container">
						<label for="compPostCode">Post Code</label>
						<input type="text" name="compPostCode" value={compPostCode} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input" />

						{this.validator.message('compPostCode', compPostCode, 'compRequired', 'validation-tooltip right', {required: 'Please enter post code'})}
					</div>
				</div>
				<div className="input-container">
					<label for="compCountry">Country</label>
					<input type="text" name="compCountry" value={compCountry} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('compCountry', compCountry, 'compRequired', 'validation-tooltip',  {required: 'Please enter country'})}
				</div>
			</div>
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

		const { categories = [], subCategories = [] } = this.props.dataFromServer;

		let maxRate = (this.props.regData && this.props.regData.max_rate)  ? this.props.regData.max_rate : 10,
			step = (this.props.regData && this.props.regData.rate_slider_step)  ? this.props.regData.rate_slider_step : 0.1;

		const dateOfBirth = year ? `${year}-${month}-${day}` : '';

		return (
			<div class={style.content}>
				{
					this.renderCompanyFields(fieldsDisabled, this.state.regInfo.accountType === accountTypeArr[0].value)
				}

				<div className="input-container">
					<label for="line1">Personal address</label>
					<textarea name="line1" value={line1} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-textarea"/>

					{this.validator.message('line1', line1, 'required', 'validation-tooltip',  {required: 'Please enter address'})}
				</div>

				<div className="double-input-container">
					<div className="input-container">
						<label for="city">City</label>
						<input type="text" name="city" value={city} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

						{this.validator.message('city', city, 'required', 'validation-tooltip', {required: 'Please enter city'})}
					</div>
					<div className="input-container">
						<label for="postCode">Post Code</label>
						<input type="text" name="postCode" value={postCode} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input" />

						{this.validator.message('postCode', postCode, 'required', 'validation-tooltip right', {required: 'Please enter post code'})}
					</div>
				</div>

				<div className="input-container">
					<label for="country">Country</label>
					<input type="text" name="country" value={country} disabled={true || fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('country', country, 'required', 'validation-tooltip',  {required: 'Please enter country'})}
				</div>
						
				<div className="input-container">
					<label for="dob">Date of birth</label>
					<input type="date" name="dob" value={dateOfBirth} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('dob', dateOfBirth, 'required', 'validation-tooltip',  {required: 'Please enter date of birth'})}
				</div>

				<div className="input-container">
					<label for="profession">Service Name</label>
					<input type="text" name="profession" value={profession} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('profession', profession, 'required|max:20', 'validation-tooltip',  {required: 'Please enter country', max: 'Service name may not be greater than 20 characters'})}
				</div>

				<div class={style.services}>
					<label>Service category</label>
					<div class = {((fieldsDisabled)) ? style.disabled : style.enabled}>
						{ categories.map((_category,index) => (
							<div onClick={()=>!(fieldsDisabled) && this.onSelectCategory(_category)} 
								className={(category == _category) ? style.selected : ''} > {_category}</div>
						))}
					</div>

					{this.validator.message('category', category, 'required', 'validation-tooltip',  {required: 'Please select category'})}
				</div>

				{<div className={`input-container ${style.selectContainer}`}>
						<label for="subCategory">Service sub-category</label>
						<select className="uk-select" name="subCategory" value={subCategory} disabled={fieldsDisabled} onChange={this.onChangeHandler}>
							<option value="">Please select category</option>
							{ subCategories[category] && subCategories[category].map(_category => (
								<option value={_category}>{_category}</option>))}
						</select>

						{this.validator.message('subCategory', subCategory, 'required', 'validation-tooltip',  {required: 'Please select sub-category'})}
					</div>}

				<div className="input-container">
					<label for="professionDescription">Service description</label>
					<textarea name="professionDescription" value={professionDescription} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-textarea"/>

					{this.validator.message('professionDescription', professionDescription, 'required', 'validation-tooltip',  {required: 'Please enter service description'})}
				</div>			
					
				<div class={`input-container ${(fieldsDisabled) && style.disabledSlider}`}>
					<label for="costPerMinute">Rate</label>
					<Slider min={0}
							max={maxRate}
							step={step}
							value={costPerMinute}
							onChange={(rate) => this.onSliderChange(rate, fieldsDisabled)}/>
					{costPerMinute == 0.00 ? (
						<div className={style.rate}>
							<span className={style.free}>Free</span>
						</div> 
					) : (
						<div className={style.rate}>
							<span>£{costPerMinute.toFixed(2)} </span>
								per minute
						</div>
					)}
				</div>

				<div className="input-container">
					<label for="mobile">Mobile</label>
					<input type="text" name="mobile" value={mobile} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('mobile', mobile, 'required|phone', 'validation-tooltip',  {required: 'Please enter mobile', phone: 'Please enter a valid phone number'})}
				</div>

				<div className="input-container">
					<label for="video">YouTube ID</label>
					<input type="text" name="video" value={video} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('video', video, 'required', 'validation-tooltip',  {required: 'Please enter YouTube ID'})}
				</div>

						{/*<div style={{display: 'inline-block',width: '30%', marginLeft: '10%'}}>
							<button onClick={this.sendCode}>
								Send code
							</button>
						</div>*/}
			</div>
		)
    }
    
    renderGeneralInfo = () => {
        const {name, lastName, email} = this.props.userData;
        
		return (
			<div class = {style.generalInfo}>
				<div>
					<div class = { style.key }>Name:</div>
					<div class = { style.value }>{ name } { lastName }</div>
				</div>

				<div>
					<div class = { style.key }>Email:</div>
					<div class = { style.value }>{email}</div>
				</div>

				<Radio name='accountType'
					value={this.state.regInfo.accountType} 
					label='I am:' 
					onChange = {this.onChangeHandler}
					data = {accountTypeArr}/>
			</div>
		)
	}
	
	closeInfoRegisterModal = () => {
		this.setState({isInfoRegisterVisible: false})
	}

	closeSaveModal = () => {
		this.setState({isSaveVisible: false})
	}
	saveData = () => {
		this.props.userData.pro === null 
			&& localStorage.setItem('register_pro_data', JSON.stringify(this.state.regInfo));
		this.closeSaveModal();
	}
    
    render() {
		const fieldsDisabled = this.state.regInfo.active === false;

        return  (
			<div class = {`uk-container-small ${style.registerPro}`}>
				<div class={ style.content }>
					{ fieldsDisabled ? (<h2>Register as a Pro</h2>) : (<h2>Edit pro details</h2>) }
						
					{this.renderGeneralInfo()}

					{this.renderIndividualFields(fieldsDisabled)}

					{this.renderApplyArea()}
				</div>

				<Modal isVisible = {this.state.isInfoRegisterVisible}
					title='Your changes will be sent for review'
					okText="OK"
					onOk = {this.closeInfoRegisterModal}
					onCancel={this.closeInfoRegisterModal}>
					Please note that every new profile change has to go trough verification process
				</Modal>

				<Modal isVisible = {this.state.isSaveVisible}
					title='Do you want to save your application before you leave?'
					okText="Yes, save."
					cancelText = "Don’t save my details."
					onOk = {this.saveData}
					onCancel={this.closeSaveModal}/>
			</div>)
    }
}