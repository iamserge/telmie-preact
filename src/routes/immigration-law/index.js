import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import Spinner from '../../components/global/spinner';
import { Element, scroller, Link as ScrollLink } from 'react-scroll';
import ScrollToTop from'react-scroll-up'
import FontAwesome from 'react-fontawesome';

import HowWorksSteps from '../../components/language-practice/how-works-steps'
import WhyChooseUs from '../../components/language-practice/why-choose-us'
import HappyUsers from '../../components/language-practice/happy-users'
import TextBlock from '../../components/language-practice/text-block'
import TextBlockMain from '../../components/immigration-law/text-block-main'
import AppDetails from '../../components/new-landing/app-details'
import style from '../language-practice/style.scss';

import { processTextPageData, processReviewsData } from '../../utils/prismic-middleware';

const appLink = 'https://itunes.apple.com/us/app/telmie/id1345950689';

class ImmigrationLaw extends Component {
  constructor(props){
    super(props);
    this.state =  {
      page: null,
      notFound: false,
      fetchingPage: true,
    }
  }

  componentDidMount(){
    this.props.prismicCtx && this.fetchPage(this.props);
  }
  componentWillReceiveProps(nextProps){
    (this.props.prismicCtx == null 
      && nextProps.prismicCtx != null) && this.fetchPage(nextProps);
  }

  fetchPage = (props) => {
    let that = this;
    that.props.reviewsUid && this.fetchReviews(props);
    props.prismicCtx.api.getByID(that.props.uid).then((page, err) => {
      window.scrollTo(0, 0);
      that.setState({fetchingPage: false, page: processTextPageData(page.data)})
    });
  }

  fetchReviews = (props) => {
    let that = this;
    props.prismicCtx.api.getByID(that.props.reviewsUid).then((page, err) => {
      that.setState({reviews: processReviewsData(page.data)})
    });
  }

  render() {
    if (!this.state.fetchingPage) {
      const pageData = this.state.page;
      const reviewsData = this.state.reviews;

      return (
        <div id="language-practice">

          <TextBlockMain content={pageData.becomePro} appLink={appLink} />

          <Element name="howWorksElement" />
          <HowWorksSteps content={pageData.steps} appLink={appLink} />

          <TextBlock content={pageData.info} />

          <WhyChooseUs content={pageData.reasons} appLink={appLink} />

          <HappyUsers content={reviewsData} />

          <Element name="AppDetails" />
          <div class={style.iosAppSection}>
            <AppDetails appLink={appLink} content={pageData.app} />
          </div>

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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImmigrationLaw);
