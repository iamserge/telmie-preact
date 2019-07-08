import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { route } from 'preact-router';
import { connect } from 'preact-redux';
import { getUserDetails, addToShortlist } from '../../api/pros';
import ProDetails from '../../components/pro/pro-details';
import Spinner from '../../components/global/spinner';
import { checkIfLoggedIn } from '../../utils';
import { routes } from '../../components/app'
import { changeLocale, changeLocaleLangs } from '../../actions/user';
import { openComModal, createCall } from '../../actions/chat';
import { consts } from "../../utils/consts";

import { generateJID } from "../../utils";

class User extends Component {
	constructor(props){
		super(props);
		this.state = {
			user: {},
			loading: false,
			shortlisted: false,

			offset: 0,
			allHistoryReceived: false,
        }
        this.clearMsgTimeout = null;
	}

	componentDidMount(){
		if (!checkIfLoggedIn()) {
			route(routes.LOGIN_OR_SIGNUP);
			return;
		}
		this.fetchPage(this.props);
        window.scrollTo(0,0);
        const { userId, userData= {}, isPro } = this.props;
		getUserDetails(userId, userData.userAuth, isPro).then((data) => {
			this.setState({ user: data, loading: false, isShortlisted: isPro ? data.inShortlistForCurrent : false });
			this.checkUserInChats(this.props, data);
		});
	}
	componentWillReceiveProps(nextProps){

		((nextProps.received < consts.MES_HISTORY_SIZE) && (nextProps.received !== -1)) 
			&& this.setState({ allHistoryReceived: true });

        (this.props.userId !== nextProps.userId) 
            && (
                this.setState({ user: {}, loading: true, allHistoryReceived: false, offset: 0 }),
                nextProps.clearChat(this.props.userId),
                getUserDetails(nextProps.userId, nextProps.userData.userAuth, nextProps.isPro).then((data) => {
					this.setState({ user: data, loading: false, isShortlisted: nextProps.isPro ? data.inShortlistForCurrent : false });
					this.checkUserInChats(nextProps, data);
                })
            )
	}
	componentWillUnmount(){
		clearTimeout(this.clearMsgTimeout);
		this.clearMsgTimeout = null;
		this.props.clearChat(this.props.userId);
	}
	
	checkUserInChats = (props, user) => {
		(Object.keys(props.users).indexOf(user.id.toString()) + 1) && (
			props.chooseChatPerson(user, false),
			window.location.hash = 'chat'
		);
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

    createCall = (cid, isPro = false) => this.props.isPro 
		&& this.props.createCall(cid, isPro, this.props.userData.userAuth, this.props.connection.stopCommunication);
		
	changeOffset = (num = 0) => this.setState( prev => ({ 
		offset: num ? num : prev.offset + consts.MES_HISTORY_SIZE ,
	}));

	render() {

        const { 
            isPro, chats, isConnected, userData, communicateModal, openComModal
        } = this.props;

        const proProps = isPro ? {
            isShortlisted: this.state.isShortlisted,
            shortlistLoading: this.state.shortlistLoading,
            shortlistMessage: this.state.shortlistMessage,
            createCall: this.createCall,
            cnageShortlist: this.shortlist,
		} : {};

		return (
			<div id="pro" className="uk-container" >
				{ this.props.isPro && <Helmet
					title="Telmie | Pro"
                /> }
				{(Object.keys(this.state.user).length === 0 || this.state.loading) ? (
					<Spinner />
				) : (
					<ProDetails isPro = { isPro }
						person = { this.state.user }
						userVideoStream = { this.props.userVideoStream }
                        connection={ this.props.connection }
                        isConnected={ isConnected }
                        userData = { userData } 
                        comModal={ communicateModal }
                        openComModal = { openComModal }
						chat={ chats[generateJID(this.state.user.id, true)] || {} }
						offset={ this.state.offset }
						changeOffset = { this.changeOffset }
						allHistoryReceived = { this.state.allHistoryReceived }
						setDisplayedStatus={this.props.setDisplayedStatus}
                        {...proProps}
                        />
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
	createCall,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(User);