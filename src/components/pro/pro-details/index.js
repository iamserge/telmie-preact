import { h, Component } from 'preact';
import style from './style.scss';
import UserVerticalInfo from './user-vertical-info';
import ProTopInfo from './pro-top-info';
import PriceInfo from './price-info';
import Spinner from '../../global/spinner';
import YouTube from 'react-youtube';
import TrackVisibility from 'react-on-screen';
import CallHistory from "./call-history-tab";
import { getCallHistory } from "../../../api/users";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Element, scroller } from 'react-scroll'
import { consts } from '../../../utils/consts'
import { generateJID } from '../../../utils/'

import "react-tabs/style/react-tabs.css";

import Message from '../../communication/chat/Message'
import SendForm from '../../communication/chat/SendForm'
import CallTab from './call-tab'
import chatStyle from './chatStyles.scss';

const getTabs = (isPro) => isPro ? 
	[consts.USER_INFO_TAB, consts.CALL_TAB, consts.CALL_HISTORY_TAB] 
	: [consts.CALL_TAB, consts.CALL_HISTORY_TAB];

const getDefaultTabIndex = (props) => {
	return (window.location.hash.indexOf('call') + 1) ? 
		(getTabs(props.isPro).indexOf(consts.CALL_TAB) || 0)
		: 0;
}

