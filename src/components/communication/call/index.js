import { h, Component } from 'preact';
import Strophe from 'npm-strophe'
import style from './style.scss';

import Chat from "../chat";
import { consts } from "../../../utils/consts";
import { generateJID } from "../../../utils";

class Call extends Component {
	constructor(props){
		super(props);
		this.state= {
			chats: {},
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

	onMessage = (msg) => {
		var to = msg.getAttribute('to');
		var from = msg.getAttribute('from');
		var type = msg.getAttribute('type');
		var elems = msg.getElementsByTagName('body');

		if (type == "chat" && elems.length > 0) {
			var body = elems[0];

			const { person={} } = this.props.communicateModal

			from.indexOf(person.id) !== 0 && this.props.changeUnreadNum(from);
			this.setState(prev => ({ chats: {
				...prev.chats, 
				[from]: prev.chats[from] ? [ 
					...prev.chats[from], 
					{ text: Strophe.Strophe.getText(body) } 
				] : [ { text: Strophe.Strophe.getText(body) } ],
			}}));
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
		
		this.setState(prev => ({ chats: {
			...prev.chats, 
			[to]: prev.chats[to] ? [
				...prev.chats[to], 
				{ text: msg, isMy: true } 
			] : [ { text: msg, isMy: true } ],
		}}));

		this.connection.send(m);
	}

  	render(){
		const { type: modalType, person = {} } = this.props.communicateModal;

		modalType && document.body.classList.add("communicate-active");
		
		return modalType && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat messages={this.state.chats[generateJID(person.id)]} 
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