import { h, Component } from 'preact';
import style from './style.scss';
import Card from "./card"
import ToggleItem from "./toggle-item"
import ImageUploader from 'react-images-upload';
import FontAwesome from 'react-fontawesome';
import SimpleReactValidator from 'simple-react-validator';
import Switch from 'react-toggle-switch'

import { apiRoot } from '../../api';
import { changeDateISOFormat } from '../../utils/index'

const links = [{
    name: 'general',
    content: 'General',
},{
    name: 'pro',
    content: 'Pro details',
},{
    name: 'preview',
    content: 'Preview profile',
}]

export default class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            activeLink: links[0].name,
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

    onChangeHandler = (e) => {
        const {name, value} = e.target;

        this.setState(prev => {
            return name === 'dob' ? {
                userData: {
                    ...prev.userData,
                    dateOfBirth: value ? new Date(value).toISOString() : '',
                }
            } : (
                name === 'city' ? {
                    userData: {
                        ...prev.userData,
                        location: {
                            ...prev.userData.location,
                            city: value
                        }
                    }
                } : {
                    userData:{ ...prev.userData, [name]: value, }
                }
            )
        })

    }

    updateProfileHandler = () => {
        if (this.validator.allValid()) {
			let userAuth = this.props.userData.userAuth || getCookie('USER_AUTH'); 
 			if(userAuth) {
                let data = {...this.state.userData};
                data.location = JSON.stringify(this.state.userData.location);
                
                this.props.editDetails(data);
			}
		} else {
			this.validator.showMessages();
			this.forceUpdate();
		}
    }
    
    onNavigateHandler = (e) => {
        this.setState({activeLink: e.target.getAttribute('name')})
    }

    renderGeneralInfo = () => {
        const {userData = {}} = this.props;
        const {name, lastName, email, dateOfBirth, location } = userData;
        const {city} = location ? JSON.parse(location) : {};

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
                    <span className={style.key}>Location:</span>
                    <span className={style.value}>{(city != null) ? city : 'TBC'}</span>
                </div>
            </div>
        )
    }

    renderEditGeneralInfo = () => {
        const {name, lastName, email, dateOfBirth, location } = this.state.userData;
        const {city} = location ? location : {};

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
                <div style={{textAlign: 'center'}}>
                    <button className='uk-button' onClick={this.updateProfileHandler}>
                        Save
                    </button>
                </div>
            </div>
        );
    }

    renderGeneralTab = () => {
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

    renderProTab = () => {
        return (
            null
        )
    }

    renderPreviewTab = () => {
        return (
            null
        )
    }

    toggleSwitch = () => {
        //this.setState(prevState => {return {switched: !prevState.switched}});
    };

    render({userData = {}}){
        

        let tabContent = null;

        switch (this.state.activeLink) {
            case 'general':
                tabContent = this.renderGeneralTab();
                break;
            case 'pro':
                tabContent = this.renderProTab();
                break;
            case 'preview':
                tabContent = this.renderPreviewTab();
                break;
          }

        return (
            <div class= {style.settingsPage}>
                <div class={style.sectionsContainer}>
                    <Card class={style.sectionsCard}>
                        <ul class={style.sectionsList}>
                            {
                                links.map(el => {
                                    return el.name == 'pro' ? (
                                        userData.pro != null && (<li onClick = {this.onNavigateHandler} 
                                                            key={el.name} 
                                                            name={el.name} 
                                                            class={this.state.activeLink === el.name ? style.activeLink : ''}>{el.content}</li>)
                                    ) : (
                                        <li onClick = {this.onNavigateHandler} 
                                            key={el.name} 
                                            name={el.name}
                                            class={this.state.activeLink === el.name ? style.activeLink : ''}>{el.content}</li>
                                    )
                                })
                            }
                        </ul>
                    </Card>
                </div>

                {tabContent}

            </div>
        )
    }
}