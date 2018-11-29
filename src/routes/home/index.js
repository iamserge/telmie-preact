import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import Spinner from '../../components/global/spinner';
import { Element, scroller, Link as ScrollLink } from 'react-scroll'
import ScrollToTop from'react-scroll-up'
import FontAwesome from 'react-fontawesome';


import InfoComponent from '../../components/new-landing/info-component'
import PhotoCards from '../../components/new-landing/photo-cards'
import FeaturedServices from '../../components/new-landing/featured-services'
import HowWorksDetails from '../../components/new-landing/how-works-details'
import LandingFAQ from '../../components/new-landing/landing-faq'
import AppDetails from '../../components/new-landing/app-details'
import ProDetails from '../../components/new-landing/pro-details'
import BlogArticles from '../../components/new-landing/blog-articles'
import ContactForm from '../../components/new-landing/contact-form'

import { route } from 'preact-router';
import { verify, sendContactData, clearContactData } from '../../actions/user';
import style from './style.scss';

import { processRecentPosts, processPostThumbnailData, processHomepageData } from '../../utils/prismic-middleware';
import { langPack } from '../../utils/langPack';

const appLink = 'https://itunes.apple.com/us/app/telmie/id1345950689';

class HomePage extends Component {
	constructor(props){
		super(props);
		this.state =  {
			page: null,
			notFound: false,
			verifyFailure: false,
			fetchingPage: true,
			fetchingFeaturedPost: true,
			fetchingRecentPosts: true
	  }
		this.contactUs = null;
		this.fetchPage = this.fetchPage.bind(this);
		this.fetchFeatuedPost = this.fetchFeatuedPost.bind(this);
		this.fetchRecentPosts = this.fetchRecentPosts.bind(this);
	}
	scrollToContact = () => {
		const {hash} = window.location;

		hash && (
			(hash.indexOf('blog') + 1) &&
				(this.scrollInterval = setInterval(() => {
					this.contactUs !== null && (
						scroller.scrollTo('blogElement', {
							spy: true,
							smooth: true,
							duration: 500,
							offset: -70,
						}),
						clearInterval(this.scrollInterval),
						this.scrollInterval = null
					)
				}, 100)),
			(hash.indexOf('how-it-works') + 1) &&
				(this.scrollInterval = setInterval(() => {
					this.contactUs !== null && (
						scroller.scrollTo('howWorksElement', {
							spy: true,
							smooth: true,
							duration: 500,
							offset: -50,
						}),
						clearInterval(this.scrollInterval),
						this.scrollInterval = null
					)
				}, 100)),
			(hash.indexOf('become-pro') + 1) &&
				(this.scrollInterval = setInterval(() => {
					this.contactUs !== null && (
						scroller.scrollTo('becomeProElement', {
							spy: true,
							smooth: true,
							duration: 500,
							offset: -110,
						}),
						clearInterval(this.scrollInterval),
						this.scrollInterval = null
					)
				}, 100))
		)
	}
	componentDidMount(){
		if (this.props.prismicCtx) {
			this.fetchPage(this.props);
			this.fetchRecentPosts(this.props);
			this.fetchFeatuedPost(this.props);
		}
		
		if (typeof this.props.token != 'undefined') {
			this.props.verify(this.props.token)
		}
		this.scrollToContact();
	}
	componentWillReceiveProps(nextProps){
		if ((this.props.prismicCtx == null && nextProps.prismicCtx != null) 
			|| (this.props.uid !== nextProps.uid)) {
			this.fetchPage(nextProps);
			this.fetchRecentPosts(nextProps);
			this.fetchFeatuedPost(nextProps);
		}

		if (nextProps.verifySuccess) {
			route('/log-in');
		}

		if (nextProps.verifyFailure) {
			this.setState({
				verifyFailure: true
			})
		}

	}
	fetchFeatuedPost(props){
		let that = this;
		props.prismicCtx.api.query([
			Prismic.Predicates.at('document.type', 'blog_post'),
			Prismic.Predicates.at('document.tags', ['featured'])
		],
		{ orderings : '[document.first_publication_date desc]', lang: props.locale }
		).then(function(response) {
			that.setState({
					fetchingFeaturedPost: false,
					featuredPost: processPostThumbnailData(response.results[0])
				})
		});
	}
	fetchRecentPosts(props){
		let that = this;
		props.prismicCtx.api.query([
			Prismic.Predicates.at('document.type', 'blog_post'),
			Prismic.Predicates.not('document.tags', ['featured']),
		],
		{ pageSize: 4, orderings : '[document.first_publication_date desc]', lang: props.locale }
		).then(function(response) {
			that.setState({
					fetchingRecentPosts: false,
					recentPosts: processRecentPosts(response.results)
				})
		});
	}
	componentWillUnmount(){
		clearInterval(this.scrollInterval);
		this.scrollInterval = null;
	}

