import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import Spinner from '../../components/global/spinner';
import { route } from 'preact-router';

import { getPage } from '../../utils/prismic-middleware';
import { changeLocaleLangs, changeLocale } from '../../actions/user';

import style from './style.scss';

class StaticPage extends Component {
	constructor(props){
		super(props);
		this.state =  {
	    doc: null,
	    notFound: false,
	  }
	}
	componentDidMount(){
		this.fetchPage(this.props);
	}
	componentWillReceiveProps(nextProps){
		this.fetchPage(nextProps);
	}

	fetchPage = async (props) => {
		window.scrollTo(0, 0);
		this.setState({ doc: null });
		props.changeLocaleLangs([]);

		const doc = await getPage(props);
		doc && this.setState({ doc });
  }
	render() {

		if (this.state.doc) {
			return (
				<div  className="uk-container uk-container-small" id="staticPage" >

					<h1>{PrismicReact.RichText.asText(this.state.doc.data.page_title)}</h1>
					{PrismicReact.RichText.render(this.state.doc.data.page_body, this.props.prismicCtx.linkResolver)}
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
	locale: state.locale.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	changeLocaleLangs,
	changeLocale,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StaticPage);
