import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import EditProfileForm from '../../components/edit-profile/edit-profile-form';
import style from './style.scss';
import { register, fetchRegistration, sendCode, fetchSendCode, verifyCode, resetPassword } from '../../actions/user';import Spinner from '../../components/global/spinner';
import SimpleReactValidator from 'simple-react-validator';
import  Timer from "react-time-counter";

import { route } from 'preact-router';
import Redirect from '../../components/global/redirect';

class EditProfile extends Component {
	constructor(props){
		super(props);
		this.state = {
			email: "",
			codeSent: false,
			codeVerified: false,
			code1: "",
			code2: "",
			code3: "",
			code4: "",
			password: ""
		}
		this.onChange = this.onChange.bind(this);
		this.reset = this.reset.bind(this);
		this.sendCode = this.sendCode.bind(this);
		this.verifyCode = this.verifyCode.bind(this);
		this.codeOnChange = this.codeOnChange.bind(this);
		this.validator = new SimpleReactValidator();
	}
	componentDidMount(){

	}
	componentWillReceiveProps(nextProps) {
		if (this.props.sendCodeSuccess.length == 0 && nextProps.sendCodeSuccess.length != 0) {
			this.setState({ codeSent: true })
		}

		if (!this.props.verifyCodeSuccess && nextProps.verifyCodeSuccess) {
			this.setState({ codeVerified: true })
		}
	}
	sendCode(){
		if (this.validator.fieldValid('email')) {
			this.props.sendCode(this.state.email, "RESET_PASSWORD");
		} else {
			this.validator.showMessages();
			this.forceUpdate();
		}
		
	}
	verifyCode(){
		let code = `${this.state.code1}${this.state.code2}${this.state.code3}${this.state.code4}`;
		if (code.length == 4) {
			this.props.verifyCode(this.state.email, code);
		}
	}
	onChange(e){
		let newState = {}
		newState[e.target.name] = e.target.value;
		this.setState(newState);

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
	reset(){
		let code = `${this.state.code1}${this.state.code2}${this.state.code3}${this.state.code4}`;
		this.props.resetPassword(this.state.email, this.state.password, code)
	}
	render() {
		return (
			<div className={style.forgotPassword}>
				<h1>Forgot password?</h1>
				<p>
					We heard you’ve forgotten your password.
					Not to worry - new generated pass will be send to your e-mail.
					But first we need to verify your email.
				</p>
				{(this.props.sendCodeFailureMessage.length > 0 ) && (
					<div className={style.failure}>{ this.props.sendCodeFailureMessage }</div>
				)}

				{(this.props.verifyCodeFailureMessage.length > 0 ) && (
					<div className={style.failure}>{ this.props.verifyCodeFailureMessage }</div>
				)}
				{(this.props.resetFailure.length > 0 ) && (
					<div className={style.failure}>{ this.props.resetFailure }</div>
				)}
				{ !this.state.codeVerified && (
					<div className="input-container">
						<label for="email">Email</label>
						<input type="text" name="email" disabled={ this.state.codeVerified } value={this.state.email} onChange={this.onChange} className="uk-input" id="email"/>
						{this.validator.message('email', this.state.email, 'required|email', 'validation-tooltip',  {required: 'Please enter email', email: 'Please enter valid email'})}
					</div>
				)}
				

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
								<div className="input-container">
									<label for="email">Email</label>
									<input type="text" name="email" disabled={ this.state.codeVerified } value={this.state.email} onChange={this.onChange} className="uk-input" id="email"/>
									{this.validator.message('email', this.state.email, 'required|email', 'validation-tooltip',  {required: 'Please enter email', email: 'Please enter valid email'})}
								</div>
								<div className="input-container">
									<label for="password">New password</label>
									<input type="text" name="password" type="password" value={this.state.password} onChange={this.onChange} className="uk-input" id="password" />
								</div>
								{ this.props.resetSuccess ? (
									<div className={style.success}>Your password has been reset</div>
								) : (
									<button className="uk-button" onClick={this.reset}>Reset</button>
								)}
								
							</div>
						)}
						
					</div>
				)}
				
			</div>
		)

	}
}

const mapStateToProps = (state) => ({
	sendCodeSuccess: state.sendCodeSuccess,
	sendCodeFailureMessage: state.sendCodeFailureMessage,
	verifyCodeSuccess: state.verifyCodeSuccess,
	verifyCodeFailureMessage: state.verifyCodeFailureMessage,
	resetSuccess: state.resetSuccess,
	resetFailure: state.resetFailure
});

const mapDispatchToProps = dispatch => bindActionCreators({
	resetPassword,
	sendCode,
	fetchSendCode,
	verifyCode
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfile);
