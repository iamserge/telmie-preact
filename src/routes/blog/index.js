import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
import Prismic from 'prismic-javascript';
import Spinner from '../../components/global/spinner';
import ScrollToTop from 'react-scroll-up';
import { animateScroll as scroll } from 'react-scroll'
import FontAwesome from 'react-fontawesome';
import { route } from 'preact-router';
import BlogPosts from '../../components/blog/blog-posts';
import AuthorInfo from '../../components/blog/author-info';
import BlogComments from '../../components/blog/blog-comments';

import PostDecorationText from '../../components/blog/post-decoration-text';
import PostText from '../../components/blog/post-text';
import PostQuote from '../../components/blog/post-quote';
import PostImage from '../../components/blog/post-image';

import { langRoutes } from "../../components/app";
import { langs } from "../../utils/consts";

import { verify, sendContactData, clearContactData } from '../../actions/user';
import style from './style.scss';

// mock-data
import { blogComments } from './mock-data';

import { processPostData, processRecentPosts } from '../../utils/prismic-middleware';
import { changeLocaleLangs, changeLocale } from '../../actions/user';


class BlogPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingPost: true,
			fetchingRecentPosts: true
		}
	}
	componentWillReceiveProps(nextProps){
		if ((this.props.prismicCtx == null && nextProps.prismicCtx != null)
			|| (this.props.locale !== nextProps.locale)
			|| (this.props.path !== nextProps.path)
			|| (this.props.uid !== nextProps.uid)
		) {
			this.fetchPost(nextProps);
			this.fetchRecentPosts(nextProps);
		}
		if(this.props.locale !== nextProps.locale){
			this.setState({ fetchingPost: true });
			this.changeBlogLang(nextProps.locale);
		}
	}
	componentDidMount() {
		window.scrollTo(0,0);
		this.fetchPost(this.props);
		this.fetchRecentPosts(this.props);
	}
	changeBlogLang = (lang) => {
		let post = this.state.alternate_languages.find(el => el.lang == lang );
		
		route( langRoutes(langs[lang].lang, `/blog/${post.uid}`) );
	}
	fetchPost = (props) => {
		window.scrollTo(0, 0);
		props.changeLocaleLangs([]);
		this.setState({ fetchingPost: true });

		props.prismicCtx && (
			props.uid ? 
				props.prismicCtx.api.getByUID('blog_post', props.uid).then((post, err) => {
					(post.lang !== props.locale) && this.props.changeLocale(post.lang);
					this.props.changeLocaleLangs(post.alternate_languages);
					this.setState({ 
						fetchingPost: false, 
						post: processPostData(post.data, props.locale),
						alternate_languages: post.alternate_languages,
					})
				}) : (
					this.props.changeLocale(),
					route(`/${/\/(.+)/.exec(props.path.substring(1))[1]}`, true)
				)
		);		
	}
	fetchRecentPosts = (props) => {
		let that = this;
		that.setState({ fetchingRecentPosts: true });
		props.prismicCtx && props.prismicCtx.api.query([
			Prismic.Predicates.at('document.type', 'blog_post')
		],
		{ pageSize: 10, orderings : '[document.first_publication_date desc]', lang: props.locale }
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
							case 'about_an_author':
								return (<AuthorInfo content={content}/>)
						}
					})}
					</div>

					{ !this.state.fetchingRecentPosts && this.state.recentPosts.length > 0 && (
						<BlogPosts blogPosts={this.state.recentPosts} locale={this.props.locale}/>
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
			<div className="uk-container uk-container-small" >
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
	sendContactMessageInfo: state.sendContactMessage,
	locale: state.locale.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	hideSearchBox,
	verify,
	sendContactData,
	clearContactData,
	changeLocaleLangs,
	changeLocale,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BlogPage);
