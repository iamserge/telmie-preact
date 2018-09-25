import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import LogInForm from '../../components/log-in/log-in-form';
import style from './style.scss';
import { logIn, getProCalls, getPersonalCalls, getTransactions } from '../../actions/user';
import { route, Link } from 'preact-router';
import Redirect from '../../components/global/redirect';
import { routes } from '../../components/app'

class LogInOrSignup extends Component {

	render() {
		return (
			<div id="loginOrSignup" className="uk-container uk-container-small" >
				<h1>Sorry</h1>
				<h2>In order to search or view pros you have to be logged in</h2>
				<Link href={routes.LOG_IN} className="uk-button">Log in</Link>
				<span>or</span>
				<Link href={routes.SIGN_UP} className="uk-button">Sign up</Link>
				<span className="note">It only takes 10 seconds</span>
			</div>

		);
	}
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(

)(LogInOrSignup);
