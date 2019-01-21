import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';
import Modal from '../../components/modal'
import {  } from '../../actions/user';
import { route } from 'preact-router';
import { getCategories, changeLocaleLangs, changeLocale } from '../../actions/user';
import { getProRegistrationInfo, cancelProPending, registerPro } from '../../api/users';
import { getCookie } from "../../utils";
import { convertProState } from "../../utils/proPending";

import Spinner from '../../components/global/spinner';

import RegisterProForm from '../../components/sign-up/register-pro-form'

class RegisterPro extends Component {
	constructor(props){
		super(props);
		this.state = {
			regData: null,
			userInfo: {},
			isInfoRegisterVisible: false,
			failureMessage: '',
			loading: false,
		}
	}

	closeInfoRegisterModal = () => this.setState({isInfoRegisterVisible: false});

	cancelProPending = async (id, authData) => {
		window.scrollTo(0,0);
		this.setState({ loading: true });
		const userInfo = await cancelProPending(id, authData);

		userInfo.error ? 
			this.setState({ failureMessage: userInfo.message, loading: false }) 
			: this.setState({ userInfo: convertProState(userInfo), loading: false });
	}

	makeProPending = async (data, userAuth) => {
		window.scrollTo(0,0);
		this.setState({ loading: true });
		const userInfo = await registerPro(data, userAuth);

		userInfo.error ? 
			this.setState({ 
				userInfo: data,
				failureMessage: userInfo.message,
				loading: false 
			}) 
			: this.setState({ 
				userInfo: data, 
				isInfoRegisterVisible: true,
				loading: false
			});
	}

	prepareRoute = async (props) => {
		let userAuth = props.userData.userAuth || getCookie('USER_AUTH'); 
		props.getCategories(userAuth);
		const userInfo = await getProRegistrationInfo(props.userData.id, userAuth);

		this.setState({ userInfo });
	}

	componentDidMount(){
		this.prepareRoute(this.props);
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
	}

	componentWillReceiveProps(nextProps, nextState) {
		(nextProps.userData.userAuth != this.props.userData.userAuth) &&
			this.prepareRoute(nextProps);
	}

	render() {
		return ((Object.keys(this.props.userData).length != 0) 
			&& (Object.keys(this.props.dataFromServer).length != 0)
			&& (Object.keys(this.state.userInfo).length != 0)
			&& !this.state.loading) ? (
				<div>
					<RegisterProForm userData={this.props.userData}
						userInfo = { this.state.userInfo }
						regData = { this.state.regData }
						registerPro = {this.makeProPending}
						cancelProPending = {this.cancelProPending}
						failureMessage = {this.state.failureMessage}
						dataFromServer = {this.props.dataFromServer}
						sendCode={() => {}}
						verifyCode={() => {}}/>
					
					<Modal isVisible = {this.state.isInfoRegisterVisible}
						title='Your changes will be sent for review'
						okText="OK"
						onOk = {this.closeInfoRegisterModal}
						onCancel={this.closeInfoRegisterModal}>
						Please note that every new profile change has to go trough verification process
					</Modal>
				</div>
			) : (
				<Spinner />
			)
	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	dataFromServer: state.dataFromServer,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	registerPro,
	cancelProPending,
	getCategories,
	changeLocaleLangs,
	changeLocale,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterPro);
