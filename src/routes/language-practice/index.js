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

import HowWorksSteps from '../../components/language-practice/how-works-steps'
import WhyChooseUs from '../../components/language-practice/why-choose-us'
import HappyUsers from '../../components/language-practice/happy-users'
import TextBlock from '../../components/language-practice/text-block'
import TextBlockMain from '../../components/language-practice/text-block-main'
import AppDetails from '../../components/new-landing/app-details'

import { route } from 'preact-router';
import { verify, sendContactData, clearContactData } from '../../actions/user';
import style from './style.scss';

import { processTextPageData } from '../../utils/prismic-middleware';

const appLink = 'https://itunes.apple.com/us/app/telmie/id1345950689';

class LanguagePractice extends Component {
  constructor(props){
    super(props);
    this.state =  {
      page: null,
      notFound: false,
      verifyFailure: false,
      fetchingPage: true
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
    props.prismicCtx.api.getByID(that.props.uid).then((page, err) => {
     // console.log('info',page.data);
      that.setState({fetchingPage: false, page: processTextPageData(page.data)})
    });
  }


  render() {
    if (!this.state.fetchingPage) {
      const pageData = this.state.page;

      return (
        <div id="language-practice">

          <TextBlockMain content={pageData.becomePro} appLink={appLink} />

          <HowWorksSteps content={pageData.steps} appLink={appLink} />

          <TextBlock content={pageData.info} />

          <WhyChooseUs content={pageData.reasons} appLink={appLink} />

          <HappyUsers content={pageData.reviews} />

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
    sendContactMessageInfo: state.sendContactMessage
});

const mapDispatchToProps = dispatch => bindActionCreators({
  hideSearchBox,
  verify,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePractice);
