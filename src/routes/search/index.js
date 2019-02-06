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
import Pagination from '../../components/search/pagination';
import Spinner from '../../components/global/spinner';
import { checkIfLoggedIn } from '../../utils';
import { changeLocale, changeLocaleLangs } from '../../actions/user';
import { routes } from "../../components/app";

const searchSortingItems = [{
	name: 'Hourly rate',
	value: 'rate'
},{
	name: 'Rating',
	value: 'rating'
},{
	name: 'Experience',
	value: 'experience'
}];

class Search extends Component {
	constructor(props){
		super(props);
		this.state = {
			pros: [],
			searchTerm: this.props.searchTerm || '',
			loading: true,
			sortBy: 'rating',
			page: 1
		}
	}

	componentDidMount(){
		if (!checkIfLoggedIn()) {
			route(routes.LOGIN_OR_SIGNUP);
			return;
		}
		this.fetchPage(this.props);
		this.fetchPros(this.state.searchTerm, this.state.sortBy, this.state.page);
	}

	fetchPage= (props) => {
		window.scrollTo(0, 0);
		props.changeLocale();
		props.changeLocaleLangs([]);
	}

	fetchPros= (searchTerm, sortBy, page) => {
		let that = this;
		this.setState({ loading: true, pros: [] });
		getPros(searchTerm, sortBy, page,this.props.userData.userAuth).then(function(data) {
	    	that.setState({
				pros: data.results ? data.results : [],
				searchTerm: that.props.searchTerm,
				loading: false
			});
		}).catch(function(error) {
				that.setState({
					pros: [],
					searchTerm: that.props.searchTerm,
					loading: false
				})
		});
	}


	componentWillReceiveProps(nextProps){
		const that = this;
		if (nextProps.searchTerm != that.state.searchTerm) {
			that.setState({pros: []});
			that.fetchPros(nextProps.searchTerm, that.state.sortBy, that.state.page);
		}
	}

	sortToggleSwitched = (sortBy) =>{
		this.setState({ sortBy });
		this.fetchPros(this.state.searchTerm, sortBy, this.state.page);
	}

	pageChange = (page) => {
		this.setState({ page });
		this.fetchPros(this.state.searchTerm, this.state.sortBy, page);
	}


	render() {

		return (
			<div id="search" className="uk-container" >
				<Helmet
					title="Telmie | Search"
				/>
				<h2>Results for: <span>{this.props.searchTerm} </span></h2>
				<div id="searchContainer">
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
