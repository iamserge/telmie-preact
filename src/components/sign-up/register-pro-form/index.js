import { h, Component } from 'preact';
import style from './style.scss';
import Timer from "react-time-counter";
import SimpleReactValidator from 'simple-react-validator';
import Modal from '../../modal'
import GeneralInfo from './general-info'
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { getCookie, getIntervalStep } from "../../../utils";
import { getPreparedProState, getDefaultState, accountTypeArr, accountTypes } from "../../../utils/proPending";
import Spinner from '../../global/spinner';

const STORAGE_ITEM_NAME = 'register_pro_data';


export default class RegisterProForm extends Component{
    constructor(props){
		super(props);

		const data = (props.userInfo.gettingError) ? 
			localStorage.getItem(STORAGE_ITEM_NAME) ?
				JSON.parse(localStorage.getItem(STORAGE_ITEM_NAME)) 
				: getDefaultState()
			: getPreparedProState(props.userInfo);

		this.state = {
			regInfo: data,
			isFieldCorrect: true,
			isSaveVisible: false,
			isCancelPendVisible: false,
			isRegCompanyVisible: false,
			step: getIntervalStep(data.costPerMinute),
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
		(this.props.userInfo.pro === null 
			&& window.confirm('Do you want to save your application before you leave?')) 
				&& localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(this.state.regInfo));
	}

	componentDidMount(){
		const that = this;

		window.onbeforeunload = window.onunload = () => {
			if (that.props.userInfo.pro === null) {
				that.setState({isSaveVisible: true});
				return 'You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.';
			}
		};
	}

	componentWillReceiveProps(nextProps){
		
		( !Object.keys(this.props.companyInfo).length && Object.keys(nextProps.companyInfo).length )
			&& this.setState(prev => ({ 
				regInfo: { 
					...prev.regInfo,
					company: {
						...prev.regInfo.company,
						name: nextProps.companyInfo.name,
					}
				},
				isRegCompanyVisible: false,
			})),

		( Object.keys(nextProps.userInfo).length !== 0 && !nextProps.userInfo.error ) 
			&& (
				this.setState({ regInfo: getPreparedProState(nextProps.userInfo) }),
				localStorage.removeItem(STORAGE_ITEM_NAME)
		);
	}

	updateHandler = () => this.registerHandler();
	
	registerHandler = () => {
		if (this.validator.allValid()) {
			let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 

			if(userAuth) {
				const {dob} = this.state.regInfo;

				const data = {
					...this.state.regInfo,
					dob: {
						day: Number.parseInt(dob.day),
						month: Number.parseInt(dob.month),
						year: Number.parseInt(dob.year),
					},
					id: this.props.userData.id,
				}

				this.props.registerPro(data, userAuth);
				this.setState({ isFieldCorrect: true });
			}
		} else {
			this.validator.showMessages();
			this.forceUpdate();
			this.setState({isFieldCorrect: false});
		}
	}
	
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

		(name == `accountType` && value == accountTypes.COMPANY) && this.setState({ isRegCompanyVisible: true });

