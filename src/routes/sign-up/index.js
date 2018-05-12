import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import SignUpForm from '../../components/sign-up/sign-up-form';
import style from './style.scss';
import { register, fetchRegistration } from '../../actions/user';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import { route } from 'preact-router';
import Redirect from '../../components/global/redirect';

class SignUp extends Component {
	constructor(props){
		super(props);
		this.state = {
			regData: null
		}
	}
	componentDidMount(){
		this.fetchPage(this.props);
	}
	fetchPage(props) {
    if (props.prismicCtx) {
      // We are using the function to get a document by its uid
      return props.prismicCtx.api.getByID(props.uid).then((doc, err) => {
        if (doc) {
          // We put the retrieved content in the state as a doc variable
          this.setState({ regData: doc.data });
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
	componentWillReceiveProps(nextProps){
		this.fetchPage(nextProps);
	}
	render() {

		if (!this.state.loggedIn) {
			return (
				<div className="uk-container uk-container-small" id="signUp" >
					<div>
							{!this.props.registerSuccess ? (
								<h1>Sign up</h1>
							) : (
								<h1>Success!</h1>
							) }
							<SignUpForm  fetchRegistration = { this.props.fetchRegistration } register = { this.props.register } registerSuccess = { this.props.registerSuccess } registerFailure = { this.props.registerFailure } regData = { this.state.regData }/>
						</div>
				</div>

			);
		} else {
			return (<Redirect to='/profile' />)
		}

	}
}

const mapStateToProps = (state) => ({
	registerSuccess: state.registerSuccess,
	registerFailure: state.registerFailure
});

const mapDispatchToProps = dispatch => bindActionCreators({
	register,
	fetchRegistration
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUp);
