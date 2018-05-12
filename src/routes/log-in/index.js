import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import LogInForm from '../../components/log-in/log-in-form';
import style from './style.scss';
import { logIn, getProCalls, getPersonalCalls, getTransactions } from '../../actions/user';
import { route } from 'preact-router';
import Redirect from '../../components/global/redirect';

class LogIn extends Component {
	constructor(props){
		super(props);
		this.state = {
			loggedIn: false
		}
	}
	componentDidMount(){

	}
	componentWillReceiveProps(nextProps) {
		if (Object.keys(this.props.userData).length === 0 && Object.keys(nextProps.userData).length != 0) {
			this.setState({
				loggedIn: true
			});
			this.props.getProCalls(nextProps.userData.userAuth);
			this.props.getPersonalCalls(nextProps.userData.userAuth);
			this.props.getTransactions(nextProps.userData.userAuth);
		}
	}
	render() {
		if (!this.state.loggedIn) {
			return (
				<div id="login" className="uk-container uk-container-small" >
					<h1>Log in</h1>
					<LogInForm logIn = {this.props.logIn} logInFailure = {this.props.logInFailure}/>

				</div>

			);
		} else {
			return (<Redirect to='/profile' />)
		}

	}
}

const mapStateToProps = (state) => ({
	logInFailure: state.logInFailure,
	userData: state.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({
	logIn,
	getProCalls,
	getPersonalCalls,
	getTransactions
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LogIn);
