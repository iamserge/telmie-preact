import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Switch from 'react-toggle-switch'
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import SimpleReactValidator from 'simple-react-validator';
import { generateProfessionsArray } from '../../../utils';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
let Services = [
	{
		name: "Education",
		categories: ["Language tutor", "Language practice", "Exams preparation", "Science", "Business studies", "Social science", "Drawing", "Music", "Dance"]
	},
	{
		name: "Services",
		categories: ["Interpreter", "Negotiator/mediator", "Therapist", "Listener", "Speech therapist", "Fortun teller", "Astrologist", "Personal assistant", "Career coach"]
	},
	{
		name: "Consultancy",
		categories: ["Legal", "Medical", "Business", "Family", "Investment", "Tech support", "Beautician"]
	},
	{
		name: "Health&Lifestyle",
		categories: ["Personal trainer", "Yuga instructor", "Meditation instructor", "Dietologist", "Sport coach", "Fitness professional", "Spiritual coach"]
	},
]
export default class SignUpForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			profession: '',
			professionDescription: '',
			sectorCategory: '',
			sector: '',
			rate: '0.00',
			sectorCategories: [],
			pro: false,
			loading: false,
			visiblePassword: false
		}
		this.onChange = this.onChange.bind(this);
		this.onSelectSector = this.onSelectSector.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.onSliderChange = this.onSliderChange.bind(this);
		this.signUp = this.signUp.bind(this);
		this.validator = new SimpleReactValidator();
	}

	signUp(){
		if( this.validator.allValid() ){
			let registerData = {
				name: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				password: this.state.password
			}
			if (this.state.pro) {
				registerData.pro = {
					category: this.state.sector,
					costPerMinute: this.state.rate,
					profession: this.state.profession,
					professionDescription: this.state.professionDescription,
					subCategory: this.state.sectorCategory
				}
			}
			this.props.register(registerData);
			if (this.props.registerFailure) {
				this.props.fetchRegistration();
			}
			this.setState({loading: true})
		} else {
			this.validator.showMessages();
			this.forceUpdate();

		}
	}
	componentDidMount(){
		if (document.getElementById('firstName') != null) document.getElementById('firstName').focus();
	}
	componentWillReceiveProps(nextProps){
		this.setState({loading: false});

	}
	onSelectSector(count){
		this.setState({
			sector: Services[count].name,
			sectorCategories: Services[count].categories,
			sectorCategory: ''
		})

	}
	onSliderChange(rate) {
    this.setState({ rate: rate.toFixed(2)  })
  }
	handleSelectChange(e){
		this.setState({sectorCategory: event.target.value});
	}
	onChange(e){
		let name = e.target.name,
				value = e.target.value,
				newState = {};
		newState[name] = value;
		this.setState(newState)
	}

	render({}) {

		let maxRate = (this.props.regData && this.props.regData.max_rate)  ? this.props.regData.max_rate : 10,
				step = (this.props.regData && this.props.regData.rate_slider_step)  ? this.props.regData.rate_slider_step : 0.1;

		if (this.props.regData && this.props.regData.registration_profession_options) Services = generateProfessionsArray(this.props.regData.registration_profession_options);

		if (!this.state.loading) {
			if (!this.props.registerSuccess) {
				return (
					<div className={style.signUpForm}>
					  { this.props.registerFailure && (
							<div className={style.failure}>Sorry, account with this email address already exists</div>
						)}
						<div className="double-input-container">
							<div className="input-container">
								<label for="firstName">First name</label>
								<input type="text" name="firstName" value={this.state.firstName} onChange={this.onChange} className="uk-input" id="firstName"/>

								{this.validator.message('firstName', this.state.firstName, 'required', 'validation-tooltip', {required: 'Please enter first name'})}
							</div>
							<div className="input-container">
								<label for="password">Last name</label>
								<input type="text" name="lastName" value={this.state.lastName} onChange={this.onChange} className="uk-input"	id="lastName" />

								{this.validator.message('lastName', this.state.lastName, 'required', 'validation-tooltip right', {required: 'Please enter last name'})}
							</div>
						</div>

						<div className="input-container">
							<label for="email">Email</label>
							<input type="text" name="email" value={this.state.email} onChange={this.onChange} className="uk-input" id="email"/>

							{this.validator.message('email', this.state.email, 'required|email', 'validation-tooltip',  {required: 'Please enter email', email: 'Please enter valid email'})}
						</div>
						<div className="input-container" id={style.passwordContainer}>
							<div onClick={()=>this.setState({visiblePassword: !this.state.visiblePassword})} id={style.eyeContainer}>
								{ this.state.visiblePassword ? (
									<FontAwesome name='eye-slash' />
								) : (
									<FontAwesome name='eye' />
								)}

							</div>
							<label for="password">Password</label>
							<input type={this.state.visiblePassword ? 'text' : 'password'} name="password" value={this.state.password} onChange={this.onChange} className="uk-input"	id="password" />

							{this.validator.message('email', this.state.password, 'required', 'validation-tooltip',  {required: 'Please enter password'})}
						</div>
						<div className="switchContainer" id={style.proSwitch}>
							<Switch onClick={()=>this.setState({pro: !this.state.pro})} on={this.state.pro}/>
							<span>Register as pro?</span>
						</div>
						{ this.state.pro && (
							<div id={style.proFormContainer}>
								<div id={style.services}>
									<label>Sector</label>
									<div>
										{ Services.map((service,index) => (
												<div onClick={()=>this.onSelectSector(index)} className={(this.state.sector == service.name) ? style.selected : ''}> {service.name}</div>
											))
										}
									</div>

									{this.validator.message('sector', this.state.sector, 'required', 'validation-tooltip',  {required: 'Please select sector'})}
								</div>
								{ this.state.sectorCategories.length > 0 && (
									<div className="input-container" id={style.selectContainer}>
										<label for="profession">Category</label>
										<select className="uk-select" name="sectorCategory" value={this.state.sectorCategory} onChange={this.handleSelectChange}>
											<option value="">Please select category</option>
											{ this.state.sectorCategories.map(category => (
													<option value={category}>{category}</option>
												))
											}
							        options={this.state.sectorCategories}
							      </select>

										{this.validator.message('sectorCategory', this.state.sectorCategory, 'required', 'validation-tooltip',  {required: 'Please select category'})}
									</div>
								)}
								{ this.state.sector.length > 0 && this.state.sectorCategory.length > 0 && (
									<div>
										<div className="input-container">
											<label for="profession">Profession</label>
											<input type="text" name="profession" value={this.state.profession} onChange={this.onChange} className="uk-input" id="profession"/>

											{this.validator.message('profession', this.state.profession, 'required', 'validation-tooltip',  {required: 'Please enter profession'})}
										</div>
										<div className="input-container" id={style.descriptionContainer}>
											<label for="professionDescription">Description</label>
											<textarea name="professionDescription" value={this.state.professionDescription} onChange={this.onChange} className="uk-input" id={style.professionDescription}/>

											{this.validator.message('professionDescription', this.state.professionDescription, 'required', 'validation-tooltip',  {required: 'Please enter description'})}
										</div>
										<div className="input-container" id={style.rateContainer}>
											<label for="rate">Rate</label>
											<Slider
							          min={0}
							          max={maxRate}
							          step={step}
							          value={this.state.rate}
							          onChange={this.onSliderChange}
							        />

												{this.state.rate == "0.00" ? (
													<div className={style.rate}>
														<span className={style.free}>Free</span>
													</div>
												): (
													<div className={style.rate}>
														<span>£{this.state.rate} </span>
														per minute
													</div>
												)}

										</div>
									</div>
								)}

							</div>
						)}
						<span className={style.terms}>
							By clicking on "Sign Up" button, I agree	to the <a target="_blank" href="/terms">Terms of use </a> and the <a target="_blank" href="/privacy">Privacy Policy</a>
						</span>
						<button className="uk-button" onClick={this.signUp}>Sign up</button>
					</div>
				)
			} else {
				return (
					<div className={style.signUpForm}>
						<div className={style.success}>
							<h3>Thank you for Telmie registration!</h3>
							<p>Check your e-mail and click a link in Telmie letter to verify your account. After verification you'll be free to use Telmie App and web-page.</p>
						</div>
					</div>
				)
			}

		} else {
			return <Spinner />
		}
	}
}
