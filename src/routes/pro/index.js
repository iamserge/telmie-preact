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

class Pro extends Component {
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
	isShortlisted(){
		let shortlisted = this.state.shortlisted;
		if (this.props.shortlistPros.length == 0 ) return shortlisted;
		this.props.shortlistPros.forEach((shortlistPro)=>{
			if (shortlistPro.id == this.state.pro.id) shortlisted = true;
		});
		return shortlisted;
	}
	componentWillReceiveProps(nextProps){

	}

	shortlist(userId){
		let that = this;
		addToShortlist(userId, this.props.userData.userAuth).then(function(data) {
			that.setState({
				isShortlisted: true
			})
		}).catch(function(error) {

		});
	}

	render() {

		return (
			<div id="pro" className="uk-container" >
				<Helmet
					title="Telmie | Pro"
				/>
				{(Object.keys(this.state.pro).length === 0 || this.state.loading) ? (
					<Spinner />
				) : (
					<ProDetails isShortlisted = { this.isShortlisted() } person = { this.state.pro } addToShortlist = { this.shortlist }  />
				)}

			</div>

		);


	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	shortlistPros: state.shortlistPros

});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pro);
