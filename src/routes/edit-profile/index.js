import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import EditProfileForm from '../../components/edit-profile/edit-profile-form';
import style from './style.scss';
import { editDetails } from '../../actions/user';
import Spinner from '../../components/global/spinner';

import { route } from 'preact-router';
import Redirect from '../../components/global/redirect';

class EditProfile extends Component {
	constructor(props){
		super(props);
		this.editDetails = this.editDetails.bind(this);
	}
	componentDidMount(){

	}
	componentWillReceiveProps(nextProps) {

	}

	editDetails(data){
		let newDetails = this.props.userData;
		newDetails.name = data.name,
		newDetails.lastName = data.lastName;
		newDetails.mobile = data.mobile;
		newDetails.dateOfBirth = data.dateOfBirth;
		newDetails.location = data.location
		if (data.pro) {
			newDetails.pro = {
				profession: data.profession,
				professionDescription: data.professionDescription,
				category: data.sector,
				subCategory: data.sectorCategory,
				costPerMinute: data.rate
			}
		} else {
			newDetails.pro = null
		}
		this.props.editDetails(newDetails);
	}
	render() {
		return (
			<div className="uk-container uk-container-small" id="editProfile" >
				<h1>Edit profile</h1>
				{(Object.keys(this.props.userData).length != 0) ? (
					<EditProfileForm userData = { this.props.userData } editDetails = { this.editDetails }/>
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
	editDetails
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfile);
