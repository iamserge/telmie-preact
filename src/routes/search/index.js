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
			prevSearchTerm: this.props.searchTerm || '',
			loading: true,
			sortBy: 'rating',
			filter: 'languages',
			page: 1,
			showSearchIcon: false,
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
				searchTerm,
				prevSearchTerm: this.state.searchTerm,
				loading: false
			});
		}).catch((error) => {
			console.log(error);
			this.setState({
				pros: [],
				searchTerm,
				prevSearchTerm: this.state.searchTerm,
				loading: false
			})
		});
	}


	componentWillReceiveProps(nextProps){
		if (nextProps.searchTerm != this.state.searchTerm) {
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

	performSearch = (e, value) => {
		this.setState({ showSearchIcon: false });
		const term = value || this.state.searchTerm;
		term && this.fetchPros(term, this.state.sortBy, this.state.page, this.state.filter);; 
        
    };

    changeHandler = e => this.setState({ searchTerm: e.target.value || this.state.prevSearchTerm });

    keyHandler = e => {
        (e.keyCode == 13) && (
            e.preventDefault(),
            this.setState({ searchTerm: e.target.value || this.state.prevSearchTerm }),
            e.target.value && this.performSearch(_, e.target.value)
        )
	}

	hadlerFocus = () => this.setState({ showSearchIcon: true });
	handlerBlur = () => {
		(this.state.prevSearchTerm == this.state.searchTerm) && this.setState({ showSearchIcon: false })
	}
	
	render() {

		return (
			<div id="search" className="uk-container" >
				<Helmet
					title="Telmie | Search"
				/>
				<h2>Results for: <span class={style.searchContainer}>
						<input class={style.serchInput} 
							disabled={this.state.loading}
							value={this.state.searchTerm}
							onKeyDown={this.keyHandler}
							onChange={this.changeHandler}
							onFocus={this.hadlerFocus}
							onBlur={this.handlerBlur}/>

						<span style={{display: `${this.state.showSearchIcon ? 'block' : 'none'}`}} class={style.searchIcon} 
							onClick={this.performSearch} >
							<span class="icon-magnifying-glass"/>
						</span>
					</span>
				</h2>
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
								<div className={style.empty}>Sorry, no pros found for <span>{this.state.searchTerm}</span></div>
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
