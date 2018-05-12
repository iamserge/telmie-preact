import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import style from './style.scss';
import { getProCalls, getPersonalCalls, getTransactions } from '../../actions/user';

import { route } from 'preact-router';
import Details from '../../components/profile/details';
import ActivityList from '../../components/profile/activity-list';
import Transactions from '../../components/profile/transactions';


const getActivity = (proCalls, personalCalls) => {


}


class Profile extends Component {

	constructor(props) {
		super(props);

	}
	componentDidMount(){

	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.userData.userAuth != this.props.userData.userAuth) {
			this.props.getProCalls(nextProps.userData.userAuth);
			this.props.getPersonalCalls(nextProps.userData.userAuth);
			this.props.getTransactions(nextProps.userData.userAuth);
		}

	}
	render() {
		const user = this.props.userData;
		return (
			<div id="profile" className="uk-container uk-container-small" >
				<h1>Hello, <span>{user.name}</span>!</h1>
				<Details user = { user }/>
				<ActivityList recentActivity = { this.props.activity } title = "Recent activity" />
				<Transactions transactions = { this.props.transactions } title = "Recent transactions"  limit = {5} />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	proCalls: state.loggedInUserProCalls,
	personalCalls: state.loggedInUserPersonalCalls,
	activity: state.loggedInUserActivity,
	transactions: state.loggedInUserTransactions
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getProCalls,
	getPersonalCalls,
	getTransactions
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
