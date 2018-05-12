import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Switch from 'react-toggle-switch'
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import SimpleReactValidator from 'simple-react-validator';
import { apiRoot } from '../../../api';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

const Services = [
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
export default class EditProfileForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: this.props.userData.name,
			lastName: this.props.userData.lastName,
			mobile: (this.props.userData.mobile != 'TBC') ? this.props.userData.mobile : '' ,
			dateOfBirth: (this.props.userData.dateOfBirth != 'TBC') ? this.props.userData.dateOfBirth : '' ,
			location: (this.props.userData.location != 'TBC') ? this.props.userData.location : '' ,

			profession: (this.props.userData.pro != null) ? this.props.userData.pro.profession : '',
			professionDescription: (this.props.userData.pro != null) ? this.props.userData.pro.professionDescription : '',
			sectorCategory: (this.props.userData.pro != null) ? this.props.userData.pro.subCategory : '',
			sector: (this.props.userData.pro != null) ? this.props.userData.pro.category : '',
			rate: (this.props.userData.pro != null) ? this.props.userData.pro.costPerMinute : '',
			sectorCategories: [],
			pro: (this.props.userData.pro != null) ? true : null ,
			loading: false,
			registerPro: false
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
		this.setState({loading: false})
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
		const userData  = this.props.userData;

		if (!this.state.loading) {
			return (
				<div className={style.editProfile}>
				  { this.props.registerFailure && (
						<div className={style.failure}>Sorry, account with this email address already exists</div>
					)}
					<div className={style.imageContainer}>
						<div className={style.image}>
							{ (userData.avatar != null) ? (
								<img src={apiRoot + 'image/' + userData.avatar.id} alt={userData.name + ' ' + userData.lastName} />
							) : (
								<img src="/assets/nouserimage.jpg" alt={userData.name + ' ' + userData.lastName} />
							)}
						</div>
						<div className={style.upload}>
							<button onClick={()=>{}} className="uk-button">
								Upload new
							</button>
						</div>

					</div>
					<div className={style.userDetails}>
						<div className="double-input-container">
							<div className="input-container">
								<label for="firstName">First name</label>
								<input type="text" name="name" value={this.state.name} onChange={this.onChange} className="uk-input" id="name"/>

								{this.validator.message('firstName', this.state.firstName, 'required', 'validation-tooltip', {required: 'Please enter first name'})}
							</div>
							<div className="input-container">
								<label for="password">Last name</label>
								<input type="text" name="lastName" value={this.state.lastName} onChange={this.onChange} className="uk-input"	id="lastName" />

								{this.validator.message('lastName', this.state.lastName, 'required', 'validation-tooltip right', {required: 'Please enter last name'})}
							</div>
						</div>
						<div className="double-input-container">
							<div className="input-container">
								<label for="firstName">Mobile phone</label>
								<input type="text" name="mobile" value={this.state.mobile} onChange={this.onChange} className="uk-input" id="mobile"/>

							</div>
							<div className="input-container">
								<label for="password">Location</label>
								<input type="text" name="location" value={this.state.location} onChange={this.onChange} className="uk-input"	id="location" />

							</div>
						</div>
						<div className="input-container">
							<label for="dateOfBirth">Date of birth</label>
							<input type="text" name="dateOfBirth" value={this.state.dateOfBirth} onChange={this.onChange} className="uk-input" id="dateOfBirth"/>
						</div>
						{ (!this.state.pro) && (
							<div className="switchContainer" id={style.proSwitch}>
								<Switch onClick={()=>this.setState({registerPro: !this.state.registerPro})} on={this.state.registerPro}/>
								<span>Register as pro?</span>
							</div>
						)}

						{ (this.state.pro || this.state.registerPro ) && (
							<div id={style.proFormContainer}>
								<h3>Pro details</h3>
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
						          min={0.1}
						          max={20}
						          step={0.1}
						          value={this.state.rate}
						          onChange={this.onSliderChange}
						        />
										<div className={style.rate}>
											<span>£{this.state.rate} </span>
											per minute
										</div>
									</div>
								</div>
							</div>
						)}
						<button className="uk-button" onClick={()=>{this.setState({loading: true});this.props.editDetails(this.state)}}>Save</button>
					</div>


				</div>
			)

		} else {
			return <Spinner />
		}
	}
}
