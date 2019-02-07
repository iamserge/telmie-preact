import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { getCalls } from '../../api/users'
import style from './style.scss';
import { changeLocaleLangs, changeLocale } from '../../actions/user';
import AllActivity from '../../components/profile/all-activity';
import SimpleSearch from '../../components/simple-search'
import SideBar from '../../components/search/sidebar';

const MAX_ITEMS = 10;
const proSortingItems = [{
	name: 'Last activity date',
	value: 'date'
},{
	name: 'Name',
	value: 'name'
},{
	name: 'Profession',
	value: 'trade'
}];

class Activity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			proCalls: [],
			activity: [],
			cutActivity: [],
			currentPage: 1,
			loading: false,
			sortBy: 'date',

			isSearched: false,
			sActivity: [],
			sCutActivity: [],
		}
	}

	onSearch = async (val) =>{
		if (!val){
			this.setState({
				loading: false,
				isSearched: false, 
				sActivity: [],
				sCutActivity: [],
			});
			return;
		}

		this.setState({ loading: true, isSearched: true, sActivity: [], sCutActivity: [] });

		const result = await this.state.activity.filter(el => (el.lastName.indexOf(val) +1 || el.name.indexOf(val) +1));

		this.setState({
			loading: false,
			currentPage: 1,
			sActivity: result,
			sCutActivity: result.slice(0, MAX_ITEMS)
		});
	}

	getData = (props, sortBy = '') => {
		this.setState({ loading: true, activity: [], cutActivity: [] });
		getCalls(props.userData.userAuth, props.isProCalls, null, sortBy).then((data) => {
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
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
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
		this.state.isSearched ?
			this.setState({
				sCutActivity: this.state.sActivity.slice( (page - 1) * MAX_ITEMS,  page * MAX_ITEMS)
			})
			: this.setState({
				cutActivity: this.state.activity.slice( (page - 1) * MAX_ITEMS,  page * MAX_ITEMS)
			});			
	}

	showConsulted = () => this.setState({ proCalls: false });

	showConsultedMe = () => this.setState({ proCalls: true });

	componentWillReceiveProps(nextProps) {
		(nextProps.userData.userAuth != this.props.userData.userAuth 
			|| this.props.isProCalls != nextProps.isProCalls) &&
			this.getData(nextProps);
	}

	sortToggleSwitched = (sortBy) => {
		this.setState({ sortBy });
		this.getData(this.props, sortBy);
	}

	render() {
		const allActivity = this.state.isSearched ? this.state.sActivity : this.state.activity,
			activity = this.state.isSearched ? this.state.sCutActivity : this.state.cutActivity;

		return (
			<div id="profile" className="uk-container uk-container-small" >
				<h1>
					 { this.props.isProCalls ? "My Clients" : "My Pros"}
				</h1>
				{ !this.props.isProCalls && <SideBar style={{marginTop: 40}} 
												items={proSortingItems}
												disabled={this.state.loading}
												sortToggleSwitched = { this.sortToggleSwitched } 
												sortBy = { this.state.sortBy }/> }
				{ this.props.isProCalls && <SimpleSearch onSearch={this.onSearch}/> }
				<AllActivity
					showConsultedMe = { this.showConsultedMe }
					showConsulted = { this.showConsulted }
					activity = { activity }
					allActivity = { allActivity }
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
	getCalls,
	changeLocaleLangs,
	changeLocale,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Activity);
