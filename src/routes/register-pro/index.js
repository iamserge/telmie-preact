import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import SignUpForm from '../../components/sign-up/sign-up-form';
import style from './style.scss';
import { register, fetchRegistration } from '../../actions/user';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import { route } from 'preact-router';
import Redirect from '../../components/global/redirect';
import Select from '../../components/select'
import Input from '../../components/input'
import Radio from '../../components/radio'


const testArr = [
	{
		name: 'Test 1',
		value: 'test1'
	},{
		name: 'Test 2',
		value: 'test2'
	}
],
iamArr = [
	{
		name: 'Individual',
		value: 'individual'
	},{
		name: 'Company',
		value: 'company'
	}
],
minmaxArr = [
	{
		name: 'min',
		value: 'min'
	},{
		name: 'max',
		value: 'max'
	}
],
monetaryUnitArr = [
	{
		name: 'Unit 1',
		value: 'unit1'
	},{
		name: 'Unit 2',
		value: 'unit2'
	}
]


class RegisterPro extends Component {
	constructor(props){
		super(props);
		this.state = {
			//regData: null,
			iam: iamArr[0].value,
			serviceCategory: '',
			city: '',
			postCode: '',
			country: '',
			dateOfBirth: '',
			serviceName: '',
			serviceSubCategory: '',
			monetaryUnit: monetaryUnitArr[0].value,
			rate: '',
			minMax: minmaxArr[0].value,
			mobile: '',
			address: '',
			serviceDescr: '',

			businessName: '',
			compHouseNumber: '',
			compAddress: '',
			compCity: '',
			compPostCode: '',
			compCountry: '',
		}
	}
	/*componentDidMount(){
		this.fetchPage(this.props);
	}
	fetchPage(props) {
    if (props.prismicCtx) {
      // We are using the function to get a document by its uid
      return props.prismicCtx.api.getByID(props.uid).then((doc, err) => {
        if (doc) {
          // We put the retrieved content in the state as a doc variable
          this.setState({ regData: doc.data });
        } else {
          // We changed the state to display error not found if no matched doc
          this.setState({ notFound: !doc });
        }
      });
			
			/*return props.prismicCtx.api.query('').then(function(response) {
			   console.log(response);
			});*/
		/*}
    return null;
  }
	componentWillReceiveProps(nextProps){
		this.fetchPage(nextProps);
	}*/
	onChangeHandler = (e) => {
		const {name, value} = e.target;
		this.setState({[name]: value});
	}

	renderCompanyFields = () => {
		const {
			businessName,
			compHouseNumber,
			compAddress,
			compCity,
			compPostCode,
			compCountry,
		} = this.state;

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
			city,
			postCode,
			country,
			serviceName,
			serviceCategory,
			serviceSubCategory,
			serviceDescr,
			monetaryUnit,
			rate,
			minMax,
			mobile,
			youtubeId
		} = this.state;

		return (
			<div class={style.content}>
					{
						this.state.iam === 'company' && this.renderCompanyFields()
					}

						<div class={style.fieldContainer}>
							<label>Personal address</label>
							<div class={style.taElement}>
								<textarea rows="2" 
										name='address' 
										value={address} 
										onChange = {this.onChangeHandler}/>
							</div>
						</div>

						<div style={{width: '50%', display: 'inline-block'}}>
							<Input name='city' 
								label='City' 
								value={city} 
								onChange = {this.onChangeHandler}/>
						</div>
						<div style={{display: 'inline-block',width: '47%', marginLeft: '3%'}}>
							<Input name='postCode' 
								label='Post Code' 
								value={postCode} 
								onChange = {this.onChangeHandler}/>
						</div>

						<Input name='country' 
								label='Country' 
								value={country} 
								onChange = {this.onChangeHandler}/>
						
						<div class = {style.fieldContainer}>
							<label>Date of birth</label>
							<input type="date" 
								name="dateOfBirth" 
								value={this.state.dateOfBirth} 
								onChange={this.onChange}/>
						</div>

						<Input name='serviceName' 
								label='Service Name' 
								value={serviceName} 
								onChange = {this.onChangeHandler}/>

						<Select name='serviceCategory' 
								label='Service category'
								value={serviceCategory} 
								onChange = {this.onChangeHandler}
								data = {testArr}/>

						<Select name='serviceSubCategory' 
								label='Service sub-category'
								value={serviceSubCategory} 
								onChange = {this.onChangeHandler}
								data = {testArr}/>

						<div class={style.fieldContainer}>
							<label>Service description </label>
							<div class={style.taElement}>
								<textarea rows="2" 
										name='serviceDescr' 
										value={serviceDescr} 
										onChange = {this.onChangeHandler}/>
							</div>
						</div>

						<div style={{display: 'inline-block',width: '20%'}}>
							<Select name='monetaryUnit' 
									value={monetaryUnit} 
									onChange = {this.onChangeHandler}
									data = {monetaryUnitArr}/>
						</div>
						<div style={{display: 'inline-block',width: '47%', marginLeft: '3%'}}>
							<Input name='rate' 
								value={rate}
								placeholder = "Rate"
								onChange = {this.onChangeHandler}/>
						</div>
						<div style={{display: 'inline-block',width: '27%', marginLeft: '3%'}}>
							<Select name='minMax' 
										value={minMax} 
										onChange = {this.onChangeHandler}
										data = {minmaxArr}/>
						</div>

						<div style={{display: 'inline-block',width: '60%'}}>
							<Input name='mobile' 
								value={mobile}
								label="Mobile"
								onChange = {this.onChangeHandler}/>
						</div>
						<div style={{display: 'inline-block',width: '30%', marginLeft: '10%'}}>
							<button >
											Send code
							</button>
						</div>

						<Input name='youtubeId' 
								value={youtubeId}
								label="YouTube ID"
								postTab="optional"
								onChange = {this.onChangeHandler}/>
								
			</div>
		)
	}

	render(props, state) {
		const {name, lastName, email} = props.userData;
		return  (
			<div class = {style.registerPro}>
				<div class={ style.content }>
				<h2>Register as a Pro</h2>
					
					<div class = {style.generalInfo}>
						<div>
							<div class = { style.generalField }>Name:</div>
							<div class = { style.generalField }>{ name } { lastName }</div>
						</div>

						<div>
							<div class = { style.generalField }>Email:</div>
							<div class = { style.generalField }>{email}</div>
						</div>

						<Radio name='iam'
							value={state.iam} 
							label='I am:' 
							onChange = {this.onChangeHandler}
							labelClass = {style.radioLabel}
							data = {iamArr}/>
					</div>

						{this.renderIndividualFields()}

				</div>
			</div>)

		/*if (!this.state.loggedIn) {
			return (
				<div className="uk-container uk-container-small" id="signUp" >
					<div>
							{!this.props.registerSuccess ? (
								<h1>Sign up</h1>
							) : (
								<h1>Success!</h1>
							) }
							<SignUpForm  fetchRegistration = { this.props.fetchRegistration } register = { this.props.register } registerSuccess = { this.props.registerSuccess } registerFailure = { this.props.registerFailure } regData = { this.state.regData }/>
						</div>
				</div>
			);
		} else {
			return (<Redirect to='/profile' />)
		}*/

	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	//registerSuccess: state.loggedInUser,
	//registerFailure: state.registerFailure
});

const mapDispatchToProps = dispatch => bindActionCreators({
	//register,
	//fetchRegistration
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterPro);
