import {h, Component} from 'preact';
import Helmet from 'preact-helmet';
import {bindActionCreators} from 'redux';
import {connect} from 'preact-redux';
import {hideSearchBox} from '../../actions';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import Spinner from '../../components/global/spinner';
import ScrollToTop from 'react-scroll-up';
import FontAwesome from 'react-fontawesome';
import {route} from 'preact-router';

//import BlogImage from '../../components/blog/blog-image';
//import BlogArticles from '../../components/new-landing/blog-articles';

import {verify, sendContactData, clearContactData} from '../../actions/user';
import style from './style.scss';

// mock-data
import {blogImages, blogArtilces} from './mock-data';
import {apiRoot} from "../../api";

class BlogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: null,
      notFound: false,
      verifyFailure: false
    }
  }

  componentDidMount() {
    //	window.scrollTo(0, 0);
    //	this.fetchPage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    /*		if (this.props.prismicCtx == null && nextProps.prismicCtx != null) {
          this.fetchPage(nextProps);
        }*/
    /*
        if (nextProps.verifySuccess) {
          route('/log-in');
        }

        if (nextProps.verifyFailure) {
          this.setState({
            verifyFailure: true
          })
        }*/

  }

  /*	componentWillUnmount(){
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }*/

  /*
    fetchPage(props) {
      if (props.prismicCtx) {
        // We are using the function to get a document by its uid
        return props.prismicCtx.api.getByID(props.uid).then((doc, err) => {
          if (doc) {
            // We put the retrieved content in the state as a doc variable
            this.setState({ doc });
          } else {
            // We changed the state to display error not found if no matched doc
            this.setState({ notFound: !doc });
          }
        });
        /!*
        return props.prismicCtx.api.query('').then(function(response) {
           console.log(response);
        });*!/
      }
      return null;
    }
  */

  render() {
    //	if (this.state.doc) {
    return (
      <div id="blog">

        <div class={`${style.blogHeader} uk-container`}>
          <div class={style.title}>Freelancers eat large consulting firms for breakfast</div>
          <div class={style.date}>NOVEMBER 23, 2018</div>
        </div>

        <div class={style.blogImage} style={{
          background: "url('../../assets/blog/article-01.png') no-repeat center",
          backgroundSize: "auto 100%"
        }}></div>

        <div class={`${style.blogText} ${style.blogTextMain} ${style.blogDecoration} uk-container`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis vitae felis sit amet malesuada. Sed ut
          pulvinar justo. Suspendisse in metus sit amet magna ornare porttitor. Aenean non mauris id quam pretium
          ultricies non non dui. Vestibulum sagittis a ipsum ut aliquet. Curabitur dignissim lectus nec eros venenatis,
          nec ultricies odio lacinia. Sed vel erat vitae felis dictum viverra egestas vel massa. Quisque cursus, est a
          aliquam dictum, justo libero dapibus augue.
        </div>

        <div class={`${style.blogText} uk-container`}>
          <p>Curabitur eleifend semper nisi id molestie. Donec interdum, nibh ut interdum mollis, neque leo tempus
            turpis,
            vel luctus lectus purus at dui. Vivamus vel sapien ac ligula elementum dapibus sed ac orci. Lorem ipsum
            dolor
            sit amet, consectetur adipiscing elit. Aliquam et felis nunc. <a href="#">Cras blandit</a> orci pellentesque
            elit maximus
            finibus. Morbi ac volutpat lacus, eget consectetur velit. Integer sodales metus vitae dolor tincidunt, at
            pulvinar neque lacinia. Duis a vulputate velit. In eu sodales augue. Etiam nec pellentesque nisi. Proin sed
            libero vitae est dapibus dictum sed nec libero. Nulla facilisi. Ut sed vehicula ex, quis lacinia metus. <b>Sed
              ullamcorper in velit ac mattis.</b></p>
          <p>Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
            sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
            Suspendisse congue diam nec ipsum sagittis rutrum. Sed in eros dolor. Mauris commodo rhoncus varius.
            <a href="#">Vestibulum pharetra</a> mi nec ornare efficitur. Vivamus nibh ante, faucibus mollis diam nec,
            iaculis ornare arcu.
            Integer convallis lectus lorem, eu consequat elit faucibus quis.</p>
        </div>


        <div class={`${style.blogQuote} uk-container`}>
          <blockquote>
            Fusce dignissim sem sodales tincidunt iaculis. Quisque tempus eu magna a posuere. Proin aliquam, nunc non
            dapibus ultricies, orci nibh aliquam justo, sit amet congue dui libero ac dui. Sed quis diam in metus mattis
            mollis ac ut enim. Aliquam congue condimentum est sit amet vulputate.
          </blockquote>
          <p class={style.blogAuthorName}>JOHN DOE, THE WASHINGTON POST</p>
        </div>

        <div class={`${style.blogText} uk-container`}>
          Curabitur eleifend semper nisi id molestie. Donec interdum, nibh ut interdum mollis, neque leo tempus turpis,
          vel luctus lectus purus at dui. Vivamus vel sapien ac ligula elementum dapibus sed ac orci. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Aliquam et felis nunc. Cras blandit orci pellentesque elit maximus
          finibus. Morbi ac volutpat lacus, eget consectetur velit. Integer sodales metus vitae dolor tincidunt, at
          pulvinar neque lacinia. Duis a vulputate velit. In eu sodales augue. Etiam nec pellentesque nisi. Proin sed
          libero vitae est dapibus dictum sed nec libero. Nulla facilisi. Ut sed vehicula ex, quis lacinia metus. Sed
          ullamcorper in velit ac mattis.
        </div>

        <div class={style.blogImage} style={{
          background: "url('../../assets/blog/article-02.png') no-repeat center",
          backgroundSize: "auto 100%"
        }}></div>

        <div class={`${style.blogText} ${style.blogDecoration} uk-container`}>
          Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
          sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
          Suspendisse congue diam nec ipsum sagittis rutrum. Sed in eros dolor. Mauris commodo rhoncus varius.
          Vestibulum pharetra mi nec ornare efficitur. Vivamus nibh ante, faucibus mollis diam nec, iaculis ornare arcu.
          Integer convallis lectus lorem, eu consequat elit faucibus quis.
        </div>

        <div class={`${style.blogAuthor} uk-container`}>
          <h3>About the Author</h3>
          <div class={style.blogAuthorInner}>
            <div class={style.blogAuthorAvatar}>
              <img src="/assets/experts/expert2.png" alt="" />
            </div>
  {/*
            {(contact.avatar != null) ? (
            <img src={apiRoot + 'image/' + contact.avatar.id} alt={contact.name + ' ' + contact.lastName} />
          ) : (
            <img src="/assets/nouserimage.jpg" alt={contact.name + ' ' + contact.lastName} />
          )}
  */}
            <div class={style.blogAuthorAbout}>
              <p class={style.blogAuthorInfo}>JOHANNA DOE</p>
              Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
              sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
              Suspendisse congue diam nec ipsum sagittis rutrum.
            </div>
          </div>
        </div>

        <div class={style.blogPosts}>

          <div class={`${style.blogAuthor} uk-container`}>
            <h3>Other posts</h3>
          </div>


          <div class={style.blogPostsSlider}>
            <div class={style.blogPost}>
              <img src="/assets/blog/article-02.png" alt="" />
              <div class={style.blogPostDescription}>
                <p class={style.date}>12.10.2018</p>
                Immigration law as a service
                <button class="red-btn">Full story</button>
              </div>
            </div>

            <div class={style.blogPost}>
              <img src="/assets/blog/article-02.png" alt="" />
              <div class={style.blogPostDescription}>
                <p class={style.date}>12.10.2018</p>
                Immigration law as a service
                <button class="red-btn">Full story</button>
              </div>
            </div>

            <div class={style.blogPost}>
              <img src="/assets/blog/article-02.png" alt="" />
              <div class={style.blogPostDescription}>
                <p class={style.date}>12.10.2018</p>
                Immigration law as a service
                <button class="red-btn">Full story</button>
              </div>
            </div>

            <div class={style.blogPost}>
              <img src="/assets/blog/article-02.png" alt="" />
              <div class={style.blogPostDescription}>
                <p class={style.date}>12.10.2018</p>
                Immigration law as a service
                <button class="red-btn">Full story</button>
              </div>
            </div>

            <div class={style.blogPost}>
              <img src="/assets/blog/article-02.png" alt="" />
              <div class={style.blogPostDescription}>
                <p class={style.date}>12.10.2018</p>
                Immigration law as a service
                <button class="red-btn">Full story</button>
              </div>
            </div>

            <div class={style.blogPost}>
              <img src="/assets/blog/article-02.png" alt="" />
              <div class={style.blogPostDescription}>
                <p class={style.date}>12.10.2018</p>
                Immigration law as a service
                <button class="red-btn">Full story</button>
              </div>
            </div>

          </div>

        </div>

        <div class={style.blogContainer}>
          <div class={`${style.blogComments} uk-container`}>
            <h3>25 Comments</h3>

            <div class={style.blogComment}>
              <div class={style.blogAuthorInner}>
                <div class={style.blogAuthorAvatar}>
                  <img src="/assets/experts/expert2.png" alt="" />
                </div>
                <div class={style.blogAuthorAbout}>
                  <div class={style.blogAuthorInfo}>
                    <div class={style.blogAuthorName}>
                      <span class={style.name}>JOHANNA DOE</span>
                      <span class={style.date}>21.05.2018</span>
                    </div>
                    <button class={style.blogCommentReply}>Reply</button>
                  </div>
                  Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
                  sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
                  Suspendisse congue diam nec ipsum sagittis rutrum.
                </div>
              </div>

              <div class={style.blogComment}>
                <div class={style.blogAuthorInner}>
                  <div class={style.blogAuthorAvatar}>
                    <img src="/assets/experts/expert1.png" alt="" />
                  </div>
                  <div class={style.blogAuthorAbout}>
                    <div class={style.blogAuthorInfo}>
                      <div class={style.blogAuthorName}>
                        <span class={style.name}>JOHANNA DOE</span>
                        <span class={style.date}>21.05.2018</span>
                      </div>
                      <button class={style.blogCommentReply}>Reply</button>
                    </div>
                    Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
                    sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
                    Suspendisse congue diam nec ipsum sagittis rutrum.
                  </div>
                </div>
              </div>
{/*
              <div class={style.blogComment}>
                <div class={style.blogAuthorInner}>
                  <div class={style.blogAuthorAvatar}>
                    <img src="/assets/experts/expert2.png" alt="" />
                  </div>
                  <div class={style.blogAuthorAbout}>
                    <div class={style.blogAuthorInfo}>
                      <div class={style.blogAuthorName}>
                        <span class={style.name}>JOHANNA DOE</span>
                        <span class={style.date}>21.05.2018</span>
                      </div>
                      <button class={style.blogCommentReply}>Reply</button>
                    </div>
                    Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
                    sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
                    Suspendisse congue diam nec ipsum sagittis rutrum.
                  </div>
                </div>

                <div class={style.blogComment}>
                  <div class={style.blogAuthorInner}>
                    <div class={style.blogAuthorAvatar}>
                      <img src="/assets/nouserimage.jpg" alt="" />
                    </div>
                    <div class={style.blogAuthorAbout}>
                      <div class={style.blogAuthorInfo}>
                        <div class={style.blogAuthorName}>
                          <span class={style.name}>JOHANNA DOE</span>
                          <span class={style.date}>21.05.2018</span>
                        </div>
                        <button class={style.blogCommentReply}>Reply</button>
                      </div>
                      Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
                      sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
                      Suspendisse congue diam nec ipsum sagittis rutrum.
                    </div>
                  </div>

                  <div class={style.blogComment}>
                    <div class={style.blogAuthorInner}>
                      <div class={style.blogAuthorAvatar}>
                        <img src="/assets/nouserimage.jpg" alt="" />
                      </div>
                      <div class={style.blogAuthorAbout}>
                        <div class={style.blogAuthorInfo}>
                          <div class={style.blogAuthorName}>
                            <span class={style.name}>JOHANNA DOE</span>
                            <span class={style.date}>21.05.2018</span>
                          </div>
                          <button class={style.blogCommentReply}>Reply</button>
                        </div>
                        Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
                        sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
                        Suspendisse congue diam nec ipsum sagittis rutrum.
                      </div>
                    </div>
                  </div>

                </div>
              </div>
*/}
            </div>

            <div class={style.blogComment}>
              <div class={style.blogAuthorInner}>
                <div class={style.blogAuthorAvatar}>
                  <img src="/assets/nouserimage.jpg" alt="" />
                </div>
                <div class={style.blogAuthorAbout}>
                  <div class={style.blogAuthorInfo}>
                    <div class={style.blogAuthorName}>
                      <span class={style.name}>JOHANNA DOE</span>
                      <span class={style.date}>21.05.2018</span>
                    </div>
                    <button class={style.blogCommentReply}>Reply</button>
                  </div>
                  Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
                  sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
                  Suspendisse congue diam nec ipsum sagittis rutrum.
                </div>
              </div>
            </div>

            <div class={style.blogComment}>
              <div class={style.blogAuthorInner}>
                <div class={style.blogAuthorAvatar}>
                  <img src="/assets/experts/expert2.png" alt="" />
                </div>
                <div class={style.blogAuthorAbout}>
                  <div class={style.blogAuthorInfo}>
                    <div class={style.blogAuthorName}>
                      <span class={style.name}>JOHANNA DOE</span>
                      <span class={style.date}>21.05.2018</span>
                    </div>
                    <button class={style.blogCommentReply}>Reply</button>
                  </div>
                  Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu luctus odio nulla ac libero. Cras
                  sagittis eget lacus in aliquam. Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
                  Suspendisse congue diam nec ipsum sagittis rutrum.
                </div>
              </div>
            </div>
          </div>

          <div class={style.blogCommentAdd}>
            <h3>Add Comment</h3>
            <form action="">
              <div class={style.blogAuthorInner}>
                <div class={style.blogAuthorAvatar}>
                  <img src="/assets/experts/expert2.png" alt="" />
                </div>
                <div class={style.blogCommentType}>
                  <textarea rows="12"></textarea>
                </div>
              </div>
              <div class={style.blogCommentAddButton}>
                <button class="red-btn">Post comment</button>
              </div>
            </form>
          </div>
        </div>

        <ScrollToTop showUnder={150} style={{zIndex: 1002}}>
          <div class='top-btn'><FontAwesome name='angle-up' size='2x'/></div>
        </ScrollToTop>

      </div>

    );
    //}
    /*		return (
          <div  className="uk-container uk-container-small" id="staticPage" >
            <Spinner />
          </div>

        );*/

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
)(BlogPage);
