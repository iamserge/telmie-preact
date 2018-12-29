import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import style from './style.scss';

import Settings from '../../components/settings';

import { uploadPhoto, editDetails,
	changeLocaleLangs, changeLocale } from '../../actions/user';
import Spinner from '../../components/global/spinner';


class SettingsPage extends Component {
	constructor(props){
		super(props);
	}

	componentDidMount(){
		this.props.changeLocaleLangs([]);
		this.props.changeLocale();
	}

	render() {
		const {userData = {}} = this.props;
		return (
			<div className="uk-container uk-container-small">
				<h1>Settings</h1>
				{(Object.keys(userData).length != 0) ? (
                    <Settings userData = { this.props.userData } 
                        uploadPhoto = { this.props.uploadPhoto }
                        editDetails = { this.props.editDetails } 
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
    uploadPhoto,
	editDetails,
	changeLocaleLangs,
	changeLocale,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsPage);
