import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';
import {  } from '../../actions/user';
import { route } from 'preact-router';
import { registerPro, getCategories,
	changeLocaleLangs, changeLocale } from '../../actions/user';

import Spinner from '../../components/global/spinner';

import RegisterProForm from '../../components/sign-up/register-pro-form'

const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

class RegisterPro extends Component {
	constructor(props){
		super(props);
		this.state = {
			regData: null
		}
	}

	componentDidMount(){
		let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 
		this.props.getCategories(userAuth);
		this.fetchPage(this.props);
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
	}

	fetchPage(props) {
		if (props.prismicCtx) {
		// We are using the function to get a document by its uid
		return props.prismicCtx.api.getByID(props.uid).then((doc, err) => {
			if (doc) {
			// We put the retrieved content in the state as a doc variable
			this.setState({ regData: doc.data });
			} else {
			// We changed the state to display error not found if no matched doc
			this.setState({ notFound: !doc });
			}
		});
				/*
				return props.prismicCtx.api.query('').then(function(response) {
				console.log(response);
				});*/
		}
		return null;
	}

	componentWillReceiveProps(nextProps){
		this.fetchPage(nextProps);
	}

	render() {
		return ((Object.keys(this.props.userData).length != 0) && (Object.keys(this.props.dataFromServer).length != 0)) ? (
				<RegisterProForm userData={this.props.userData}
					regData = { this.state.regData }
					registerPro = {this.props.registerPro}
					registerFailureMessage = {this.props.registerFailureMessage}
					getCategories = {this.props.getCategories}
					dataFromServer = {this.props.dataFromServer}
					sendCode={() => {}}
					verifyCode={() => {}}/>
			) : (
				<Spinner />
			)
	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	registerFailureMessage: state.registerFailureMessage,
	dataFromServer: state.dataFromServer,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	registerPro,
	getCategories,
	changeLocaleLangs,
	changeLocale
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterPro);
