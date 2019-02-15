import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';
import Modal from '../../components/modal'
import {  } from '../../actions/user';
import { route } from 'preact-router';
import { getCategories, changeLocaleLangs, changeLocale } from '../../actions/user';
import { getProRegistrationInfo, cancelProPending, registerPro, checkTaxId } from '../../api/users';
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
			isRegCompanyVisible: false,
			failureMessage: '',
			loading: false,

			incorrectTax: false,
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

	checkCompanyTaxId = async (taxId, authData) => {
		this.setState({ loading: true });
		const companyInfo = await checkTaxId(taxId, authData);

		companyInfo.error ? 
			this.setState({ 
				failureMessage: companyInfo.message || '',
				loading: false,
				incorrectTax: true,
			}) 
			: this.setState({ 
				companyInfo: { ...companyInfo }, 
				failureMessage: '',
				loading: false,
				incorrectTax: false,
			});
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
				failureMessage: '',
				loading: false
			});
	}

	prepareRoute = async (props) => {
		let userAuth = props.userData.userAuth || getCookie('USER_AUTH'); 
		props.getCategories(userAuth);
		const userInfo = await getProRegistrationInfo(props.userData.id, userAuth);

		this.setState({ userInfo });
	}

	cancelChackingTax = () => {
		this.setState({
			incorrectTax: false,
			failureMessage: '',
		})
	}

	componentDidMount(){
		window.scrollTo(0,0);
		this.prepareRoute(this.props);
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
	}

	componentWillReceiveProps(nextProps, nextState) {
		(nextProps.userData.userAuth != this.props.userData.userAuth) &&
			this.prepareRoute(nextProps);
	}

	render() {
		const isLoaded = (Object.keys(this.props.userData).length != 0) 
			&& (Object.keys(this.props.dataFromServer).length != 0)
			&& (Object.keys(this.state.userInfo).length != 0)
			&& !this.state.loading;

		return <div>
					<RegisterProForm userData={this.props.userData}
						userInfo = { this.state.userInfo }
						regData = { this.state.regData }
						companyInfo = { this.state.companyInfo || {} }
						registerPro = {this.makeProPending}
						cancelProPending = {this.cancelProPending}
						failureMessage = {this.state.failureMessage}
						dataFromServer = {this.props.dataFromServer}
						checkCompanyTaxId={ this.checkCompanyTaxId }
						incorrectTax={ this.state.incorrectTax }
						cancelChackingTax={ this.cancelChackingTax }
						sendCode={() => {}}
						verifyCode={() => {}}
						isLoaded={isLoaded}/>
					
					<Modal isVisible = {this.state.isInfoRegisterVisible}
						title='Your changes will be sent for review'
						okText="OK"
						onOk = {this.closeInfoRegisterModal}
						onCancel={this.closeInfoRegisterModal}>
						Please note that every new profile change has to go trough verification process
					</Modal>
				</div>
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
