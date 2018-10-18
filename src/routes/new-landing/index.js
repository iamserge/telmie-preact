import { h, Component } from 'preact';
//import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
/*import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';*/
import Spinner from '../../components/global/spinner';
import Video from '../../components/homepage/video';

import PhotoCards from '../../components/new-landing/photo-cards'
import LandingFAQ from '../../components/new-landing/landing-faq'
import ServiceCard from '../../components/new-landing/service-card'
import BlogArticles from '../../components/new-landing/blog-articles'
import AutoPrintText from '../../components/new-landing/auto-print-text'

import { route } from 'preact-router';
import { verify } from '../../actions/user';
import style from './style.scss';

// mock-data
import { photoCards, serviceCards, landingFAQ, blogArtilces, autoprintWords } from './mock-data.js'

class NewLanding extends Component {
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
		if (this.state.doc) {
			const pageData = this.state.doc.data;
			return (
				<div id="homepage" style={{paddingTop: 100}}>

						<div class={`${style.infoContainer} uk-container`}>
							<div class={style.title}>
                                Video-calls with <AutoPrintText words={autoprintWords}/> experts
                            </div>
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
							<div class={style.howWorksVideo}>
								<Video videoId = { pageData.main_video.video_id } />
							</div>
						</div>

						<div class={`${style.featuredServices} uk-container`}>
							<div class={style.header}>Featured Services</div>
							<div class={style.services}>
							{serviceCards.map(card => (
								<ServiceCard key={card.serviceName} {...card}/>
							))}
							</div>
						</div>

						<div class={style.iosAppSection}>
                            <div class={`uk-container ${style.iosAppContainer}`}>
                                <div class={style.textContent}>
                                    <div class={style.header}>Easy to use iOS app</div>
                                    <div class={style.subHeader}>With the Telmie iOS app you can browse experts, arrange video calls and get real-time advice wherever, whenever.</div>
                                    <div class={style.btn}>
                                        <img src='/assets/new-landing-page/appStoreCoupon.png' alt=''/>
                                    </div>
                                </div>
                                <div class={style.imgContent}>
                                    <img class={style.appScreen} src='/assets/new-landing-page/appScreen.png' alt="App Screen"/>
                                    <img class={style.combinedShapeLeft} src='/assets/new-landing-page/combinedShape_sq.png' alt=''/>
                                    <img class={style.combinedShapeRight} src='/assets/new-landing-page/combinedShape_sq.png' alt=''/>
                                    <img class={style.polygon_large} src='/assets/new-landing-page/polygon_violet.png' alt=''/>
                                    <img class={style.polygon_small} src='/assets/new-landing-page/polygon_lightBlue.png' alt=''/>
                                </div>
                            </div>
                            
                        </div>

						<LandingFAQ styles={{marginBottom:160}} {...landingFAQ}/>

						<div class={style.proWrapper}>
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

						<div class={style.contuctContainer}>
							<div class={style.header}>Contact us</div>
							<div class={style.subHeader}>Any questions? Drop us a line.</div>
							
							<div class={style.contactForm}>
								<input class='new-input' placeholder='Your name'/>
								<input class='new-input' placeholder='Your email'/>
								<input class='new-input' placeholder='Company'/>
								<input class='new-input' placeholder='Subject'/>
								<input class='new-input' placeholder='Your message'/>
								<button class='red-btn'>Submit</button>
							</div>
						</div>

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
)(NewLanding);
