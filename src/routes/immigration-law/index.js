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
import TextBlockMain from '../../components/immigration-law/text-block-main'

import { route } from 'preact-router';
import { verify, sendContactData, clearContactData } from '../../actions/user';
import style from './style.scss';

// mock-data
import { steps, reasons, reviews, texts, textMain } from './mock-data';

import { processRecentPosts, processPostThumbnailData, processHomepageData } from '../../utils/prismic-middleware';

const appLink = 'https://itunes.apple.com/us/app/telmie/id1345950689';

class ImmigrationLaw extends Component {
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
     // const {userData : user  = {}, sendContactMessageInfo = {}} = this.props;
      return (
        <div id="language-practice">

          <TextBlockMain textMain={textMain} appLink={appLink} />

          <HowWorksSteps steps={steps} />

          <TextBlock text={texts.block1} />

          <TextBlock text={texts.block2} />

          <TextBlock text={texts.block3} />

          <TextBlock text={texts.block4} />

          <WhyChooseUs reasons={reasons} />

          <HappyUsers reviews={reviews} />

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
   // userData: state.loggedInUser,
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
)(ImmigrationLaw);