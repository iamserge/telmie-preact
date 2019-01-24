import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { route } from 'preact-router';
import { connect } from 'preact-redux';
import { getUserDetails, addToShortlist } from '../../api/pros';
import style from './style.scss';
import ProDetails from '../../components/pro/pro-details';
import Spinner from '../../components/global/spinner';
import { checkIfLoggedIn } from '../../utils';
import { routes } from '../../components/app'
import { changeLocale, changeLocaleLangs, openComModal } from '../../actions/user';

class Pro extends Component {
	constructor(props){
		super(props);
		this.state = {
			pro: {},
			loading: false,
			shortlisted: false
		}
	}

	componentDidMount(){
		if (!checkIfLoggedIn()) {
			route(routes.LOGIN_OR_SIGNUP);
			return;
		}
		this.fetchPage(this.props);
		window.scrollTo(0,0);
		getUserDetails(this.props.userId, this.props.userData.userAuth, true).then((data) => {
	    	this.setState({ pro: data, loading: false, isShortlisted: data.inShortlistForCurrent });
		});
	}
	componentWillUnmount(){
		clearTimeout(this.clearMsgTimeout);
		this.clearMsgTimeout = null;
	}
	clearMsg = () => this.setState({ shortlistMessage: ''});
	fetchPage= (props) => {
		props.changeLocale();
		props.changeLocaleLangs([]);
	}

	shortlist = (userId, isForRemove) => {
		this.setState({ shortlistLoading: true })
		clearTimeout(this.clearMsgTimeout);
		this.clearMsgTimeout = null;

		addToShortlist(userId, this.props.userData.userAuth, isForRemove).then((data) => {
			this.setState(prev => ({ 
				isShortlisted: data.error ? prev.isShortlisted : !prev.isShortlisted, 
				shortlistLoading: false, 
				shortlistMessage: data.message, 
			}));
		this.clearMsgTimeout = setTimeout(this.clearMsg, 3000);
		}).catch((error) => {
			console.log("Error: ",error)
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
					<ProDetails isShortlisted = { this.state.isShortlisted } 
								shortlistLoading={this.state.shortlistLoading}
								shortlistMessage={this.state.shortlistMessage}
								person = { this.state.pro } 
								isPro = { true }
								openComModal = { this.props.openComModal }
								cnageShortlist = { this.shortlist }  />
				)}

			</div>

		);


	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	shortlistPros: state.shortlistPros,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	changeLocaleLangs,
	changeLocale,
	openComModal,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pro);