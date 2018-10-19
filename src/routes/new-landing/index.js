import { h, Component } from 'preact';
//import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
/*import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';*/
import Spinner from '../../components/global/spinner';

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

						<InfoComponent wordsToPrint={autoprintWords}/>

						<div class={style.photoContainer}>
							<PhotoCards cards = {photoCards}/>
						</div>

						<HowWorksDetails videoId={pageData.main_video.video_id} />

						<FeaturedServices serviceCards={serviceCards} />

						<div class={style.iosAppSection}>
                            <AppDetails />
                        </div>

						<div class={style.faqContainer}>
							<LandingFAQ {...landingFAQ}/>
						</div>

						<div class={style.proWrapper}>
							<ProDetails />
						</div>

						<div class={`${style.blogContainer} uk-container`}>
							<div class={style.header}>Blog</div>
							<BlogArticles articles = {blogArtilces}/>
						</div>

						<ContactForm />

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
