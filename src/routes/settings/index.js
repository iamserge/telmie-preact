import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';

import Settings from '../../components/settings';

import { changeLocaleLangs, changeLocale, switchEmailNotif, switchWorkingPro, } from '../../actions/user';
import Spinner from '../../components/global/spinner';
import { getCookie } from "../../utils";


class SettingsPage extends Component {
	constructor(props){
		super(props);
	}

	componentDidMount(){
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
	}

	switchEmailNotif = () => {
		const {userAuth, emailNotifications} = this.props.userData
		let _userAuth = userAuth || getCookie('USER_AUTH'); 
		
		this.props.switchEmailNotif(!emailNotifications, _userAuth);
	}
	switchWorkingPro = () => {
		const {userAuth, pro = {}} = this.props.userData
		let _userAuth = userAuth || getCookie('USER_AUTH'); 
		
		this.props.switchWorkingPro(!pro.workPro, _userAuth);
	}

	render() {
		const {userData = {}} = this.props;
		return (
			<div className="uk-container uk-container-small">
				<h1>Settings</h1>
				{(Object.keys(userData).length != 0) ? (
                    <Settings userData = { this.props.userData }
						switchEmailNotif = { this.switchEmailNotif }
						switchWorkingPro={ this.switchWorkingPro }/>
				) : (
					<Spinner />
				)}

			</div>

		);

	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({
	changeLocaleLangs,
	changeLocale,
	switchEmailNotif,
	switchWorkingPro,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsPage);
