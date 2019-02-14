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

import { generateJID } from "../../utils";

class User extends Component {
	constructor(props){
		super(props);
		this.state = {
			user: {},
			loading: false,
			shortlisted: false
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
		});
	}
	componentWillReceiveProps(nextProps){
        (this.props.userId !== nextProps.userId) 
            && (
                this.setState({ user: {}, loading: true }),
                nextProps.clearChat(this.props.userId),
                getUserDetails(nextProps.userId, nextProps.userData.userAuth, nextProps.isPro).then((data) => {
                    this.setState({ user: data, loading: false, isShortlisted: nextProps.isPro ? data.inShortlistForCurrent : false });
                })
            )
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

    createCall = (cid, isPro = false) => this.props.isPro 
        && this.props.createCall(cid, isPro, this.props.userData.userAuth);

	render() {

        const { 
            isPro, received, clearChat, chats, isConnected, userData, 
            communicateModal, openComModal
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
                        connection={ this.props.connection }
                        isConnected={ isConnected }
                        received={ received }
                        clearChat={ clearChat }
                        userData = { userData } 
                        comModal={ communicateModal }
                        openComModal = { openComModal }
                        chat={ chats[generateJID(this.state.user.id, true)] || [] }
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