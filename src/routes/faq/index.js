import { h, Component } from 'preact';
import LandingFAQ from '../../components/new-landing/landing-faq'
import Spinner from '../../components/global/spinner';

import { processFAQPageData } from '../../utils/prismic-middleware';

class FAQ extends Component {
	constructor(props){
		super(props);
		this.state =  {
		  page: null,
		  fetchingPage: true
		}
	}

	componentDidMount(){
		this.props.prismicCtx && this.fetchPage(this.props);
	}

	componentWillReceiveProps(nextProps){
		(this.props.prismicCtx == null && nextProps.prismicCtx != null) 
			&& this.fetchPage(nextProps);
	}

	fetchPage = (props) => {
		let that = this;
		window.scrollTo(0, 0);
		props.prismicCtx.api.getByID(that.props.uid).then((page, err) => {
		  that.setState({fetchingPage: false, page: processFAQPageData(page.data)})
		});
	};
	
	render(){
		if (!this.state.fetchingPage) {
			const pageData = this.state.page;

			return (<div class='uk-container uk-container-small' style={{paddingTop: 50}}>
				<LandingFAQ {...pageData} />
			</div>)	
		}

		return (
			<div  className="uk-container uk-container-small">
			  <Spinner />
			</div>
		);
		
	}
}

export default FAQ;