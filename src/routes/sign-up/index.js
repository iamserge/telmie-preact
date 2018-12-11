import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import SignUpForm from '../../components/sign-up/sign-up-form';
import style from './style.scss';
import { register, fetchRegistration, sendCode, fetchSendCode, verifyCode, changeLocale, changeLocaleLangs } from '../../actions/user';
import Redirect from '../../components/global/redirect';

class SignUp extends Component {
	constructor(props){
		super(props);
		this.state = {
			regData: null
		}
	}
	componentDidMount(){
		this.fetchPage(this.props);
	}
	fetchPage= (props) => {
		props.changeLocale();
		props.changeLocaleLangs([]);
	}
	componentWillReceiveProps(nextProps){
		
	}
	render() {

		if (!this.state.loggedIn) {
			return (
				<div className="uk-container uk-container-small" id="signUp" >
					<div>
							{!this.props.registerSuccess ? (
								<h1>Sign up</h1>
							) : (
								<h1>Success!</h1>
							) }
							<SignUpForm 
								sendCode = { this.props.sendCode } 
								fetchRegistration = { this.props.fetchRegistration } 
								register = { this.props.register } 
								registerSuccess = { this.props.registerSuccess } 
								registerFailureMessage = { this.props.registerFailureMessage } 
								sendCodeSuccess = { this.props.sendCodeSuccess } 
								sendCodeFailureMessage = { this.props.sendCodeFailureMessage } 
								verifyCodeSuccess = { this.props.verifyCodeSuccess }
								verifyCodeFailureMessage = { this.props.verifyCodeFailureMessage }
								fetchSendCode = { this.props.fetchSendCode }
								verifyCode = { this.props.verifyCode }
								regData = { this.state.regData }
							/>
						</div>
				</div>

			);
		} else {
			return (<Redirect to='/profile' />)
		}

	}
}

const mapStateToProps = (state) => ({
	registerSuccess: state.registerSuccess,
	registerFailureMessage: state.registerFailureMessage,
	sendCodeSuccess: state.sendCodeSuccess,
	sendCodeFailureMessage: state.sendCodeFailureMessage,
	verifyCodeSuccess: state.verifyCodeSuccess,
	verifyCodeFailureMessage: state.verifyCodeFailureMessage
});

const mapDispatchToProps = dispatch => bindActionCreators({
	register,
	fetchRegistration,
	sendCode,
	fetchSendCode,
	verifyCode,
	changeLocaleLangs,
	changeLocale,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUp);
