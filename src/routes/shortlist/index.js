import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';
import { logIn, getShortlist } from '../../actions/user';
import { route } from 'preact-router';
import ProList from '../../components/search/pros-list';
import Spinner from '../../components/global/spinner';


class Activity extends Component {

	constructor(props) {
		super(props);
		this.state = {
			shortlist: []
		}

	}
	componentDidMount(){
		if (this.props.userData.userAuth && this.props.shortlistPros.length == 0) {
			let that = this;
			this.setState({
				loading: true
			})
			this.props.getShortlist(this.props.userData.userAuth);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.userData.userAuth != this.props.userData.userAuth){
			this.props.getShortlist(nextProps.userData.userAuth);
		}
	}

	render() {
		const user = this.props.userData;
		return (
			<div id="profile" className="uk-container uk-container-small" >
				<h1>
					 My Shortlist
				</h1>
				<ProList
				 	pros = {this.props.shortlistPros} full = { true }/>

			</div>
		);
	}
}

const mapStateToProps = (state) => ({
 	userData: state.loggedInUser,
	shortlistPros: state.shortlistPros
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getShortlist

}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Activity);
