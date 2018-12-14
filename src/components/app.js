import { h, Component } from 'preact';
import { Router, route } from 'preact-router';

import Header from './global/header';
import Footer from './global/footer';
import Home from '../routes/home';
import Search from '../routes/search';
import Pro from '../routes/pro';
import StaticPage from '../routes/static-page';
import LogIn from '../routes/log-in';
import LogOut from '../routes/log-in/log-out';
import SignUp from '../routes/sign-up';
import LogInOrSignup from '../routes/login-or-signup';
import Profile from '../routes/profile';
import Activity from '../routes/activity';
import EditProfile from '../routes/edit-profile';
import AllTransactions from '../routes/transactions';
import Shortlist from '../routes/shortlist';
import ForgotPassword from '../routes/forgot-password';
import SettingsPage from '../routes/settings';
import RegisterPro from '../routes/register-pro';
import ContactRoute from '../routes/contact-us';
import ErrorRoute from '../routes/errorRoute';
import FAQ from '../routes/faq';
import BlogPage from '../routes/blog';
import LanguagePractice from '../routes/language-practice';
import ImmigrationLaw from '../routes/immigration-law';
import LanguageLearners from '../routes/language-learners';
import PrismicConfig from '../prismic/prismic-configuration';
import { uids, types, tags } from '../prismic/uids';
import Prismic from 'prismic-javascript';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import ReactGA from 'react-ga';
import { RU, EN } from "../utils/consts";

import 'animate.css'

export const routes = {
	HOME: '/',
	SEARCH: '/search/:searchTerm',
	SEARCH_FOR_COMP: '/search/',
	PRO: '/pro/:userId',
	PRO_FOR_COMP: '/pro/',
	FAQ: '/help',
	FAQ_LINK: '/#faq',
	TERMS: '/terms',
	PRIVACY: '/privacy',
	CONTACT_US: '/contact-us',
	CONTACT_US_LINK: '/#contact-us',
	HOW_WORKS_LINK: '/#how-it-works',
	BECOME_PRO_LINK: '/#become-pro',
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
	SETTINGS: '/settings',
	REGISTER_PRO: '/register-pro',
	BLOG_LINK: '/#blog',
	BLOG_POST: '/blog/:uid',
	LANGUAGE_PRACTICE: '/language-practice',
	IMMIGRATION_LAW: '/immigration-advice',
	LANGUAGE_LEARNERS: '/language-learners',
	LANGUAGE_LEARNERS_RU: '/ru/language-learners'
};

export const langRoutes = (lang, route) => lang == EN ? route : `/${lang}${route}`;

class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			prismicCtx: null,
			currentUrl: "",
		}
	}

	componentWillMount() {
		ReactGA.initialize('UA-127710081-1');
		this.buildContext().then((prismicCtx) => {
			this.setState({ prismicCtx });
		}).catch((e) => {
			console.error(`Cannot contact the API, check your prismic configuration:\n${e}`);
		});
  	}


	handleRoute = e => {
		ReactGA.pageview(e.url);
		this.setState({currentUrl: e.url});
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

	renderProRoutes = () => [
		...this.renderUserRoutes(),
		<Activity path={routes.MY_CLIENTS} isProCalls = { true } />,
	];

	/*renderUserRoutes = () => [
		...this.renderDefaultRoutes(),
		<Search path={routes.SEARCH} />, 
		<Activity path={routes.MY_PROS} isProCalls = { false } />,
		<AllTransactions path={routes.TRANSACTIONS} />,
		<Pro path={routes.PRO} />,
		<Shortlist path={routes.MY_SHORTLIST} />,
		<Profile path = { routes.PROFILE } />,
		<EditProfile path = { routes.EDIT_PROFILE } prismicCtx = { this.state.prismicCtx } uid = { uids.REGISTRATION }/>,
		<RegisterPro path = { routes.REGISTER_PRO } />,
		<SettingsPage path = { routes.SETTINGS }/>
	];*/
	renderUserRoutes = () => [
		...this.renderDefaultRoutes(),
		<Search path={routes.SEARCH} />, 
		<Pro path={routes.PRO} />,
	];

	/*renderDefaultRoutes = () => [
		...this.renderLangRoutes(EN),
		...this.renderLangRoutes(RU),

		<LogIn path = { routes.LOG_IN } />,
		<SignUp path = { routes.SIGN_UP } prismicCtx = { this.state.prismicCtx } uid = { uids.REGISTRATION }/>,
		<LogInOrSignup path = { routes.LOGIN_OR_SIGNUP } />,
		<ForgotPassword path = { routes.FORGOT_PASSWORD } />,
	];*/

	renderDefaultRoutes = () => [
		...this.renderLangRoutes(EN),
		...this.renderLangRoutes(RU),

		<LogIn path = { routes.LOG_IN } />,
		<LogOut path = '/log-out' />
	];

	renderLangRoutes = (lang) => ([
		<Home path={ langRoutes(lang, routes.HOME) } prismicCtx = { this.state.prismicCtx } type={types.HOMEPAGE} />,
		<ImmigrationLaw path={ langRoutes(lang, routes.IMMIGRATION_LAW) } prismicCtx = { this.state.prismicCtx } type={types.SERVICE_PAGE} tag={tags.IMMIGRATION_ADVICE} reviewsUid={ uids.SHORT_REVIEWS }/>,
		<LanguagePractice path={ langRoutes(lang, routes.LANGUAGE_PRACTICE) } prismicCtx = { this.state.prismicCtx } type={types.SERVICE_PAGE} tag={tags.LANGUAGE_PRACTICE} reviewsUid={ uids.SHORT_REVIEWS }/>,
		<LanguageLearners path={ langRoutes(lang, routes.LANGUAGE_LEARNERS) } prismicCtx = { this.state.prismicCtx } type={types.SERVICE_PAGE} tag={tags.LANGUAGE_LEARNERS} reviewsUid={ uids.SHORT_REVIEWS }/>,
		<BlogPage path={ langRoutes(lang, routes.BLOG_POST) } prismicCtx = { this.state.prismicCtx } />,
		<FAQ path={ langRoutes(lang, routes.FAQ) } prismicCtx = { this.state.prismicCtx } type={types.FAQ} />,
		<StaticPage path = { langRoutes(lang, routes.TERMS) } prismicCtx = { this.state.prismicCtx } type={types.STATIC_PAGE} tag={tags.TERMS}/>,
		<StaticPage path = { langRoutes(lang, routes.PRIVACY) } prismicCtx = { this.state.prismicCtx } type={types.STATIC_PAGE} tag={tags.PRIVACY} />,
		<ContactRoute path = { langRoutes(lang, routes.CONTACT_US) }/>,
	])

	render() {
		const {userData : user  = {}, locale} = this.props;

		return (
			<div id="app">
				<Header locale={locale} currentUrl = {this.state.currentUrl} prismicCtx = { this.state.prismicCtx } uid = { uids[locale].MESSAGE }/>
				<div className="mainContainer" style={ { minHeight: window.outerHeight - 80}}>
					<Router onChange={this.handleRoute}>
						{(Object.keys(user).length !== 0) ? 
							(user.pro != null) ? this.renderProRoutes() : this.renderUserRoutes()
							: this.renderDefaultRoutes()}
						<ErrorRoute default />
					</Router>
				</div>
				<Footer locale={locale} currentUrl = {this.state.currentUrl}/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	locale: state.locale.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);