import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import EditProfileForm from '../../components/edit-profile/edit-profile-form';
import style from './style.scss';
import { editDetails, uploadPhoto } from '../../actions/user';
import Spinner from '../../components/global/spinner';
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
		this.editDetails = this.editDetails.bind(this);
	}
	componentDidMount(){
		this.fetchPage(this.props);
	}
	fetchPage(props) {
		if (props.prismicCtx) {
		// We are using the function to get a document by its uid
		return props.prismicCtx.api.getByID(props.uid).then((doc, err) => {
			if (doc) {
			// We put the retrieved content in the state as a doc variable
			this.setState({ regData: doc.data });
			} else {
			// We changed the state to display error not found if no matched doc
			this.setState({ notFound: !doc });
			}
		});
				/*
				return props.prismicCtx.api.query('').then(function(response) {
				console.log(response);
				});*/
		}
		return null;
	}
	componentWillReceiveProps(nextProps){
		this.fetchPage(nextProps);
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
	uploadPhoto
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfile);
