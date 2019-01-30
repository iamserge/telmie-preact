import { h, Component } from 'preact';
import Strophe from 'npm-strophe'
import style from './style.scss';

import Chat from "../chat";
import Call from "../call";
import { consts } from "../../../utils/consts";
import { getCookie } from "../../../utils/index";
import { generateJID } from "../../../utils";
import { getUserDetails, getCallDetails } from "../../../api/pros";
import { setMessages, setUser } from './helpers'

class Communication extends Component {
	constructor(props){
		super(props);
		this.state= {
			chats: {},
			users: {},
		};
		this.connection = new Strophe.Strophe.Connection('ws://sr461.2dayhost.com:5280/websocket', {});
		
	}		

	initializeConnection = (id, props) => {
		const { userAuth } = props.user;
		this._userAuth = userAuth || getCookie('USER_AUTH');
		this.connection.connect(generateJID(id),'', this.onConnect);
		this.connection.rawInput = (data) => {
			console.log('rawInput:', data);
		};
		this.connection.rawOutput = (data) => {
			console.log('rawOutput:', data);
		};
	}

	componentDidMount(){
		const {user = {}} = this.props;
		(Object.keys(user).length !== 0)
			&& this.initializeConnection(user.id, this.props);
	}

	componentWillReceiveProps(nextProps){
		const {user = {}} = nextProps;
		const {user : prevUser = {}} = this.props;
		(Object.keys(user).length !== 0 && Object.keys(prevUser).length === 0) 
			&& this.initializeConnection(user.id, nextProps);

		!nextProps.comModal.type && this.props.comModal.type && document.body.classList.remove("communicate-active");

		(this.props.comModal.type === consts.CALL && this.props.comModal.isOutcoming && !this.props.comModal.isBusy && 
			Object.keys(nextProps.comModal.callInfo).length) 
			&& this.callRequest(nextProps.comModal.callInfo);
	}

	onConnect = (status) => {
		/*console.log('-------=========--------');
		console.log('Status: ' + status);
		console.log(this.connection);

		console.log(Strophe.Strophe.Status);*/
		
		
		if (status == Strophe.Strophe.Status.CONNECTING) {
			console.log('Strophe is connecting.');
		} else if (status == Strophe.Strophe.Status.CONNFAIL) {
			console.log('Strophe failed to connect.');
		} else if (status == Strophe.Strophe.Status.DISCONNECTING) {
			console.log('Strophe is disconnecting.');
		} else if (status == Strophe.Strophe.Status.DISCONNECTED) {
			console.log('Strophe is disconnected.');
		} else if (status == Strophe.Strophe.Status.CONNECTED) {
			console.log('Strophe is connected.');

			this.connection.addHandler(this.onMessage, null, 'message', null, null, null);
		}
	}

	setMsg = (id, text, isMy = false) => this.setState(prev => setMessages(id, text, isMy, prev));

	setUsr = (user) => this.setState(prev => setUser(user, prev));

	getUserInfo = async (id) => {
		const { pro={} } = this.props.user;
		const _id = id.split('@')[0];
		const isPro = (Object.keys(pro).length === 0);

		return await getUserDetails(_id, this._userAuth, isPro);
	}

	undoAutoReject = () => {
		clearTimeout(this.autoRejectTimeout);
		this.autoRejectTimeout = null;
	}

	onClose = () => {
		this.autoRejectTimeout && (
			this.undoAutoReject(),
			this.rejectCall()
		)
		this.props.onClose();
	}

	changeType = () => {
		this.undoAutoReject();
		this.props.changeType();
	}

