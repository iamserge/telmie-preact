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
			isProCalls: this.props.isProCalls,
			activity: [],
			cutActivity: [],
			currentPage: 1,
			loading: false,
		}
		this.showConsultedMe = this.showConsultedMe.bind(this);
		this.showConsulted = this.showConsulted.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.previousPage = this.previousPage.bind(this);
		this.changePage = this.changePage.bind(this);
		this.changeActivityPage = this.changeActivityPage.bind(this);
	}
	componentDidMount(){
		if (this.props.userData.userAuth) {
			let that = this;
			this.setState({
				loading: true
			})
			getCalls(this.props.userData.userAuth, this.state.isProCalls).then(function(data) {
				let processed = processActivities(data);
		    that.setState({
					activity: processed,
					cutActivity: data.slice( (that.state.currentPage - 1) * MAX_ITEMS,  that.state.currentPage * MAX_ITEMS)
				});
			}).catch(function(error) {
					that.setState({
						activity: [],
						loading: false
					})
			});
		}
	}
	nextPage(){
		this.setState({
			currentPage: this.state.currentPage++
		});
		this.changeActivityPage(this.state.currentPage++);
	}
	previousPage(){
		this.setState({
			currentPage: this.state.currentPage--
		});
		this.changeActivityPage(this.state.currentPage--);
	}
	changePage(page) {
		this.setState({
			currentPage: page
		});
		this.changeActivityPage(page);
	}
	changeActivityPage(page){
		this.setState({
			cutActivity: this.state.activity.slice( (page - 1) * MAX_ITEMS,  page * MAX_ITEMS)
		})
	}

	showConsulted(){
		this.setState({
			proCalls: false
		})
	}
	showConsultedMe(){
		this.setState({
			proCalls: true
		})
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.userData.userAuth != this.props.userData.userAuth || this.props.isProCalls != nextProps.isProCalls) {
			let that = this;

			getCalls(nextProps.userData.userAuth, nextProps.isProCalls).then(function(data) {
				let processed = processActivities(data);
		    that.setState({
					activity: processed,
					cutActivity: data.slice( (that.state.currentPage - 1) * MAX_ITEMS,  that.state.currentPage * MAX_ITEMS)
				});
			}).catch(function(error) {
					that.setState({
						activity: [],
						loading: false
					})
			});
		} else {
			this.setState({
				loading: false
			})
		}
	}
	render() {
		const user = this.props.userData;
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
