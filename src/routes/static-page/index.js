import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import Spinner from '../../components/global/spinner';

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

	fetchPage(props) {
		window.scrollTo(0, 0);
		this.setState({ doc: null });
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
			/*
			return props.prismicCtx.api.query('').then(function(response) {
			   console.log(response);
			});*/
    }
    return null;
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StaticPage);
