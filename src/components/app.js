import { h, Component, Fragment } from 'preact';
import { Router } from 'preact-router';

import Header from './global/header';
import Footer from './global/footer';
import Home from '../routes/home';
import Search from '../routes/search';
import Pro from '../routes/pro';
import StaticPage from '../routes/static-page';
import AboutUs from '../routes/about-us';
import LogIn from '../routes/log-in';
import SignUp from '../routes/sign-up';
import LogInOrSignup from '../routes/login-or-signup';
import Profile from '../routes/profile';
import Activity from '../routes/activity';
import EditProfile from '../routes/edit-profile';
import AllTransactions from '../routes/transactions';
import Shortlist from '../routes/shortlist';
import ForgotPassword from '../routes/forgot-password';
import SettingsPage from '../routes/settings';
import PrismicConfig from '../prismic/prismic-configuration';
import { uids } from '../prismic/uids';
import Prismic from 'prismic-javascript';

export const routes = {
	HOME: '/',
	SEARCH: '/search/:searchTerm',
	PRO: '/pro/:userId',
	ABOUT_US: '/about-us',
	FAQ: '/help',
	TERMS: '/terms',
	PRIVACY: '/privacy',
	CONTACT_US: '/contact-us',
	SIGN_UP: '/sign-up',
	LOG_IN: '/log-in',
	PROFILE: '/profile',
	MY_PROS: '/my-pros',
	MY_CLIENTS: '/my-clients',
	MY_SHORTLIST: '/my-shortlist',
	TRANSACTIONS: '/transactions',
	EDIT_PROFILE: '/edit-profile',
	LOGIN_OR_SIGNUP: '/login-or-signup',
	FORGOT_PASSWORD: '/forgot-password',
	SETTINGS: '/settings'
};


export default class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			prismicCtx: null
		}
	}

	componentWillMount() {

    this.buildContext().then((prismicCtx) => {
      this.setState({ prismicCtx });
    }).catch((e) => {
      console.error(`Cannot contact the API, check your prismic configuration:\n${e}`);
    });
  }


	handleRoute = e => {
		this.currentUrl = e.url;
	};

	buildContext() {
    const accessToken = PrismicConfig.accessToken;
    return Prismic.api(PrismicConfig.apiEndpoint, { accessToken }).then(api => ({
      api,
      endpoint: PrismicConfig.apiEndpoint,
      accessToken,
      linkResolver: PrismicConfig.linkResolver
    }));
  }

	render() {
		return (
			<div id="app">
				<Header />
				<div className="mainContainer" style={ { minHeight: window.outerHeight - 80}}>
					<Router onChange={this.handleRoute}>
						<Search path={routes.SEARCH} />
						<Pro path={routes.PRO} />
						<Activity path={routes.MY_PROS} isProCalls = { false } />
						<Activity path={routes.MY_CLIENTS} isProCalls = { true } />
						<Shortlist path={routes.MY_SHORTLIST} />
						<Shortlist path={routes.MY_SHORTLIST} />

						<AllTransactions path={routes.TRANSACTIONS} />
						<Home path={routes.HOME} prismicCtx = { this.state.prismicCtx } uid = { uids.HOMEPAGE } />
						<AboutUs path = { routes.ABOUT_US } prismicCtx = { this.state.prismicCtx } uid = { uids.ABOUT_US }/>
						<StaticPage path = { routes.FAQ } prismicCtx = { this.state.prismicCtx } uid = { uids.FAQ }/>
						<StaticPage path = { routes.TERMS } prismicCtx = { this.state.prismicCtx } uid = { uids.TERMS }/>
						<StaticPage path = { routes.PRIVACY } prismicCtx = { this.state.prismicCtx } uid = { uids.PRIVACY }/>
						<StaticPage path = { routes.CONTACT_US } prismicCtx = { this.state.prismicCtx } uid = { uids.CONTACT_US }/>

						<LogIn path = { routes.LOG_IN } />
						<SignUp path = { routes.SIGN_UP } prismicCtx = { this.state.prismicCtx } uid = { uids.REGISTRATION }/>
						<Profile path = { routes.PROFILE } />
						<EditProfile path = { routes.EDIT_PROFILE } prismicCtx = { this.state.prismicCtx } uid = { uids.REGISTRATION }/>
						<LogInOrSignup path = { routes.LOGIN_OR_SIGNUP } />
						<ForgotPassword path = { routes.FORGOT_PASSWORD } />
						<SettingsPage path = { routes.SETTINGS }/>
					</Router>
				</div>
				<Footer />
			</div>
		);
	}
}
