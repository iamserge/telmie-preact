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
import TextBlockMain from '../../components/immigration-law/text-block-main'
import AppDetails from '../../components/new-landing/app-details'
import style from '../language-practice/style.scss';
import { route } from 'preact-router';

import { processTextPageData, processReviewsData } from '../../utils/prismic-middleware';
import { changeLocaleLangs, changeLocale } from '../../actions/user';

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
    ((this.props.prismicCtx == null && nextProps.prismicCtx != null) 
      || this.props.uid !== nextProps.uid) && this.fetchPage(nextProps);
  }

  fetchPage = (props) => {
    let that = this;
    window.scrollTo(0, 0);
    that.setState({fetchingPage: true});
    this.props.changeLocaleLangs([]);
    that.props.reviewsUid && this.fetchReviews(props);
    props.uid ?
      props.prismicCtx.api.getByID(props.uid).then((page, err) => {
        (page.lang !== props.locale) && this.props.changeLocale(page.lang);
        that.props.changeLocaleLangs(page.alternate_languages);
        that.setState({fetchingPage: false, page: processTextPageData(page.data)})
      }) : (
				this.props.changeLocale(),
				route(`/${/\/(.+)/.exec(props.path.substring(1))[1]}`, true)
			);
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
      const { locale } = this.props;

      return (
        <div id="language-practice" lang={locale} class="service-page">

          <TextBlockMain content={pageData.becomePro} appLink={appLink} locale={locale}/>

          <HowWorksSteps content={pageData.steps} title={pageData.titles} appLink={appLink} locale={locale}/>

          <TextBlock content={pageData.info} />

          <WhyChooseUs addClass={true} content={pageData.reasons} title={pageData.titles} appLink={appLink} locale={locale}/>

          {/*<HappyUsers content={reviewsData} />*/}

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
)(ImmigrationLaw);
