import { h, Component } from 'preact';
import Strophe from 'npm-strophe'
import style from './style.scss';

import Chat from "../chat";
import { consts } from "../../../utils/consts";
import { getCookie } from "../../../utils/index";
import { generateJID } from "../../../utils";
import { getClientDetails, getProDetails } from "../../../api/pros";

class Call extends Component {
	constructor(props){
		super(props);
		this.state= {
			chats: {},
			users: {},
		};
		this.connection = new Strophe.Strophe.Connection('ws://sr461.2dayhost.com:5280/websocket', {});
		
	}		

	initializeConnection(id){
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
			&& this.initializeConnection(user.id);
	}

	componentWillReceiveProps(nextProps){
		const {user = {}} = nextProps;
		const {user : prevUser = {}} = this.props;
		(Object.keys(user).length !== 0 && Object.keys(prevUser).length === 0) 
			&& this.initializeConnection(user.id);

		!nextProps.communicateModal.type && this.props.communicateModal.type && document.body.classList.remove("communicate-active");
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

	setMsg = (id, text, isMy = false) => this.setState(prev => ({ chats: {
		...prev.chats, 
		[id]: prev.chats[id] ? [ 
			...prev.chats[id], 
			{ text, isMy } 
		] : [ { text, isMy } ],
	}}));
	setUsr = (user) => this.setState(prev => ({ users: {
		...prev.users, 
		[user.id]: { ...user },
	}}));

	getUserInfo = async (id) => {
		const { pro={}, userAuth } = this.props.user;
		const _userAuth = userAuth || getCookie('USER_AUTH');
		const _id = id.split('@')[0];
		
		return await ((Object.keys(pro).length === 0) ? 
			getProDetails(_id, _userAuth) : getClientDetails(_id, _userAuth));
	}

	onMessage = async (msg) => {
		const to = msg.getAttribute('to'),
			from = msg.getAttribute('from'),
			type = msg.getAttribute('type'),
			elems = msg.getElementsByTagName('body');

		if (type == "chat" && elems.length > 0) {
			let body = elems[0];
			let userInfo = null;

			const { person={} } = this.props.communicateModal

			from.indexOf(person.id) !== 0 && (
				this.props.changeUnreadNum(from),
				userInfo = await this.getUserInfo(from)
			)

			this.setMsg(from, Strophe.Strophe.getText(body));
			this.setUsr(userInfo);
		}

		return true;
	}

	sendMessage = (msg) => {
		const { user, communicateModal} = this.props;
		const to = generateJID(communicateModal.person.id);;
	  
		let m = Strophe.$msg({
			from: generateJID(user.id),
			to,
			type: 'chat'
		}).c("body").t(msg);
		
		this.setMsg(to, msg, true);

		this.connection.send(m);
	}

  	render(){
		const { type: modalType, person = {} } = this.props.communicateModal;

		modalType && document.body.classList.add("communicate-active");
		
		return modalType && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat messages={this.state.chats[generateJID(person.id)]} 
						users = {this.state.users}
						communicateModal={this.props.communicateModal} 
						setChatPerson={this.props.setChatPerson}
						onSend={this.sendMessage}/>
				</div>
			)}
			<div class={style.closeBtn} onClick={this.props.onClose}/>
		</div>)
  	}
}

export default Call;