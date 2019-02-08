import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { getPros } from '../../api/pros';
import { consts } from '../../utils/consts';
import { route } from 'preact-router';
import style from './style.scss';
import ProList from '../../components/search/pros-list';
import SideBar from '../../components/search/sidebar';
import RadioBtns from '../../components/radio-buttons';
import Pagination from '../../components/search/pagination';
import Spinner from '../../components/global/spinner';
import { checkIfLoggedIn } from '../../utils';
import { changeLocale, changeLocaleLangs } from '../../actions/user';
import { routes } from "../../components/app";

const searchSortingItems = [{
	name: 'Lowest rate first',
	value: 'lowestratefirst'
},{
	name: 'Highest rate first',
	value: 'highestratefirst'
},{
	name: 'Experience',
	value: 'experience'
},{
	name: 'Rating',
	value: 'rating'
},{
	name: 'Activity',
	value: 'activity'
},];

const searchFilterItems = [{
	name: 'Languages',
	value: 'languages'
},{
	name: 'Coaching',
	value: 'coaching'
},{
	name: 'Immigration',
	value: 'immigration'
},{
	name: 'Other',
	value: 'other'
}];

class Search extends Component {
	constructor(props){
		super(props);
		this.state = {
			pros: [],
			searchTerm: this.props.searchTerm || '',
			loading: true,
			sortBy: 'rating',
			filter: 'languages',
			page: 1
		}
	}

	componentDidMount(){
		if (!checkIfLoggedIn()) {
			route(routes.LOGIN_OR_SIGNUP);
			return;
		}
		this.fetchPage(this.props);
		this.fetchPros(this.state.searchTerm, this.state.sortBy, this.state.page, this.state.filter);
	}

	fetchPage= (props) => {
		window.scrollTo(0, 0);
		props.changeLocale();
		props.changeLocaleLangs([]);
	}

	fetchPros= (searchTerm, sortBy, page, filter) => {
		this.setState({ loading: true, pros: [] });
		getPros(searchTerm, sortBy, page, filter, this.props.userData.userAuth).then((data) => {
	    	this.setState({
				pros: data.results ? data.results : [],
				searchTerm: this.props.searchTerm,
				loading: false
			});
		}).catch((error) => {
			console.log(error);
			this.setState({
				pros: [],
				searchTerm: this.props.searchTerm,
				loading: false
			})
		});
	}


	componentWillReceiveProps(nextProps){
		if (nextProps.searchTerm != this.state.searchTerm) {
			this.setState({pros: []});
			this.fetchPros(nextProps.searchTerm, this.state.sortBy, this.state.page, this.state.filter);
		}
	}

	sortToggleSwitched = (sortBy) =>{
		this.setState({ sortBy });
		this.fetchPros(this.state.searchTerm, sortBy, this.state.page, this.state.filter);
	}

	pageChange = (page) => {
		this.setState({ page });
		this.fetchPros(this.state.searchTerm, this.state.sortBy, page, this.state.filter);
	}

	onFilterChange = (filter) => {
		this.setState({ filter });
		this.fetchPros(this.state.searchTerm, this.state.sortBy, this.state.page, filter);
	}

	render() {

		return (
			<div id="search" className="uk-container" >
				<Helmet
					title="Telmie | Search"
				/>
				<h2>Results for: <span>{this.props.searchTerm} </span></h2>
				<div id="searchContainer">
					<div class={style.filterArea}>
						<RadioBtns data={ searchFilterItems } 
							disabled={this.state.loading}
							name='searchFilter'
							value = { this.state.filter }
							onChange={ this.onFilterChange }/>
					</div>
					<SideBar items={ searchSortingItems }
						disabled={this.state.loading}
						sortToggleSwitched = { this.sortToggleSwitched } 
						sortBy = { this.state.sortBy }/>
					{ (this.state.loading) ? (
						<Spinner />
					) : (
						<div>
							{this.state.pros.length > 0 ? (
								<div>
									<ProList pros = { this.state.pros } />
									<Pagination page = { this.state.page } noNext = {this.state.pros.length  < consts.PAGE_SIZE } pageChange = { this.pageChange }/>
								</div>
							) : (
								<div className={style.empty}>Sorry, no pros found for <span>{this.props.searchTerm}</span></div>
							)}
						</div>
					)}

				</div>
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
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Search);
