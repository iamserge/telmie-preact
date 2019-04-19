import { h, Component } from 'preact';
import Strophe from 'npm-strophe'
import { route } from 'preact-router';
import style from './style.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import Chat from "../chat";
import Call from "../call";
import Notification from "../notification";
import { consts } from "../../../utils/consts";
import { 
	closeComModal, setChatPerson, changeUnreadNum, getCallInfo, caleeIsBusy, processCall, stopCommunication,
	pickUp, 
} from '../../../actions/chat'

import { routes } from "../../app";

class Communication extends Component {
	constructor(props){
		super(props);
		this.state= {
			showNotif: false,
			isConnected: false,
			isDelayingCall: false,
			callSec: 0,
		};
		this.webRtcPeer;		
	}		


	componentWillUnmount(){
		this.autoRejectTimeout && this.undoAutoReject();
		this.callSecondsInterval && this.undoCallSecInterval();
	}

	undoCallSecInterval = () => {
		clearInterval(this.callSecondsInterval);
		this.callSecondsInterval = null;
	}

	onClose = () => {
		this.autoRejectTimeout && (
			this.undoAutoReject(),
			this.rejectCall()
		)
		this.props.closeComModal();
	}

	// new func
	rejectCall = (isBusy = false) => {
		this.props.connection.rejectCall(isBusy);
		this.props.closeComModal();
	}

	// new func
	requestGranted = () => {
			route(routes.CLIENT_FOR_COMP + this.props.comModal.person.id + '#call');
			this.props.pickUp();
	};

  	render(){
		const { type: modalType, person = {}, isOutcoming, isPickUp } = this.props.comModal;
		
		return modalType && !isOutcoming && !isPickUp && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat 
						users = {this.props.users}
						communicateModal={this.props.comModal} 
						chooseChatPerson={this.props.chooseChatPerson}
						isConnected={this.props.isConnected}/>
				</div>
			)}
			{(modalType === consts.CALL) && (
				<div class={style.callArea}>
					<Call communicateModal={this.props.comModal}
						seconds={this.state.callSec}
						closeModal={this.onClose}
						pickUp = {this.requestGranted}
						rejectCall={this.rejectCall} 
						isConnected = {this.props.isConnected}/>
				</div>
			)}
			<div class={style.closeBtn} onClick={this.onClose}/>
		</div>)
  	}
}
const mapStateToProps = (state) => ({
	user: state.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({
	closeComModal,
	changeUnreadNum,
	setChatPerson,
	getCallInfo,
	caleeIsBusy,
	processCall,
	stopCommunication,
	pickUp,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Communication);