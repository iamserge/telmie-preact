import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { route } from 'preact-router';
import { connect } from 'preact-redux';
import { getProDetails } from '../../api/pros';
import { addToShortlist } from '../../api/pros'
import style from './style.scss';
import ProDetails from '../../components/pro/pro-details';
import Spinner from '../../components/global/spinner';
import Redirect from '../../components/global/redirect';
import { checkIfLoggedIn } from '../../utils';

class Search extends Component {
	constructor(props){
		super(props);
		this.state = {
			pro: {},
			loading: false,
			shortlisted: false
		}
		this.shortlist = this.shortlist.bind(this);
	}

	componentDidMount(){
		if (!checkIfLoggedIn()) {
			route('/login-or-signup');
			return;
		}
		const that = this;
		window.scrollTo(0,0);
		getProDetails(this.props.userId)
	  .then(function(data) {
	    that.setState({ pro: data, loading: false });
		});
	}

	componentWillReceiveProps(nextProps){

	}

	shortlist(userId){
		let that = this;
		addToShortlist(userId, this.props.userData.userAuth).then(function(data) {
			that.setState({
				shortlisted: true
			})
		}).catch(function(error) {

		});
	}

	render() {

		return (
			<div id="pro" className="uk-container uk-container-small" >
				<Helmet
					title="Telmie | Pro"
				/>
				{(Object.keys(this.state.pro).length === 0 || this.state.loading) ? (
					<Spinner />
				) : (
					<ProDetails person = { this.state.pro } addToShortlist = { this.shortlist } shortlisted = { this.state.shortlisted } />
				)}

			</div>

		);


	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Search);
