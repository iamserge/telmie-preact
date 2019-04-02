import { h, Component } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Switch from 'react-toggle-switch'
import { Link } from 'preact-router/match';
import SimpleReactValidator from 'simple-react-validator';
import { apiRoot } from '../../../api';
import { generateProfessionsArray } from '../../../utils';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import ImageUploader from 'react-images-upload';
import { routes } from "../../app";

import ImageUpload from '../image-upload'

const setUserInfo = (user) => {
	return {
		name: user.name,
		lastName: user.lastName,
	}
}

export default class EditProfileForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			userInfo: setUserInfo(this.props.userData),

			loading: false,
			isModify: false,
		}
		this.validator = new SimpleReactValidator({
			name: {
				message: "The name isn't valid.",
				rule: (val, params, validator) => /^[A-Za-z\s\-]+$/.test(val)
			}  
		});
		
	}
	
	componentWillReceiveProps(nextProps){
		this.setState({loading: false, isModify: false, userInfo: setUserInfo(nextProps.userData)})
	}
	onDrop = (picture) => {
		this.props.uploadPhoto(this.props.userData.userAuth, picture);
	}
	onChange = (e) => {
		const {name, value} = e.target;
		this.setState(prev => ({
			...prev,
			userInfo: {
				...prev.userInfo,
				[name]: value,
			},
			isModify: true,
		}))
	}

	onSave = () => {
		if (this.validator.allValid()) {
			this.setState({loading: true});
			this.props.editDetails(this.state.userInfo);
		} else {
			this.validator.showMessages();
			this.forceUpdate();
		}
	}

	render() {
		const userData  = this.props.userData;
		const { name, lastName } = this.state.userInfo;
		const avatarID = (userData.avatar == null) ? null : userData.avatar.id;

		if (!this.state.loading) {
			return (
				<div className={style.editProfile}>
				  { this.props.registerFailure && (
						<div className={style.failure}>Sorry, account with this email address already exists</div>
					)}
					<div className={style.imageContainer}>
						<div className={style.image}>
							{ (avatarID !== null) ? (
								<img src={apiRoot + 'image/' + avatarID} alt={userData.name + ' ' + userData.lastName} />
							) : (
								<img src="/assets/nouserimage.jpg" alt={userData.name + ' ' + userData.lastName} />
							)}
						</div>
						<div className={style.upload}>

							{/*<ImageUploader
								withIcon={false}
								buttonText='Upload new'
								onChange={this.onDrop}
								imgExtension={['.jpg', '.png', '.gif']}
								maxFileSize={5242880}
							/>*/}

							<ImageUpload onDrop={this.onDrop} imgExtension={['jpg', 'jpeg', 'png', 'gif']} maxFileSize={5242880} 
								clearuploadPhotoStatus = { this.props.clearuploadPhotoStatus }
								avatarID = {avatarID} uploadFailure={userData.avatarUploadError}/>
							
							
						</div>

					</div>
					<div className={style.userDetails}>
						<div className="double-input-container">
							<div className="input-container">
								<label for="firstName">First name</label>
								<input type="text" name="name" value={name} onChange={this.onChange} className="uk-input" id="name"/>

								{this.validator.message('firstName', name, 'required|name', 'validation-tooltip', {required: 'Please enter first name'})}
							</div>
							<div className="input-container">
								<label for="password">Last name</label>
								<input type="text" name="lastName" value={lastName} onChange={this.onChange} className="uk-input"	id="lastName" />

								{this.validator.message('lastName', lastName, 'required|name', 'validation-tooltip right', {required: 'Please enter last name'})}
							</div>
						</div>
						{/*<div className="double-input-container">
							<div className="input-container">
								<label for="firstName">Mobile phone</label>
								<input type="text" name="mobile" value={mobile} onChange={this.onChange} className="uk-input" id="mobile"/>

							</div>
							<div className="input-container">
								<label for="password">Location</label>
								<input type="text" name="location" value={location} onChange={this.onChange} className="uk-input"	id="location" />

							</div>
						</div>
						<div className="input-container">
							<label for="dateOfBirth">Date of birth</label>
							<input type="date" name="dateOfBirth" value={dateOfBirth} onChange={this.onChange} className="uk-input" id="dateOfBirth"/>
						</div>*/}

						<div className="switchContainer" id={style.proSwitch}>
						{ (this.props.userData.pro) ? 
							<Link href={routes.REGISTER_PRO}>Edit Pro details</Link> 
							: <Link href={routes.REGISTER_PRO}>Register as pro</Link>}
						</div>

						<button className="uk-button" onClick={this.onSave}>Save</button>
					</div>


				</div>
			)

		} else {
			return <Spinner />
		}
	}
}