		this.setState(prev => {
            return (['country','city','line1','postCode'].indexOf(name) === -1) ? (
				['name','taxId'].indexOf(name) !== -1) ? ({
					regInfo: {	
						...prev.regInfo,
						company: {
							...prev.regInfo.company || {},
							[name]: value,
						}
					}
				}) : (
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
				regInfo: { ...prev.regInfo, costPerMinute: Number.parseFloat(rate.toFixed(2))  },
				step: getIntervalStep(Number.parseFloat(rate.toFixed(2)))
			}
		})
	}
    
    renderApplyArea = () => {
		let regControl;

		const {accountType} = this.state.regInfo;

		switch (this.state.regInfo.pending) {
			case false:
				regControl = (
					<button className={`uk-button ${style.applyBtn}`} onClick={this.updateHandler}>
						Submit for review
					</button>);
			  	break;
			case true:
				regControl = [
					<div class={style.approvalWaiting}>Your application is waiting for approval.</div>,
					<button className={`uk-button ${style.applyBtn}`} onClick={this.updateHandler}>
						Submit for review
					</button>,
					<button className={`uk-button ${style.applyBtn}`} onClick={this.onCancelingPending}>
						Cancel changes
					</button>
				];
			  break;
			default:
				regControl = (
					<button className={`uk-button ${style.applyBtn}`} onClick={this.registerHandler}>
						Apply as {accountType && accountType.toLowerCase()}
					</button>)
		  }
		
		return (
			<div class={ style.applyArea }>

				{(!this.state.isFieldCorrect) && (
					<div className={style.error} style={{padding: 10, fontSize: 20}}>Please fill in all missing fields in the form to proceed.</div>
				)}

				{(this.props.failureMessage.length > 0) && (
					<div className={style.error}>Error: {this.props.failureMessage}</div>
				)}

				{regControl}

			</div>
		)
    }
    
    renderCompanyFields = (fieldsDisabled, isShow) => {
		const { company = {}, } = this.state.regInfo;
		
		return <div style = {isShow && {display: 'none'}}>
				<div className="input-container">
					<label for="name">Business name</label>
					<input type="text" name="name" value={company.name} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>
				</div>
				<div className="input-container">
					<label for="taxId">Companies House registration number</label>
					<input type="text" name="taxId" value={company.taxId} disabled={fieldsDisabled} onChange={this.onChangeHandler} className="uk-input"/>

					{this.validator.message('taxId', company.taxId, 'compRequired', 'validation-tooltip',  {required: 'Please enter registration number'})}
				</div>
				{/*<div className="input-container">
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
				</div>*/}
			</div>
    }
    
    renderIndividualFields = (fieldsDisabled) => {
		const {
			address = {},
			profession,
			category,
			subCategory,
			professionDescription,
			currency,
			costPerMinute = '',
			time,
			mobile,
			video,
			dob = {},
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

		let maxRate = (this.props.regData && this.props.regData.max_rate) ? this.props.regData.max_rate : 10;

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
							step={this.state.step}
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
			</div>
		)
    }

	closeSaveModal = () => {
		this.setState({isSaveVisible: false})
	}
	saveData = () => {
		this.props.userInfo.pro === null 
			&& localStorage.setItem('register_pro_data', JSON.stringify(this.state.regInfo));
		this.closeSaveModal();
	}

	onCancelingPending = () => this.setState({ isCancelPendVisible: true });
	cancelCancelingPending = () => this.setState({ isCancelPendVisible: false });
	cancelHandler = () => {
		let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 
		this.props.cancelProPending(this.props.userData.id, userAuth);
		this.setState({ isCancelPendVisible: false });
	}


	cancelChackingTaxId = () => {
		this.setState(prev => ({ 
			isRegCompanyVisible: false,
			regInfo: {	
				...prev.regInfo,
				accountType: accountTypes.INDIVIDUAL,
				company: {},
			},
		}));
		this.props.cancelChackingTax();
	}
	checkTaxId = () => {
		let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 
		const { company = {} } = this.state.regInfo;
		this.props.checkCompanyTaxId(company.taxId, userAuth);
	}
    
    render() {
		const fieldsDisabled = this.state.regInfo.active === false;
		const { company = {} } = this.state.regInfo;
		const { userInfo={}, userData, failureMessage } = this.props;

        return  (
			<div class = {`uk-container-small ${style.registerPro}`}>
				{ this.props.isLoaded ? (
					<div class={ style.content }>
						{ fieldsDisabled ? (<h2>Register as a Pro</h2>) : (<h2>Edit Pro details</h2>) }
							
						<GeneralInfo accountType={this.state.regInfo.accountType}
							onChangeHandler={this.onChangeHandler}
							isPending={userInfo.pending}
							userData={userData}/>

						{this.renderIndividualFields(fieldsDisabled)}

						{this.renderApplyArea()}
					</div>
				) : (
					<Spinner/>
				)}

				<Modal isVisible = {this.state.isCancelPendVisible}
					title='Do you want to cancel your application?'
					okText="Yes."
					cancelText = "No."
					onOk = {this.cancelHandler}
					onCancel={this.cancelCancelingPending}/>

				<Modal isVisible = {this.state.isSaveVisible}
					title='Do you want to save your application before you leave?'
					okText="Yes, save."
					cancelText = "Don’t save my details."
					onOk = {this.saveData}
					onCancel={this.closeSaveModal}/>
				
				<Modal isVisible = {(this.state.isRegCompanyVisible && this.state.regInfo.accountType === accountTypes.COMPANY)}
					title='Enter tax ID to check'
					okText="Check."
					cancelText = "Cancel."
					onOk = {this.checkTaxId}
					onCancel={this.cancelChackingTaxId}>
					<input type="text" name="taxId" value={company.taxId} onChange={this.onChangeHandler} className="uk-input"/>
					{(failureMessage.length > 0) && (
						<div className={style.error} style={{ margin: 0, marginTop: 10 }}>{failureMessage}</div>
					)}
				</Modal>
			</div>)
    }
}