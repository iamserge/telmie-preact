import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';

import Settings from '../../components/settings';
import Modal from '../../components/modal';

import { changeLocaleLangs, changeLocale, switchEmailNotif, switchWorkingPro, } from '../../actions/user';
import {
	getCreditCards, deleteCreditCard, addCreditCard, 
	getBankAcc, deleteBankAcc, addBankAcc, uploadVerificationID, resetVerificationIdStatus
} from '../../actions/wallet';
import { getStripeKey } from "../../api/wallet";
import Spinner from '../../components/global/spinner';
import { getCookie } from "../../utils";

import options from './card-options'

class SettingsPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			cardName: '',

			stripeBankMsg: '',
			stripeBankErr: false,

			addCardModal: false,
			isSripeRedy: false,

			wasCardAdded: false,
		};

		this.stripe = null;
		this.cardElement = null;
	}

	componentDidMount(){
		window.scrollTo(0, 0);
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
	}

	componentWillReceiveProps(nextProps, nextState){
		this.state.addCardModal && this.props.creditCards.loading && !nextProps.creditCards.loading && !nextProps.creditCards.error && this.setState({ wasCardAdded: true, });
	}

	componentDidUpdate(prevProps, prevState){
		let elements;

		this.state.isSripeRedy && !prevState.isSripeRedy && this.state.addCardModal && (
			elements = this.stripe.elements(),
			this.cardElement = elements.create('card', options),
			this.cardElement.mount('#card-element')
		)
	}

	getAuth = () => {
		let _userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 
		return _userAuth;
	}

	switchEmailNotif = () => {
		let _userAuth = this.getAuth();		
		this.props.switchEmailNotif(!this.props.userData.emailNotifications, _userAuth);
	}
	switchWorkingPro = () => {
		let _userAuth = this.getAuth();		
		this.props.switchWorkingPro(!this.props.userData.pro.workPro, _userAuth);
	}

	getCards = () => {
		let _userAuth = this.getAuth();		
		this.props.getCreditCards(_userAuth);
	}
	deleteCard = (token) => {
		let _userAuth = this.getAuth();
		this.props.deleteCreditCard(token, _userAuth);
	}
	addCard = async () => {
		this.setState({ addCardModal: true, });
		let _userAuth,
			publishableKey;

		!this.stripe && (
			_userAuth = this.getAuth(),
			publishableKey = await getStripeKey(_userAuth),
			this.stripe = Stripe(publishableKey)
		);
		this.setState({ isSripeRedy: true, });
	}
	
	getBankAcc = () => {
		let _userAuth = this.getAuth();		
		this.props.getBankAcc(_userAuth);
	}
	deleteBankAcc = (token) => {
		let _userAuth = this.getAuth();		
		this.props.deleteBankAcc(token, _userAuth);
	}
	addBankAcc = async (routing_number, account_number, holder_name, holder_type, clearCallback) => {
		this.setState({ stripeBankErr: false, stripeBankMsg: 'Adding new bank account...'});
		let _userAuth,
			publishableKey;

		!this.stripe && (
			_userAuth = this.getAuth(),
			publishableKey = await getStripeKey(_userAuth),
			this.stripe = Stripe(publishableKey)
		);

		this.stripe.createToken('bank_account', { 
			country: 'GB',
			currency: 'gbp',
			routing_number,
			account_number,
			account_holder_name: holder_name,
			account_holder_type: holder_type,
		 }).then((result) => {
			result.error ? 
				this.setState({ stripeBankMsg: result.error.message || 'Error with Stripe.', stripeBankErr: true }) 
				: (
					this.setState({ stripeBankMsg: '', stripeBankErr: false }),
					clearCallback(),
					this.props.addBankAcc(result.token.id, this.getAuth())
				);
		});

	}

	closeCardModal = () => this.setState({ 
		addCardModal: false, 
		stripeMsg: '', 
		cardName: '', 
		isSripeRedy: false, 
		wasCardAdded: false,
	});

	onCardHandler = () => {
		this.stripe.createToken(this.cardElement, { name: this.state.cardName }).then((result) => {
			result.error ? 
				this.setState({ stripeMsg: result.error.message }) 
				: (
					this.setState({ stripeMsg: '', }),
					this.props.addCreditCard(result.token.id, this.getAuth())
				);
		});
	}

	cardNameHandler = (e) => {
		this.setState({ cardName: e.target.value });
	}

	render() {
		const {userData = {}, creditCards ={}, bankAccounts = {}} = this.props;
		const { loading, errorMsg } = creditCards;
		return (
			<div className="uk-container uk-container-small">
				<h1>Settings</h1>
				{(Object.keys(userData).length != 0) ? (
                    <Settings userData = { this.props.userData }
						switchEmailNotif = { this.switchEmailNotif }
						switchWorkingPro={ this.switchWorkingPro }

						getCards={this.getCards}
						deleteCard={this.deleteCard}
						addCard={this.addCard}
						creditCards={creditCards}

						getBankAcc={this.getBankAcc}
						deleteBankAcc={this.deleteBankAcc}
						addBankAcc={this.addBankAcc}
						stripeBankMsg={this.state.stripeBankMsg}
						stripeBankErr={this.state.stripeBankErr}
						bankAccounts={bankAccounts}

						uploadVerificationID={this.props.uploadVerificationID}
						resetVerificationIdStatus={this.props.resetVerificationIdStatus}
						/>
				) : (
					<Spinner />
				)}


				<Modal isVisible={this.state.addCardModal} 
					onCancel={this.closeCardModal}
					modalClass={`${style.addCardModal} addCardModal`}>

					{!this.state.wasCardAdded && [
						<label for="card-element" class={style.label}>Add a card</label>,

						<div className="input-container">
							<input type="text" placeholder="Card holder" className="uk-input" value={this.state.cardName} onInput={this.cardNameHandler} />
						</div>,

						<div id="card-element" class={style.cardElement}></div>
					]}

					{ loading ? <div>Processing</div> : this.state.wasCardAdded ? [
						<div class={style.addSuccess}>Card added successfully</div>,
						<button onClick={this.closeCardModal}>Close</button>
					] : <button onClick={this.onCardHandler}>Add</button> }

					{ (errorMsg || this.state.stripeMsg) && <div class={style.errMsg}>{ this.state.stripeMsg || errorMsg }</div>}
					
				</Modal>
			</div>

		);

	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	creditCards: state.creditCards,
	bankAccounts: state.bankAccounts,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	changeLocaleLangs,
	changeLocale,
	switchEmailNotif,
	switchWorkingPro,
	getCreditCards,
	deleteCreditCard,
	addCreditCard,
	getBankAcc,
	deleteBankAcc,
	addBankAcc,
	uploadVerificationID,
	resetVerificationIdStatus,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsPage);