	fetchPage(props) {
		let that = this;
		that.setState({fetchingPage: true});
		window.scrollTo(0, 0);
		props.prismicCtx.api.getByID(props.uid).then((page, err) => {
			that.setState({fetchingPage: false, page: processHomepageData(page.data)})
		});
  }
	render() {
		const {locale} = this.props
		if (!this.state.fetchingPage) {
			const pageData = this.state.page;
			const {userData : user  = {}, sendContactMessageInfo = {}} = this.props;
			return (
				<div id="homepage">

				<div class={style.infoContainer}>	
						<InfoComponent mainSection={pageData.mainSection} appLink={appLink} locale={locale}/>
					</div>

					<div class={style.photoContainer}>
						<PhotoCards cards = {pageData.experts}/>
					</div>

					{ pageData.howItWorks && [
						<Element name='howWorksElement'  />,
						<HowWorksDetails content={pageData.howItWorks} appLink={appLink} locale={locale}/>,
					]}

					<FeaturedServices services={pageData.services} title={pageData.servicesTitle}/>

					<div class={style.iosAppSection}>
						<AppDetails appLink={appLink} content={pageData.app}/>
					</div>

					<div class={style.faqContainer}>
						<Element name="FAQElement"></Element>
						<LandingFAQ headerFAQ={langPack[locale].HOMEPAGE_FAQ_TITLE} locale={locale} faqs={pageData.faqs}/>
					</div>

					<div class={style.proWrapper}>
						<Element name='becomeProElement' />
						<ProDetails content={pageData.becomePro} locale={locale} appLink={appLink} />
					</div>

					<div class={`${style.blogContainer} uk-container`}>
						<Element name="blogElement"></Element>
						<div class={style.header}>{langPack[locale].BLOG_TITLE}</div>
						{ !this.state.fetchingFeaturedPost && !this.state.fetchingRecentPosts && (
							<BlogArticles locale={locale} articles = {this.state.recentPosts} featured = {this.state.featuredPost} />
						)}
						
						
					</div>
					<Element name="contactUsElement"></Element>					
					<ContactForm ref={ref=> this.contactUs = ref} 
						locale={locale}
						sendData={this.props.sendContactData} 
						clearContactData={this.props.clearContactData}
						info={sendContactMessageInfo}/>

					<ScrollToTop showUnder={150} style={{zIndex: 1002}}>
						<div class='top-btn'><FontAwesome name='angle-up' size='2x'/></div>
					</ScrollToTop>
				</div>

			);
		}
		return (
			<div  className="uk-container uk-container-small">
				<Spinner />
			</div>

		);

	}
}

const mapStateToProps = (state) => ({
	hiddenSearchBox: state.hiddenSearchBox,
	verifySuccess: state.verifySuccess,
	verifyFailure: state.verifyFailure,
	userData: state.loggedInUser,
	sendContactMessageInfo: state.sendContactMessage,
	locale: state.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	hideSearchBox,
	verify,
	sendContactData,
	clearContactData,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage);
