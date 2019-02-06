import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import LogInForm from '../../components/log-in/log-in-form';
import style from './style.scss';
import { logIn, getProCalls, getPersonalCalls, getTransactions, changeLocale, changeLocaleLangs } from '../../actions/user';
import Redirect from '../../components/global/redirect';
import { routes } from '../../components/app'

class LogIn extends Component {
	constructor(props){
		super(props);
		this.state = {
			loggedIn: false
		}
	}
	componentDidMount(){
		this.fetchPage(this.props);
	}
	fetchPage= (props) => {
		props.changeLocale();
		props.changeLocaleLangs([]);
	}
	componentWillReceiveProps(nextProps) {
		if (Object.keys(this.props.userData).length === 0 && Object.keys(nextProps.userData).length != 0) {
			this.setState({
				loggedIn: true,
				isPro: !!nextProps.userData.pro
			});
		}
	}
	render() {
		return (!this.state.loggedIn) ? (
			<div id="login" className="uk-container uk-container-small" >
				<h1>Log in</h1>
				<LogInForm logIn = {this.props.logIn} logInFailure = {this.props.logInFailure}/>
			</div>
		) : (this.state.isPro) ? 
			<Redirect to={routes.MY_CLIENTS} /> : <Redirect to={routes.MY_PROS} />
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
	getTransactions,
	changeLocale,
	changeLocaleLangs
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LogIn);
