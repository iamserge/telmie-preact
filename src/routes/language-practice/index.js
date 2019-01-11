import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import Spinner from '../../components/global/spinner';
import ScrollToTop from'react-scroll-up'
import FontAwesome from 'react-fontawesome';

import HowWorksSteps from '../../components/language-practice/how-works-steps'
import WhyChooseUs from '../../components/language-practice/why-choose-us'
import HappyUsers from '../../components/language-practice/happy-users'
import TextBlock from '../../components/language-practice/text-block'
import TextBlockMain from '../../components/language-practice/text-block-main'
import AppDetails from '../../components/new-landing/app-details'
import { route } from 'preact-router';

import style from './style.scss';

import { processTextPageData, processReviewsData, getPage } from '../../utils/prismic-middleware';
import { changeLocaleLangs, changeLocale } from '../../actions/user';

class LanguagePractice extends Component {
  constructor(props){
    super(props);
    this.state =  {
      page: null,
      notFound: false,
      fetchingPage: true
    }
  }

  componentDidMount(){
      this.props.prismicCtx && this.fetchPage(this.props);
  }
  componentWillReceiveProps(nextProps){
    ((this.props.prismicCtx == null && nextProps.prismicCtx != null) 
      || this.props.locale !== nextProps.locale
      || (this.props.path !== nextProps.path)) && this.fetchPage(nextProps);
	}

  fetchPage = async (props) => {
    window.scrollTo(0, 0);
    this.setState({fetchingPage: true});
    props.changeLocaleLangs([]);
    props.reviewsUid && this.fetchReviews(props);

    const page = await getPage(props);
		page && this.setState({fetchingPage: false, page: processTextPageData(page.data)});
  };

  fetchReviews = (props) => {
    let that = this;
    props.prismicCtx.api.getByID(that.props.reviewsUid).then((page, err) => {
      that.setState({reviews: processReviewsData(page.data)})
    });
  }

  ga = () => ({
    downloadApp: () => {
      gtag('event', 'conversion', { 'send_to': 'AW-820107229/36HzCPn7lJABEN2vh4cD'});
      window.open(appLink);
    }
  })

  render() {
    if (!this.state.fetchingPage) {
      const pageData = this.state.page;
      const reviewsData = this.state.reviews;
      const { locale } = this.props;

      return (
        <div id="language-practice" lang={locale} class="service-page">

          <TextBlockMain content={pageData.becomePro} dBtn = {pageData.downloadBtn}/>

          <HowWorksSteps content={pageData.steps} title={pageData.titles} dBtn = {pageData.downloadBtn}/>

          <TextBlock content={pageData.info} />

          <WhyChooseUs content={pageData.reasons} title={pageData.titles} dBtn = {pageData.downloadBtn} />

          {/*<HappyUsers content={reviewsData} />*/}

          <div class={style.iosAppSection}>
            <AppDetails content={pageData.app} />
          </div>


          <ScrollToTop showUnder={150} style={{zIndex: 1002, bottom: 100, right: 38}}>
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
    locale: state.locale.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changeLocaleLangs,
  changeLocale,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePractice);
