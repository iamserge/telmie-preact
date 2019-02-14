import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { route } from 'preact-router';
import { connect } from 'preact-redux';
import { getUserDetails, addToShortlist } from '../../api/pros';
//import style from './style.scss';
import ProDetails from '../../components/pro/pro-details';
import Spinner from '../../components/global/spinner';
import { checkIfLoggedIn } from '../../utils';
import { routes } from '../../components/app'
import { changeLocale, changeLocaleLangs } from '../../actions/user';
import { openComModal } from '../../actions/chat';

import { generateJID } from "../../utils";

class Client extends Component {
	constructor(props){
		super(props);
		this.state = {
			client: {},
			loading: false,
		}
	}

	componentDidMount(){
		if (!checkIfLoggedIn()) {
			route(routes.LOGIN_OR_SIGNUP);
			return;
		}
		this.fetchPage(this.props);
		window.scrollTo(0,0);
		getUserDetails(this.props.userId, this.props.userData.userAuth, false).then((data) => {
	    	this.setState({ client: data, loading: false, });
        });
    }
    
	fetchPage= (props) => {
		props.changeLocale();
		props.changeLocaleLangs([]);
	}

	render() {

		return (
			<div className="uk-container" >
				
				{(Object.keys(this.state.client).length === 0 || this.state.loading) ? (
					<Spinner />
				) : (
					<ProDetails person = { this.state.client } 
								isPro = { false }
								isConnected={this.props.isConnected}
								connection={this.props.connection}
								chat={this.props.chats[generateJID(this.state.client.id, true)]}
								userData = { this.props.userData }
								comModal={ this.props.communicateModal}
                                openComModal = { this.props.openComModal } />
				)}

			</div>

		);


	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	communicateModal: state.communicateModal,

});

const mapDispatchToProps = dispatch => bindActionCreators({
	changeLocaleLangs,
    changeLocale,
    openComModal,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Client);