export default class Pro extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			callHistory: [],
			total: 0,
			currentPage: 1,

			callSec: 0,

			tabIndex: getDefaultTabIndex(props),
		}

		this.tabs = getTabs(props.isPro);
		this.bottomSection = null;
	}

	componentDidMount(){
		this.scrollToHashElement();
	}
	componentWillReceiveProps(nextProps){

		console.log('[componentWillReceiveProps] Pro-Details', nextProps);
		const { chat: prevChat = {} } = this.props;
		const { chat: nextChat = {} } = nextProps;

		(
			(!prevChat.chat && nextChat.chat) 
			|| (prevChat.chat && nextChat.chat && prevChat.chat.length !== nextChat.chat.length)
		) && nextProps.changeOffset(nextChat.chat.length);

		(this.props.comModal.type === consts.CALL && this.props.comModal.isOutcoming 
			&& !this.props.comModal.isBusy && !nextProps.comModal.isBusy 
			&& !this.props.comModal.isCalling && !nextProps.comModal.isCalling
			&& nextProps.comModal.callInfo.callId)
				&& this.makeCall(nextProps);
	}
	componentWillUnmount(){
		clearInterval(this.scrollInterval);
		this.scrollInterval = null;
	}

	scrollToHashElement = () => {
		const {hash} = window.location;

		hash && (
			(hash.indexOf('chat') + 1) &&
				(this.scrollInterval = setInterval(() => {
					this.bottomSection !== null && (
						scroller.scrollTo('chatElement', {
							spy: true, smooth: true, duration: 500, offset: 0,
						}),
						clearInterval(this.scrollInterval),
						this.scrollInterval = null,
						this.getMessages()
					)
				}, 100)),
			(hash.indexOf('call') + 1) &&
				(this.scrollInterval = setInterval(() => {
					this.bottomSection !== null && (
						scroller.scrollTo('callElement', {
							spy: true, smooth: true, duration: 500, offset: -100,
						}),
						clearInterval(this.scrollInterval),
						this.scrollInterval = null
					)
				}, 100))
		)
	}

	getCallHistory = (page) => {
		this.setState({ loading: true, callHistory: [], total: 0 });
		const {person, isPro, userData ={} }  = this.props;

		getCallHistory(person.id, !isPro, page, userData.userAuth).then((data) => {
			const { error, message } = data;

			error ? this.setState({
				loading: false,
				error: true,
				message
			}) : this.setState({
				loading: false,
				error: false,
				callHistory: data.results,
				total: data.total,
			})
		}).catch((error) => {
			console.log(error);
			this.setState({
				loading: false,
				error: true,
			})
		});
	}

	onTabSelect = (index, prevIndex) => {
		(this.tabs[index] === consts.CALL_HISTORY_TAB) && this.getCallHistory();
		(this.tabs[prevIndex] === consts.CALL_HISTORY_TAB) && this.setState({ callHistory: [], total: 0, });

		this.setState({ tabIndex: index });
	}

	nextPage= () => {
		this.setState({ currentPage: this.state.currentPage + 1 });
		this.getCallHistory(this.state.currentPage);
	}
	previousPage = () => {
		this.setState({ currentPage: this.state.currentPage - 1 });
		this.getCallHistory(this.state.currentPage - 1);
	}
	changePage = (page) => {
		this.setState({ currentPage: page });
		this.getCallHistory(page - 1);
	}

	onSend = (msg) =>{
		const userId = this.props.person.id;
		const {name, lastName, id: myId} = this.props.userData || {};
		const thread = this.props.isPro ? `${myId}-${userId}` : `${userId}-${myId}`;
		msg && this.props.connection.sendMessage(msg, userId, this.props.isPro, `${name} ${lastName}`, thread);
	}

	openCall = (videoOutput, videoInput) => {
		this.props.createCall(this.props.person.id);
		this.props.openComModal(consts.CALL, this.props.person, true);

		this.props.connection.setVideoElements(videoOutput, videoInput);
	};

	rejectCall = (isBusy = false) => {
		this.props.connection.rejectCall(isBusy);
	}

	getMessages = () => {
		!this.props.isPro ? this.props.connection.getChatMessages(this.props.person.id, this.props.userData.id, this.props.offset) 
			: this.props.connection.getChatMessages(this.props.userData.id, this.props.person.id, this.props.offset);
		this.props.changeOffset();
	}

	makeCall = (props) => /*this.state.isConnected ? */
		props.connection.callRequest(props.person.id, props.comModal.callInfo) /*: this.setState({ isDelayingCall: true })*/;
	
	render({person, isPro, isConnected, chat = {}, userData = {}}) {
		const { pro = {} } = person;
		const { callHistory, total, currentPage } = this.state;
		const { chat : msgArr = [], isDisplayed, mesId, thread } = chat;

		return (<div>
			<div class={style.person}>
				<UserVerticalInfo person={person} />

				<div className={style.info}>
					<ProTopInfo person={person} pro={pro} isPro={isPro}/>
				</div>

				{ isPro && <PriceInfo pro={pro} isPro={isPro} {...this.props}/> }
				
			</div>
			<div class={style.bottomSection} ref={el => this.bottomSection = el}>
				<Element name="callElement"/>
				<Tabs className={`${style.tabs} ${this.state.loading && 'loading-tabs'}`}
					selectedIndex={this.state.tabIndex}
					onSelect={this.onTabSelect}>
					
					<TabList>
						{ this.tabs.map(el => <Tab>{el}</Tab>) }
					</TabList>

					{ isPro && <TabPanel>
						{pro.professionDescription}
						{pro.video && pro.video.length > 0 && (
							<div class={style.videoContainer}>
								<div class={style.videoIntro}>Video introduction</div>
								<YouTube videoId={ pro.video } />
							</div>
						)}
					</TabPanel> }

					<TabPanel className={chatStyle.callArea}>
						<CallTab isPro={isPro}
							person={person}
							isConnected={isConnected}
							connection={this.props.connection}
							seconds={this.state.callSec}
							comModal={this.props.comModal}
							rejectCall={this.rejectCall}
							openCall={this.openCall}/>
					</TabPanel>

					<TabPanel>
						{ this.state.loading ? 
							<Spinner/> 
							: this.state.error ? 
								<div style={{textAlign: 'center'}}>Error in getting call history. {this.state.message}</div> 
								: <CallHistory list = { total }
									changePage = { this.changePage }
									nextPage = { this.nextPage }
									previousPage = { this.previousPage }
									callHistory = { callHistory }
									currentPage = { currentPage }/> }
					</TabPanel>
				</Tabs>
				<div class={style.chatWrapper}>
					<div class={style.chatHeader}>Chat with user</div>
					<Element name="chatElement"/>
					<div class={chatStyle.chatComponent}>
						{ !isConnected && <div class={chatStyle.connectingDiv}>
							<div class={chatStyle.ldsDefault}>
								<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
								<div>Connecting</div>
							</div>
						</div>}
						<div class={chatStyle.chatArea}>
							<ul class={chatStyle.messages}>
						{ !this.props.allHistoryReceived && <li class={chatStyle.getMoreWrapper} onClick={this.getMessages}><span>Get more</span></li> }
								{msgArr.map((el, i) => <Message {...el} 
														isMy={el.isMy || el.senderName === `${userData.name} ${userData.lastName}`}
														key={el.id || el.timestamp}/>
								)}
								<TrackVisibility style={{clear: "both", float: "left", width: '100%'}}>
									{({ isVisible = false }) =>  {
										isVisible && !isDisplayed && mesId
											&& (
												this.props.setDisplayedStatus(generateJID(person.id, true)),
												this.props.connection.markChatMessage(generateJID(userData.id), generateJID(person.id, true), mesId, thread, 'displayed')
											);
										console.log('isVisible', isVisible, chat);
									}}
								</TrackVisibility>
							</ul>
						</div>
						<SendForm onSend={this.onSend} isConnected={isConnected}/>
					</div>
				</div>
			</div>
			
		</div>)
	}
}
