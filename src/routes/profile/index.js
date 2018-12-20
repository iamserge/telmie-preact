import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import style from './style.scss';
import { getProCalls, getPersonalCalls, getTransactions, getShortlist } from '../../actions/user';
import { hideSearchBox } from '../../actions';

import { route } from 'preact-router';
import Search from '../../components/global/search';
import Details from '../../components/profile/details';
import ActivityList from '../../components/profile/activity-list';
import Transactions from '../../components/profile/transactions';

import { routes } from "../../components/app";


class Profile extends Component {

	constructor(props) {
		super(props);

	}
	componentDidMount(){
		!!this.props.userData.pro && this.props.getProCalls(this.props.userData.userAuth, 2);
		this.props.getPersonalCalls(this.props.userData.userAuth, 2);
		/*this.props.getTransactions(this.props.userData.userAuth);
		this.props.getShortlist(this.props.userData.userAuth)*/
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.userData.userAuth != this.props.userData.userAuth) {
			!!nextProps.userData.pro && this.props.getProCalls(nextProps.userData.userAuth, 2);
			this.props.getPersonalCalls(nextProps.userData.userAuth, 2);
			/*this.props.getTransactions(nextProps.userData.userAuth);
			this.props.getShortlist(nextProps.userData.userAuth)*/
		}

	}
	render() {
		const { userData : user ={}, activity = {} } = this.props;
		const isLogin = Object.keys(user).length !== 0;
		return (
			<div id="profile" className="uk-container uk-container-small" >
				<Search hiddenSearchBox = {this.props.hiddenSearchBox} 
					hideSearchBox = { this.props.hideSearchBox } 
					isLogin = {isLogin} 
					home= { false }/>
				<h1>Hello, <span>{user.name}</span>!</h1>
				<Details user = { user }/>
				<ActivityList recentActivity = { activity.personCalls } title = "Recent pros" link={routes.MY_PROS}/>
				{ !!user.pro && <ActivityList recentActivity = { activity.proCalls } title = "Recent clients" link={routes.MY_CLIENTS}/> }
				<Transactions transactions = { this.props.transactions } title = "Recent transactions"  limit = {5} />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	hiddenSearchBox: state.hiddenSearchBox,
	userData: state.loggedInUser,
	/*proCalls: state.loggedInUserProCalls,
	personalCalls: state.loggedInUserPersonalCalls,*/
	activity: state.loggedInUserActivity,
	transactions: state.loggedInUserTransactions
});

const mapDispatchToProps = dispatch => bindActionCreators({
	hideSearchBox,
	getProCalls,
	getPersonalCalls,
	getTransactions,
	getShortlist
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
