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
import  Timer from "react-time-counter";

export default class SignUpForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			codeSent: false,
			pro: false,
			loading: false,
			visiblePassword: false,
			codeVerified: false
		}
		this.onChange = this.onChange.bind(this);
		this.codeOnChange = this.codeOnChange.bind(this);
		this.sendCode = this.sendCode.bind(this);
		this.reSendCode = this.reSendCode.bind(this);
		this.signUp = this.signUp.bind(this);
		this.verifyCode = this.verifyCode.bind(this);
		this.validator = new SimpleReactValidator();
	}
	reSendCode(){
		this.props.sendCode(this.state.email, "REGISTRATION");
		
	}
	sendCode(){
		if (this.validator.fieldValid('email')) {
			this.props.sendCode(this.state.email, "REGISTRATION");
		} else {
			this.validator.showMessages();
			this.forceUpdate();
		}
		
	}
	verifyCode(){
		let code = `${this.state.code1}${this.state.code2}${this.state.code3}${this.state.code4}`;
		if (code.length == 4) {
			this.props.verifyCode(code, this.state.email);
		}
	}
	signUp(){
		if( this.validator.allValid() ){
			let registerData = {
				name: this.state.firstName,
				lastName: this.state.lastName,
				code: `${this.state.code1}${this.state.code2}${this.state.code3}${this.state.code4}`,
				email: this.state.email,
				password: this.state.password
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

		if (this.props.sendCodeSuccess.length == 0 && nextProps.sendCodeSuccess.length != 0) {
			this.setState({ codeSent: true })
		}

		if (!this.props.verifyCodeSuccess && nextProps.verifyCodeSuccess) {
			this.setState({ codeVerified: true })
		}

	}

	codeOnChange(e){
		let name = e.target.name,
			number = name.slice(4,5),
			value = e.target.value,
			newState = {};


		newState[name] = value.slice(0,1);
		const nextEl = document.getElementById(`code${parseInt(number) + 1}`);
		if (nextEl != null) {
			nextEl.focus();
		} else {
			//document.getElementById("firstName").focus();
		}
		this.setState(newState)
	}

	onChange(e){
		let name = e.target.name,
				value = e.target.value,
				newState = {};
		newState[name] = value;
		if (name == 'email' && this.state.codeSent) {
			newState.codeSent = false;
			this.props.fetchSendCode();
		}
		this.setState(newState)
	}

	render({}) {
		if (!this.state.loading) {
			if (!this.props.registerSuccess) {
				return (
					<div className={style.signUpForm}>
					  	{(this.props.registerFailureMessage.length > 0) && (
							<div className={style.failure}>{this.props.registerFailureMessage}</div>
						)}

						{(this.props.sendCodeFailureMessage.length > 0 ) && (
							<div className={style.failure}>{ this.props.sendCodeFailureMessage }</div>
						)}

						{(this.props.verifyCodeFailureMessage.length > 0 ) && (
							<div className={style.failure}>{ this.props.verifyCodeFailureMessage }</div>
						)}

						<div className="input-container">
							<label for="email">Email</label>
							<input type="text" name="email" disabled={ this.state.codeVerified } value={this.state.email} onChange={this.onChange} className="uk-input" id="email"/>
							{this.validator.message('email', this.state.email, 'required|email', 'validation-tooltip',  {required: 'Please enter email', email: 'Please enter valid email'})}
						</div>

						{ !this.state.codeSent  && (
							<div>
								<div className={style.codeMessage}>
									In order to verify your email, we will send you 4 characters verification code.
								</div>
								<button className={"uk-button " + style.sendCode} onClick={this.sendCode}>
									{ this.state.codeSent ? 'Re-send verification code' : 'Send verification code' }
								</button>
							</div>
						)}
						
						
						
						{ this.state.codeSent && (
							
							
							<div className={style.userDetails}>
								{ !this.state.codeVerified && (
									<div className={style.codeMessage}>
										Code has been sent to <strong> { this.state.email } </strong>
									</div>
								)}
								
								{(!this.state.codeVerified) ? (
									<div className={style.timer}>
										Code expires in: 
										<Timer minutes={5} backward={true}  />
									</div>
									
								): (
									<div className={style.success}>Code verified</div>
								)}
								<div className="code-input-container">
									<label for="email">Code</label>
									<div>
										<input type="text" disabled={this.state.codeVerified} name="code1" value={this.state.code1} onKeyUp={this.codeOnChange} className="uk-input" id="code1"/>
										<input type="text" disabled={this.state.codeVerified} name="code2" value={this.state.code2} onKeyUp={this.codeOnChange} className="uk-input" id="code2"/>
										<input type="text" disabled={this.state.codeVerified} name="code3" value={this.state.code3} onKeyUp={this.codeOnChange} className="uk-input" id="code3"/>
										<input type="text" disabled={this.state.codeVerified} name="code4" value={this.state.code4} onKeyUp={this.codeOnChange} className="uk-input" id="code4"/>
									</div>
								</div>
								{(!this.state.codeVerified) ? (
									<button className={"uk-button " + style.verifyCode} onClick={this.verifyCode}>
										Verify code
									</button>
								): (
									<div>
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
										
										
										<span className={style.terms}>
											By clicking on "Sign Up" button, I agree	to the <a target="_blank" href="/terms">Terms of use </a> and the <a target="_blank" href="/privacy">Privacy Policy</a>
										</span>
										<button className="uk-button" onClick={this.signUp}>Sign up</button>
									</div>
								)}
								
							</div>
						)}
						
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
