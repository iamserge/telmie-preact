import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import style from './style.scss';
import { getTransactions,
	changeLocaleLangs, changeLocale } from '../../actions/user';
import Transactions from '../../components/profile/transactions';
import Pagination from '../../components/profile/pagination';
const MAX_ITEMS = 10;



class AllTransactions extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cutTransactions : [],
			currentPage: 1,
			loading: false
		}
	}
	componentDidMount(){
		if (typeof this.props.userData.userAuth != 'undefined') {
			this.setState({
				loading: true
			})
			this.props.getTransactions(this.props.userData.userAuth);
		}
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
}

	nextPage= () => {
		this.setState({
			 currentPage: this.state.currentPage + 1
		});
		this.changeTransactionsPage(this.state.currentPage );
	}
	previousPage = () => {
		this.setState({
			currentPage: this.state.currentPage - 1
		});
		this.changeTransactionsPage(this.state.currentPage );
	}
	changePage = (page) => {
		this.setState({
			currentPage: page
		});
		this.changeTransactionsPage(page);
	}
	changeTransactionsPage = (page) => {
		this.setState({
			cutTransactions: this.props.transactions.results.slice( (page - 1) * MAX_ITEMS,  page * MAX_ITEMS)
		})
	}

	componentWillReceiveProps(nextProps) {
		if ( typeof nextProps.userData.userAuth != 'undefined' && (nextProps.userData.userAuth != this.props.userData.userAuth)	) {
			this.setState({
				loading: true
			})
			this.props.getTransactions(nextProps.userData.userAuth);
		} else {
			this.setState({
				loading: false
			})
		}

		const { results = []} = nextProps.transactions
		if (results.length  > 0) {
			this.setState({
				loading: false
			})
			this.setState({
				cutTransactions: results.slice( (this.state.currentPage - 1) * MAX_ITEMS,  this.state.currentPage * MAX_ITEMS)
			})
		}

	}
	render() {
		const { results = []} = this.props.transactions;
		return (
			<div id="profile" className="uk-container uk-container-small" >
				<h1>Money</h1>
				<Transactions {...this.props.transactions} results = { this.state.cutTransactions } loading = { this.state.loading }/>
				<Pagination
					list = { results }
					changePage = { this.changePage }
					nextPage = { this.nextPage }
					previousPage = { this.previousPage }
					currentPage = { this.state.currentPage }

					max = {MAX_ITEMS}
					/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	transactions: state.loggedInUserTransactions
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getTransactions,
	changeLocaleLangs,
	changeLocale
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AllTransactions);
