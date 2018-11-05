import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import Spinner from '../../components/global/spinner';
import ScrollToTop from 'react-scroll-up';
import FontAwesome from 'react-fontawesome';
import { route } from 'preact-router';
import BlogPosts from '../../components/blog/blog-posts';
import BlogComments from '../../components/blog/blog-comments';

import PostDecorationText from '../../components/blog/post-decoration-text';
import PostText from '../../components/blog/post-text';
import PostQuote from '../../components/blog/post-quote';
import PostImage from '../../components/blog/post-image';


import { verify, sendContactData, clearContactData } from '../../actions/user';
import style from './style.scss';

// mock-data
import { blogComments } from './mock-data';

import { processPostData, processRecentPosts } from '../../utils/prismic-middleware';


class BlogPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingPost: true,
			fetchingRecentPosts: true
		}
		this.fetchPost = this.fetchPost.bind(this);
		this.fetchRecentPosts = this.fetchRecentPosts.bind(this);
	}
	componentWillReceiveProps(nextProps){
		if (this.props.prismicCtx == null && nextProps.prismicCtx != null) {
			this.fetchPost(nextProps);
			this.fetchRecentPosts(nextProps);
		}
	}
	componentDidMount() {
		window.scrollTo(0,0)
		this.fetchPost(this.props);
		this.fetchRecentPosts(this.props);
	}
	fetchPost(props) {
		let that = this;
		if (props.prismicCtx) {
			props.prismicCtx.api.getByUID('blog_post', that.props.uid).then((post, err) => {
				that.setState({ fetchingPost: false, post: processPostData(post.data) })
			});
		}
		
	}
	fetchRecentPosts(props) {
		let that = this;
		props.prismicCtx.api.query([
			Prismic.Predicates.at('document.type', 'blog_post')
		],
		{ pageSize: 10, orderings : '[document.first_publication_date desc]' }
		).then(function(response) {
			that.setState({
				fetchingRecentPosts: false,
				recentPosts: processRecentPosts(response.results)
			})
		});
		
	}
	componentWillReceiveProps(nextProps) {

	}

	render() {
		if (!this.state.fetchingPost) {
			const post = this.state.post;
			const postBody = post.body;
			return (
				<div id="blog">
				
					<div class={`${style.blogHeader} uk-container`}>
						<div class={style.title}>
							{ post.title }
						</div>
						<div class={style.date}>{ post.date }</div>
					</div>

          <div class={style.blogArticle}>
					{postBody.map((content)=>{
						switch (content.slice_type) {
							case 'text':
								return (<PostText content={content} />)
								break;

							case 'image_with_caption':
								return (<PostImage content={content} />)
								break;

							case 'quote':
								return (<PostQuote content={content} />)
								break;

							case 'text_with_decoration':
								return (<PostDecorationText content={content} />)
								break;
						}
					})}
					</div>

					<div class={`${style.blogAuthor} uk-container`}>
						<h3>About the Author</h3>
						<div class={style.blogAuthorInner}>
							<div class={style.blogAuthorAvatar}>
								<img src="/assets/experts/expert2.png" alt="" />
							</div>
							
							<div class={style.blogAuthorAbout}>
								<p class={style.blogAuthorInfo}>JOHANNA DOE</p>
								Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu
								luctus odio nulla ac libero. Cras sagittis eget lacus in aliquam.
								Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
								Suspendisse congue diam nec ipsum sagittis rutrum.
      						</div>
						</div>
					</div>

					{ !this.state.fetchingRecentPosts && this.state.recentPosts.length > 0 && (
						<BlogPosts blogPosts={this.state.recentPosts} />
					)}

{/*
          <BlogComments blogComments={blogComments} />
*/}


					<ScrollToTop showUnder={150} style={{ zIndex: 1002 }}>
						<div class="top-btn">
							<FontAwesome name="angle-up" size="2x" />
						</div>
					</ScrollToTop>
				</div>

    );
		} else {
			<div className="uk-container uk-container-small" id="staticPage" >
				<Spinner />
			</div>
		}
	}
};
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
