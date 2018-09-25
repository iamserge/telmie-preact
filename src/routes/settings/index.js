import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';

import Settings from '../../components/settings';

import { uploadPhoto } from '../../actions/user';
import Spinner from '../../components/global/spinner';


class SettingsPage extends Component {
	constructor(props){
		super(props);
	}

	editDetails = (data) => {
		/*let newDetails = this.props.userData;
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
		this.props.editDetails(newDetails);*/
	}
	render() {
		return (
			<div className="uk-container uk-container-small">
				<h1>Settings</h1>
				{(Object.keys(this.props.userData).length != 0) ? (
                    <Settings userData = { this.props.userData } 
                        uploadPhoto = { this.props.uploadPhoto }
                    //    editDetails = { this.editDetails } 
                    />
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
	uploadPhoto
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsPage);
