import { h, Component } from 'preact';
//import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
/*import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';*/
import Spinner from '../../components/global/spinner';
/*import Search from '../../components/global/search';
import HomeTitle from '../../components/homepage/home-title';
import Counters from '../../components/homepage/counters';
import FeaturedPros from '../../components/homepage/featured-pros';
import FeaturedServices from '../../components/homepage/featured-services';*/
import Video from '../../components/homepage/video';
/*import MoreInfo from '../../components/homepage/more-info';*/

import PhotoCards from '../../components/homepage/photo-cards'
import LandingFAQ from '../../components/homepage/landing-faq'
import ServiceCard from '../../components/service-card'
import BlogArticles from '../../components/blog-articles'

import { route } from 'preact-router';
import { verify } from '../../actions/user';
import style from './style.scss';

// mock-data
import { photoCards, serviceCards, landingFAQ, blogArtilces } from './mock-data.js'

class HomePage extends Component {
	constructor(props){
		super(props);
		this.state =  {
	    doc: null,
	    notFound: false,
			verifyFailure: false
	  }
	}
	componentDidMount(){
	//	window.scrollTo(0, 0);
		this.fetchPage(this.props);
		if (typeof this.props.token != 'undefined') {
			this.props.verify(this.props.token)
		}
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

	fetchPage(props) {
    if (props.prismicCtx) {
      // We are using the function to get a document by its uid
      return props.prismicCtx.api.getByID(props.uid).then((doc, err) => {
        if (doc) {
					console.log('doc',doc);
          // We put the retrieved content in the state as a doc variable
          this.setState({ doc });
        } else {
          // We changed the state to display error not found if no matched doc
          this.setState({ notFound: !doc });
        }
      });
			/*
			return props.prismicCtx.api.query('').then(function(response) {
			   console.log(response);
			});*/
    }
    return null;
  }
	render() {
		console.log('props',this.props);
		console.log('state', this.state);
		if (this.state.doc) {
			const pageData = this.state.doc.data;
			const {userData : user  = {}} = this.props;
    	const isLogin = Object.keys(user).length !== 0;
			return (
				<div id="homepage">

						<div class={`${style.infoContainer} uk-container`}>
							<div class={style.title}>Video-calls with photography experts</div>
							<div class={style.subTitle}>Telmie is the best way to find an expert that you can trust. <br/> Find. Contact. Engage. As simple as that.</div>

							<button class='red-btn'>Download app</button>
							{/*<button class='white-btn'>Sign up free</button>*/}
						</div>

						<PhotoCards cards = {photoCards} styles={{marginBottom:160}}/>

						<div class={`${style.howWorksContainer} uk-container`}>
							<div class={style.howWorksText}>
								<div class={style.header}>How it works</div>
								<div style={{marginBottom: 40}}>Telmie is a social app that connects experts with advice-seekers quickly and easily over video. It's the fastest, easiest and most trusted way of finding whatever advice you require.</div>
								<button class='red-btn'>Download app</button>
							</div>
							<div>
								<Video videoId = { pageData.main_video.video_id } />
							</div>
						</div>

						<div class={`${style.featuredServices} uk-container`}>
							<div class={style.header}>Featured Services</div>
							{serviceCards.map(card => (
								<ServiceCard key={card.serviceName} {...card}/>
							))}
						</div>

						<div class='uk-container' style={{marginBottom: 55}}>Easy to use iOS app</div>

						<LandingFAQ styles={{marginBottom:160}} {...landingFAQ}/>

						<div style={{backgroundColor: 'rgb(245,246,248)', paddingTop: 100, marginBottom: 125}}>
							<div class={`uk-container ${style.proContainer}`}>
								<div class={style.textContent}>
									<div class={style.header}>Earn more money from your expert knowledge. 10% fees, no hidden charges.</div>
									<div class={style.content}>Become an expert and share your knowledge with others. Expand your client base, streamline bookings and payments. Save time and cut overheads by providing services online.</div>
									<button class='red-btn'>Sign up & Become Pro</button>
								</div>
								<div class={style.imgContent}>
									<img class={style.girl_pro} src='/assets/new-landing-page/girl_pro.png' alt=''/>
									<img class={style.polygon_small} src='/assets/new-landing-page/polygon.png' alt='' height="33" width="33"/>
									<img class={style.polygon_medium} src='/assets/new-landing-page/polygon.png' alt=''/>
									<img class={style.polygon_large} src='/assets/new-landing-page/polygon_red.png' alt=''/>
									<img class={style.combinedShape} src='/assets/new-landing-page/combinedShape.png' alt=''/>
								</div>
							</div>
						</div>

						<div class={`${style.blogContainer} uk-container`}>
							<div class={style.header}>Blog</div>
							<BlogArticles articles = {blogArtilces}/>
						</div>

						{/*
						{ typeof pageData.main_title != 'undefined' && pageData.main_title.length > 0 && typeof pageData['main_sub-title'] != 'undefined' && pageData['main_sub-title'].length > 0 && (
							<HomeTitle
								main_title = { pageData.main_title[0].text }
								main_sub-title = { pageData["main_sub-title"][0].text }
								/>
						) }
					  <Search hiddenSearchBox = {this.props.hiddenSearchBox} hideSearchBox = { this.props.hideSearchBox } isLogin={isLogin} home= { true }/>
						<Counters counters = {pageData.counters} />
						<Video videoId = { pageData.main_video.video_id } />
						<FeaturedServices services = { pageData.featured_services } servicesIcons = { pageData.services_icons} />
						<FeaturedPros pros = { pageData.featured_pros } />


						<MoreInfo />

					*/}
						{this.state.verifyFailure && (
							<div>

								<div className="modal" onClick={()=>{this.setState({verifyFailure: false})}}>
									<a class="uk-modal-close uk-close"></a>
								</div>
								<div className="modalInner">
									<h2>Account activation</h2>
									<span>Unfortunately, we could not activate your account. Please, try again or contact us at <a href="mailto:support@telmie.com">support@telmie.com</a></span>
								</div>
							</div>
						)}
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
	userData: state.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({
	hideSearchBox,
	verify
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage);
