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

// mock-data
import { photoCards, serviceCards, landingFAQ, blogArtilces, autoprintWords } from './mock-data';

import { processHomepagePosts, processPostThumbnailData, processHomepageData } from '../../utils/prismic-middleware';

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
			((hash.indexOf('contact-us') + 1) &&
				(this.scrollInterval = setInterval(() => {
					this.contactUs !== null && (
						scroller.scrollTo('contactUsElement', {
							spy: true,
							smooth: true,
							duration: 500,
						}),
						clearInterval(this.scrollInterval),
						this.scrollInterval = null
					)
				}, 100))),
			(hash.indexOf('faq') + 1) &&
				(this.scrollInterval = setInterval(() => {
					this.contactUs !== null && (
						scroller.scrollTo('FAQElement', {
							spy: true,
							smooth: true,
							duration: 500,
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
							offset: -30,
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
							offset: -70,
						}),
						clearInterval(this.scrollInterval),
						this.scrollInterval = null
					)
				}, 100))
		)
	}
	componentDidMount(){
	//	window.scrollTo(0, 0);
		this.fetchPage();
		this.fetchRecentPosts();
		this.fetchFeatuedPost();
		if (typeof this.props.token != 'undefined') {
			this.props.verify(this.props.token)
		}
		this.scrollToContact();
	}
	componentWillReceiveProps(nextProps){
		if (this.props.prismicCtx == null && nextProps.prismicCtx != null) {
			this.fetchPage(nextProps);
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
	fetchFeatuedPost(){
		let that = this;
		that.props.prismicCtx.api.query([
			Prismic.Predicates.at('document.type', 'blog_post'),
			Prismic.Predicates.at('document.tags', ['featured'])
		],
		{ orderings : '[document.first_publication_date desc]' }
		).then(function(response) {
			that.setState({
					fetchingFeaturedPost: false,
					featuredPost: processPostThumbnailData(response.results[0])
				})
		});
	}
	fetchRecentPosts(props){
		let that = this;
		that.props.prismicCtx.api.query([
			Prismic.Predicates.at('document.type', 'blog_post'),
			Prismic.Predicates.not('document.tags', ['featured'])
		],
		{ pageSize: 4, orderings : '[document.first_publication_date desc]' }
		).then(function(response) {
			that.setState({
					fetchingRecentPosts: false,
					recentPosts: processHomepagePosts(response.results)
				})
		});
	}
	componentWillUnmount(){
		clearInterval(this.scrollInterval);
		this.scrollInterval = null;
	}

	fetchPage() {
		let that = this;
		this.props.prismicCtx.api.getByID(that.props.uid).then((page, err) => {
			that.setState({fetchingPage: false, page: processHomepageData(page.data)})
		});
  }
	render() {
		if (!this.state.fetchingPage) {
			const pageData = this.state.page;
			const {userData : user  = {}, sendContactMessageInfo = {}} = this.props;
			return (
				<div id="homepage">

					<div class={style.infoContainer}>	
						<InfoComponent mainSection={pageData.mainSection} appLink={appLink}/>
					</div>

					<div class={style.photoContainer}>
						<PhotoCards cards = {pageData.experts}/>
					</div>

					<Element name='howWorksElement'  />
					<HowWorksDetails content={pageData.howItWorks} appLink={appLink}/>

					<FeaturedServices services={pageData.featuredServices} />

					<div class={style.iosAppSection}>
						<AppDetails appLink={appLink} content={pageData.app}/>
					</div>

					<div class={style.faqContainer}>
						<Element name="FAQElement"></Element>
						<LandingFAQ faqs={pageData.faqs}/>
					</div>

					<div class={style.proWrapper}>
						<Element name='becomeProElement' />
						<ProDetails content={pageData.becomePro} appLink={appLink} />
					</div>

					<div class={`${style.blogContainer} uk-container`}>
						<div class={style.header}>Blog</div>
						{ !this.state.fetchingFeaturedPost && !this.state.fetchingRecentPosts && (
							<BlogArticles articles = {this.state.recentPosts} featured = {this.state.featuredPost} />
						)}
						
						
					</div>
					<Element name="contactUsElement"></Element>					
					<ContactForm ref={ref=> this.contactUs = ref} 
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
			<div  className="uk-container uk-container-small" id="staticPage" >
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
	sendContactMessageInfo: state.sendContactMessage
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