	onMessage = async (msg) => {
		console.log('---=== [onMessage] ===---');
		const to = msg.getAttribute('to'),
			from = msg.getAttribute('from'),
			type = msg.getAttribute('type'),
			elems = msg.getElementsByTagName('body'),
			vcxepElems = msg.getElementsByTagName('vcxep');

		console.log('to', to);
		console.log('from', from);
		console.log('type', type);
		console.log('elems', elems);
		console.log('vcxepElems', vcxepElems);

		if (type == "chat" && elems.length > 0) {
			console.log(' ---=== [CHAT] ===--- ');
			let body = elems[0];
			let userInfo = null;

			const { person={} } = this.props.comModal;

			from.indexOf(person.id) !== 0 && (
				this.props.changeUnreadNum(from),
				userInfo = await this.getUserInfo(from)
			)

			this.setMsg(from, Strophe.Strophe.getText(body));
			this.setUsr(userInfo);
		}

		if (type === 'vcxep' && vcxepElems.length > 0){
			console.log(' ---=== [CALL] ===--- ');
			let body = vcxepElems[0];

			console.log(body);
			const type = body.getAttribute('type'),
				callId = body.getAttribute('callId'),
				avtime = body.getAttribute('avtime');
			

			switch (type){
				case 'request':
					const { callInfo : cInfo = {} } = this.props.comModal;
					console.log(cInfo);
					//console.log(this.props.callInfo);
					console.log('cInfo.callId',cInfo.callId);
					if(cInfo.callId){
						this.requestForbidden(callId, from);
						break;
					}
					const callInfo = await getCallDetails(callId, this._userAuth);
					if (callInfo.status && callInfo.status.toLowerCase() === 'active') {
						this.props.getCallInfo(callInfo);
						console.log('callInfo: ',callInfo);
			
						const { consultant = {}, consulted ={}, callerId } = callInfo;
						const person = consultant.id === callerId ? {...consultant} : {...consulted};
			
						this.props.openComModal(consts.CALL, person, false, true);
					}
					break;
				case 'reject':
					console.log('REJECTED');
					this.undoAutoReject();
					this.props.onClose();
					break;
				case 'forbidden':
					console.log('forbidden');
					this.undoAutoReject();
					this.props.caleeIsBusy();
					break;
			}
		}

		return true;
	}

	sendMessage = (msg) => {
		const { user, comModal} = this.props;
		const to = generateJID(comModal.person.id);
	  
		let m = Strophe.$msg({
			from: generateJID(user.id),
			to,
			type: 'chat'
		}).c("body").t(msg);
		
		this.setMsg(to, msg, true);

		this.connection.send(m);
	}

	callRequest = (callInfo) => {
		const { user, comModal } = this.props;
		const to = generateJID(comModal.person.id);

		let m = Strophe.$msg({
			from: generateJID(user.id),
			to,
			type: 'vcxep'
		}).c("vcxep", {type: 'request', callId: callInfo.callId, avtime: callInfo.avTime});

		this.autoRejectTimeout = setTimeout(this.rejectCall, 20000);
		this.connection.send(m);
	}

	rejectCall = () => {
		this.undoAutoReject();
		const { user, comModal, callInfo = {} } = this.props;
		const to = generateJID(comModal.person.id);

		let m = Strophe.$msg({
			from: generateJID(user.id),
			to,
			type: 'vcxep'
		}).c("vcxep", {type: 'reject', callId: callInfo.callId});

		this.connection.send(m);
		this.props.onClose();
	}

	requestForbidden = (callId, from) => {
		console.log('requestForbidden');
		const { user } = this.props;
		const to = from;

		let m = Strophe.$msg({
			from: generateJID(user.id),
			to,
			type: 'vcxep'
		}).c("vcxep", {type: 'forbidden', callId });

		this.connection.send(m);
	}

	/*
	<message xmlns='jabber:client' from='5946@sr461.2dayhost.com/web' to='5963@sr461.2dayhost.com/web' type='chat'>
		<body>hi</body>
	</message>
	*/

  	render(){
		const { type: modalType, person = {} } = this.props.comModal;

		modalType && document.body.classList.add("communicate-active");
		
		return modalType && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat messages={this.state.chats[generateJID(person.id)]} 
						users = {this.state.users}
						communicateModal={this.props.comModal} 
						setChatPerson={this.props.setChatPerson}
						onSend={this.sendMessage}/>
				</div>
			)}
			{(modalType === consts.CALL) && (
				<div class={style.callArea}>
					<Call communicateModal={this.props.comModal}
						changeType={this.changeType}
						closeModal={this.onClose}
						rejectCall={this.rejectCall} />
				</div>
			)}
			<div class={style.closeBtn} onClick={this.onClose}/>
		</div>)
  	}
}

export default Communication;