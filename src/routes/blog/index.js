import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import Spinner from '../../components/global/spinner';
import ScrollToTop from 'react-scroll-up';
import { animateScroll as scroll } from 'react-scroll'
import FontAwesome from 'react-fontawesome';
import { route } from 'preact-router';
import BlogPosts from '../../components/blog/blog-posts';
import BestComment from '../../components/blog/blog-best-comment';
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
		if ((this.props.prismicCtx == null && nextProps.prismicCtx != null)
			|| (this.props.uid !== nextProps.uid)) {
			this.fetchPost(nextProps);
			this.fetchRecentPosts(nextProps);
		}
	}
	componentDidMount() {
		window.scrollTo(0,0);
		this.fetchPost(this.props);
		this.fetchRecentPosts(this.props);
	}
	fetchPost(props) {
		let that = this;

		props.prismicCtx && props.prismicCtx.api.getByUID('blog_post', props.uid).then((post, err) => {
			scroll.scrollToTop();
			that.setState({ fetchingPost: false, post: processPostData(post.data) })
		});
		
	}
	fetchRecentPosts(props) {
		let that = this;
		props.prismicCtx && props.prismicCtx.api.query([
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
							case 'image_with_caption':
								return (<PostImage content={content} />)
							case 'quote':
								return (<PostQuote content={content} />)
							case 'text1':
								return (<PostDecorationText content={content} />)
						}
					})}
					</div>

{/*
          <BestComment />
*/}

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
			return (
			<div className="uk-container uk-container-small" id="staticPage" >
				<Spinner />
			</div>)
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
