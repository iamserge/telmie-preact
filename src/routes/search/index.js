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
class Search extends Component {
	constructor(props){
		super(props);
		this.state = {
			pros: [],
			searchTerm: this.props.searchTerm || '',
			loading: true,
			sortBy: 'rate',
			page: 1
		}
		this.sortToggleSwitched = this.sortToggleSwitched.bind(this);
		this.pageChange = this.pageChange.bind(this);
	}

	componentDidMount(){
		if (!checkIfLoggedIn()) {
			route('/login-or-signup');
			return;
		}
		const that = this;
		this.fetchPros(this.state.searchTerm, this.state.sortBy, this.state.page);
	}


	fetchPros(searchTerm, sortBy, page){
		let that = this;
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

	sortToggleSwitched(sortBy){
		this.setState({
			sortBy: sortBy
		});
		this.fetchPros(this.state.searchTerm, sortBy, this.state.page);
	}

	pageChange(page){
		this.setState({
			page: page
		});
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
					<SideBar sortToggleSwitched = { this.sortToggleSwitched } sortBy = { this.state.sortBy }/>
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

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Search);
