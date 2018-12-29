import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import EditProfileForm from '../../components/edit-profile/edit-profile-form';
import style from './style.scss';
import { editDetails, uploadPhoto,
	changeLocaleLangs, changeLocale } from '../../actions/user';
import Spinner from '../../components/global/spinner';
import { getCookie } from "../../utils";
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import { route } from 'preact-router';
import Redirect from '../../components/global/redirect';

class EditProfile extends Component {
	constructor(props){
		super(props);
		this.state = {
			regData: null
		}
	}
	componentDidMount(){
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
	}

	editDetails = (data) => {
		let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 

		let newDetails = {
			...data,
			id: this.props.userData.id
		};
		
		this.props.editDetails(newDetails, userAuth);
	}
	render() {
		return (
			<div className="uk-container uk-container-small" id="editProfile" >
				<h1>Edit profile</h1>
				{(Object.keys(this.props.userData).length != 0) ? (
					<EditProfileForm regData = { this.state.regData } userData = { this.props.userData } editDetails = { this.editDetails } uploadPhoto = { this.props.uploadPhoto }/>
				) : (
					<Spinner />
				)}

			</div>

		);

	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({
	editDetails,
	uploadPhoto,
	changeLocaleLangs,
	changeLocale
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfile);
