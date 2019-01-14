import { h, Component } from 'preact';
import Strophe from 'npm-strophe'
import style from './style.scss';

import Chat from "../chat";
import { host } from "../../../api/index";
import { consts } from "../../../utils/consts";

const generateJID = (id) => `${id}@${host}/web`;

class Call extends Component {
	constructor(props){
		super(props);
		this.state= {
			messages: [],
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

		!nextProps.communicateVisible.type && this.props.communicateVisible.type && document.body.classList.remove("communicate-active");
	}

	onConnect = (status) => {
		console.log('-------=========--------');
		console.log('Status: ' + status);
		console.log(this.connection);

		console.log(Strophe.Strophe.Status);
		
		
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
			console.log('CHAT: I got a message from ', from, ': ', Strophe.Strophe.getText(body));

			this.setState(prev => ({ messages: [
				...prev.messages, 
				{ text: Strophe.Strophe.getText(body), from }
			]}))
		}

		return true;
	}

	sendMessage = (msg) => {
		console.log('CHAT: Send a message: ' + msg);
	  
		var m = Strophe.$msg({
			from: `${5943}@${host}/web`,
			to: `${5946}@${host}/web`,
			type: 'chat'
		}).c("body").t(msg);
		
		this.setState(prev => ({ messages: [
			...prev.messages, 
			{ text: msg, isMy: true }
		]}))

		this.connection.send(m);
	}

  	render(){
		const { type: modalType } = this.props.communicateVisible;
		modalType && document.body.classList.add("communicate-active");
		
		return modalType && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat messages={this.state.messages} onSend={this.sendMessage}/>
				</div>
			)}
			<div class={style.closeBtn} onClick={this.props.onClose}/>
		</div>)
  	}
}

export default Call;