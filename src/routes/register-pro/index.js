import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';
import {  } from '../../actions/user';
import { route } from 'preact-router';
import { registerPro, getCategories } from '../../actions/user';

import Redirect from '../../components/global/redirect';


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

	render() {
		return  (
			(this.props.userData.userAuth || getCookie('USER_AUTH')) ? (
				<RegisterProForm userData={this.props.userData}
							registerPro = {this.props.registerPro}
							registerFailureMessage = {this.props.registerFailureMessage}
							getCategories = {this.props.getCategories}
							dataFromServer = {this.props.dataFromServer}
							sendCode={() => {}}
							verifyCode={() => {}}/>
			) : (
				<Redirect to='/log-in' />
			)
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
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterPro);
