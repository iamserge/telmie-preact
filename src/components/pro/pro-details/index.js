import { h, Component } from 'preact';
import style from './style.scss';
import UserVerticalInfo from './user-vertical-info';
import ProTopInfo from './pro-top-info';
import PriceInfo from './price-info';
import Spinner from '../../global/spinner';
import YouTube from 'react-youtube';
import CallHistory from "./call-history-tab";
import { getCallHistory } from "../../../api/users";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Element, scroller, Link as ScrollLink } from 'react-scroll'
import "react-tabs/style/react-tabs.css";

import Message from '../../communication/chat/Message'
import SendForm from '../../communication/chat/SendForm'
import chatStyle from './chatStyles.scss';


export default class Pro extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			callHistory: [],
			total: 0,
			currentPage: 1,
		}

		this.tabs = props.isPro ? 
			['User Info', 'Chat with Pro', 'Call history'] : ['Chat with Pro', 'Call history'];
		this.bottomSection = null;
	}

	componentDidMount(){
		this.scrollToHashElement();
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
						this.scrollInterval = null
					)
				}, 100))
		)
	}

	getCallHistory = (page) => {
		this.setState({ loading: true, callHistory: [], total: 0 });
		const {person, isPro, userAuth}  = this.props;

		getCallHistory(person.id, !isPro, page, userAuth).then((data) => {
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
		(index === this.tabs.length - 1) && this.getCallHistory();
		(prevIndex === this.tabs.length - 1) && this.setState({ callHistory: [], total: 0, });
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
		console.log(msg);
		msg && this.props.connection.sendMessage(msg, this.props.person.id);
	}
	
	render({person, isPro, isConnected, chat = []}) {
		const { pro = {} } = person;
		const { callHistory, total, currentPage } = this.state;

		return (<div>
			<div class={style.person}>
				<UserVerticalInfo person={person} />

				<div className={style.info}>
					<ProTopInfo person={person} pro={pro} isPro={isPro}/>
				</div>

				{ isPro && <PriceInfo pro={pro} isPro={isPro} {...this.props}/> }
				
			</div>
			<div class={style.bottomSection} ref={el => this.bottomSection = el}>
				<Tabs className={`${style.tabs} ${this.state.loading && 'loading-tabs'}`} onSelect={this.onTabSelect}>
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

					<TabPanel>
						<h2>Chat with Pro</h2>
						
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
				<div>
					<div class={chatStyle.chatComponent}>
						<Element name="chatElement"/>
						{ !isConnected && <div class={chatStyle.connectingDiv}>
							<div class={chatStyle.ldsDefault}>
								<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
								<div>Connecting</div>
							</div>
						</div>}
						<div class={chatStyle.chatArea}>
							<ul class={chatStyle.messages}>
								{chat.map((el, i) => <Message {...el} key={i}/>)}
							</ul>
						</div>
						<SendForm onSend={this.onSend} isConnected={isConnected}/>
					</div>
				</div>
			</div>
			
		</div>)
	}
}
