import { h, Component } from 'preact';
import style from './style.scss';
import Card from "../card"
import FontAwesome from 'react-fontawesome';
import SimpleReactValidator from 'simple-react-validator';
import ToggleItem from "../toggle-item"
import ImageUploader from 'react-images-upload';
import { apiRoot } from "../../api";


import { changeDateISOFormat, getCookie } from '../../utils/index'

class GeneralTab extends Component{
    constructor(props){
        super(props);

        this.state = {
            isInEdit: false,
            switched: true,
        }

        this.validator = new SimpleReactValidator();
    }

    onDrop = (picture) => {
		this.props.uploadPhoto(this.props.userData.userAuth, picture[0]);
    }

    onStartEdit = () => {
        const {userData = {}} = this.props;
        let data = {...userData};
        data.location = JSON.parse(userData.location);
        this.setState({isInEdit: true, userData: data});
    }

    updateProfileHandler = () => {
        if (this.validator.allValid()) {
			let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 
 			if(userAuth) {
                const {id, email, name, lastName, location, mobile, dateOfBirth, userAuth} = this.state.userData;
                let date = new Date(dateOfBirth);
                let data = {id, email, name, lastName, mobile, userAuth};
                data.location = JSON.stringify(location);
                
                data.dob = {
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                }
                this.props.editDetails(data);
                this.setState({isInEdit: false});
			}
		} else {
			this.validator.showMessages();
			this.forceUpdate();
		}
    }

    toggleSwitch = () => {
        //this.setState(prevState => {return {switched: !prevState.switched}});
    };

    onChangeHandler = (e) => {
        const {name, value} = e.target;

        this.setState(prev => {
            return (['country','city','line1','postCode'].indexOf(name) === -1) ? (
                name === 'dob' ? {
                    userData: {
                        ...prev.userData,
                        dateOfBirth: value ? new Date(value).toISOString() : '',
                    }
                } : ({
                    userData:{ ...prev.userData, [name]: value, }
                })
            ) : ({
                userData: {
                    ...prev.userData,
                    location: {
                        ...prev.userData.location,
                        [name]: value,
                    }
                }
            })
            
        })
    }

    renderGeneralInfo = () => {
        const {userData = {}} = this.props;
        const {name, lastName, email, dateOfBirth, location } = userData;
        const {city, line1, postCode, country} = location ? JSON.parse(location) : {};

        return (
            <div class = {style.userInfo}>
                <div>
                    <span className={style.key}>Name:</span>
                    <span className={style.value}>{name}</span>
                </div>
                <div>
                    <span className={style.key}>Last name:</span>
                    <span className={style.value}>{lastName}</span>
                </div>
                <div>
                    <span className={style.key}>Email:</span>
                    <span className={style.value}>{email}</span>
                </div>
                <div>
                    <span className={style.key}>Date of birth:</span>
                    <span className={style.value}>{ dateOfBirth ? changeDateISOFormat(dateOfBirth) : 'TBC' }</span>
                </div>

                <div>
                    <span className={style.key}>Address</span>
					<span className={style.value}>{(line1 != null) ? line1 : 'TBC'}</span>
				</div>

				<div>
                    <span className={style.key}>City</span>
					<span className={style.value}>{(city != null) ? city : 'TBC'}</span>
				</div>
				<div>
                    <span className={style.key}>Post Code</span>
					<span className={style.value}>{(postCode != null) ? postCode : 'TBC'}</span>
				</div>

            </div>
        )
    }

    renderEditGeneralInfo = () => {
        const {name, lastName, email, dateOfBirth, location } = this.state.userData;
        const {city, line1, postCode, country} = location ? location : {};

        const dob = dateOfBirth ? changeDateISOFormat(dateOfBirth) : '';

        return (
            <div>
                <div className="input-container">
					<label for="name">Name</label>
					<input type="text" name="name" value={name} onChange={this.onChangeHandler} className="uk-input"/>
 					{this.validator.message('name', name, 'required', 'validation-tooltip right',  {required: 'Please enter name'})}
				</div>

                <div className="input-container">
					<label for="lastName">Last name</label>
					<input type="text" name="lastName" value={lastName} onChange={this.onChangeHandler} className="uk-input"/>
 					{this.validator.message('lastName', lastName, 'required', 'validation-tooltip right',  {required: 'Please enter last name'})}
				</div>

                <div className="input-container">
					<label for="email">Email</label>
					<input type="text" name="email" value={email} onChange={this.onChangeHandler} className="uk-input"/>
 					{this.validator.message('email', email, 'required|email', 'validation-tooltip right',  {required: 'Please enter email', email: 'Please enter a valid email'})}
				</div>

                <div className="input-container">
					<label for="dob">Date of birth</label>
					<input type="date" name="dob" value={dob} onChange={this.onChangeHandler} className="uk-input"/>
				</div>

                <div className="input-container">
					<label for="city">Location</label>
					<input type="text" name="city" value={city} onChange={this.onChangeHandler} className="uk-input"/>
				</div>

                <div className="input-container">
					<label for="line1">Address</label>
					<textarea name="line1" value={line1} onChange={this.onChangeHandler} className="uk-textarea"/>
				</div>

				<div className="double-input-container">
					<div className="input-container">
						<label for="city">City</label>
						<input type="text" name="city" value={city} onChange={this.onChangeHandler} className="uk-input"/>
					</div>
					<div className="input-container">
						<label for="postCode">Post Code</label>
						<input type="text" name="postCode" value={postCode} onChange={this.onChangeHandler} className="uk-input" />
					</div>
				</div>

                <div style={{textAlign: 'center'}}>
                    <button className='uk-button' onClick={this.updateProfileHandler}>
                        Save
                    </button>
                </div>
            </div>
        );
    }

    render(){
        const {userData = {}} = this.props;
        const {name, lastName, pro, avatar } = userData;
    
        return (
            <div class={style.contentContainer}>
                <Card class= {style.userInfoCard}>
                    {!this.state.isInEdit 
                        && <div class={style.editBtn} onClick={this.onStartEdit}>Edit <FontAwesome name="pencil" /></div>}
                    <div className={style.userAvatar}>
                        <div className={style.image}>
                            { (avatar != null) ? (
                                <img src={apiRoot + 'image/' + avatar.id} alt={name + ' ' + lastName} />
                            ) : (
                                <img src="/assets/nouserimage.jpg" alt={name + ' ' + lastName} />
                            )}
                        </div>
                        {this.state.isInEdit 
                            && <div className={style.upload}>
                            <ImageUploader
                                withIcon={false}
                                buttonText='Upload new'
                                fileContainerStyle = {{padding: 0, margin: 0, boxShadow: 'none'}}
                                onChange={this.onDrop}
                                buttonClassName={style.uploadButton}
                                imgExtension={['.jpg', '.png', '.gif']}
                                maxFileSize={5242880}
                            />
                        </div>}
                    </div>
    
                    {this.state.isInEdit ? 
                        this.renderEditGeneralInfo() : this.renderGeneralInfo()}
                    
                </Card>
    
                <Card headerText = 'Choose how you want to be informed'>
                    <ToggleItem onToggle={this.toggleSwitch} isSwitched={this.state.switched}>Important via email</ToggleItem>
                </Card>
            </div>
        )
    }
    
}


export default GeneralTab;