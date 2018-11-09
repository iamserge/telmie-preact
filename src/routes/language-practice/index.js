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
import AppDetails from '../../components/new-landing/app-details'

import { route } from 'preact-router';
import { verify, sendContactData, clearContactData } from '../../actions/user';
import style from './style.scss';

// mock-data
import { steps } from './mock-data';

import { processRecentPosts, processPostThumbnailData, processHomepageData } from '../../utils/prismic-middleware';

const appLink = 'https://itunes.apple.com/us/app/telmie/id1345950689';

class LanguagePractice extends Component {
  constructor(props){
    super(props);
    this.state =  {
      verifyFailure: false,
      fetchingPage: false
    }

    this.fetchPage = this.fetchPage.bind(this);

  }

  fetchPage(props) {
    let that = this;
    props.prismicCtx.api.getByID(that.props.uid).then((page, err) => {
      console.log(page.data);
      that.setState({fetchingPage: false, page: processHomepageData(page.data)})
    });
  }


  render() {
    if (!this.state.fetchingPage) {
      const pageData = this.state.page;
      const {userData : user  = {}, sendContactMessageInfo = {}} = this.props;
      return (
        <div id="language-practice">

          <HowWorksSteps steps={steps} />

{/*          <div class={style.iosAppSection}>
            <AppDetails appLink={appLink} content={pageData.app} />
          </div>*/}

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
)(LanguagePractice);
