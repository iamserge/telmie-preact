import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { getCalls } from '../../api/users'
import style from './style.scss';
import { logIn } from '../../actions/user';
import { route } from 'preact-router';
import AllActivity from '../../components/profile/all-activity';
import Spinner from '../../components/global/spinner';
import { processActivities } from '../../utils';
const MAX_ITEMS = 10;


class Activity extends Component {

	constructor(props) {
		super(props);
		this.state = {
			proCalls: [],
			activity: [],
			cutActivity: [],
			currentPage: 1,
			loading: false,
		}
	}

	getData = (props) => {
		this.setState({ loading: true, activity: [], cutActivity: [] });
		getCalls(props.userData.userAuth, null, props.isProCalls).then((data) => {
			const { results  = []} = data;
		   	this.setState({
				loading: false,
				activity: results,
				cutActivity: results.slice( (this.state.currentPage - 1) * MAX_ITEMS,  this.state.currentPage * MAX_ITEMS)
			});
		}).catch((error) => {
			console.log(error);
			this.setState({
				activity: [],
				loading: false
			})
		});
		
	}
	componentDidMount(){
		(this.props.userData.userAuth) && this.getData(this.props);
	}
	nextPage = () => {
		const currentPage = this.state.currentPage + 1;
		this.setState({ currentPage });
		this.changeActivityPage(currentPage);
	}
	previousPage = () => {
		const currentPage = this.state.currentPage - 1;
		this.setState({ currentPage });
		this.changeActivityPage(currentPage);
	}
	changePage = (page) => {
		this.setState({ currentPage: page });
		this.changeActivityPage(page);
	}
	changeActivityPage = (page) => {
		window.scrollTo(0,0);
		this.setState({
			cutActivity: this.state.activity.slice( (page - 1) * MAX_ITEMS,  page * MAX_ITEMS)
		})
	}

	showConsulted = () => this.setState({ proCalls: false });

	showConsultedMe = () => this.setState({ proCalls: true });

	componentWillReceiveProps(nextProps) {
		(nextProps.userData.userAuth != this.props.userData.userAuth 
			|| this.props.isProCalls != nextProps.isProCalls) &&
			this.getData(nextProps);
	}

	render() {
		const { userData : user = {} } = this.props;
		return (
			<div id="profile" className="uk-container uk-container-small" >
				<h1>
					 { this.props.isProCalls ? "My Clients" : "My Pros"}
				</h1>
				<AllActivity
					showConsultedMe = { this.showConsultedMe }
					showConsulted = { this.showConsulted }
					activity = { this.state.cutActivity }
					allActivity = { this.state.activity }
					currentPage = { this.state.currentPage }
					client = {this.props.isProCalls}
					loading = { this.state.loading }
					changePage = { this.changePage }
					nextPage = { this.nextPage }
					previousPage = { this.previousPage }
					max = {MAX_ITEMS}
					proCalls = { this.state.proCalls }/>

			</div>
		);
	}
}

const mapStateToProps = (state) => ({
 	userData: state.loggedInUser,
	proCalls: state.loggedInUserProCalls,
	personalCalls: state.loggedInUserPersonalCalls,
	activity: state.loggedInUserActivity,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getCalls

}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Activity);
