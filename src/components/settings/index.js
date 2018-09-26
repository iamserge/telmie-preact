import { h, Component } from 'preact';
import style from './style.scss';
import Card from "./card"
import ToggleItem from "./toggle-item"
import ImageUploader from 'react-images-upload';
import FontAwesome from 'react-fontawesome';
import SimpleReactValidator from 'simple-react-validator';
import Switch from 'react-toggle-switch'
import { route } from 'preact-router';

import {routes} from '../app'
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
            activeLink: links[1].name,
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

    onEditPro = () => {
        route(routes.REGISTER_PRO);
    }

    renderProTab = () => {
        const {userData = {}} = this.props;
        const { pro = {}, mobile, dateOfBirth, location, name, lastName } = userData;
        const {subCategory, costPerMinute, professionDescription, category, profession} = pro;

        const {country, city, line1, postCode} = location ? JSON.parse(location) : {};

        const {businessName,
			compHouseNumber,
			compAddress,
			compCity,
			compPostCode,
			compCountry} = userData;

        console.log(userData);

        return (
            <div class={style.contentContainer}>
                <Card headerText = 'Pro details' headerBtnText = 'Edit' onHeadetBtnClick = {this.onEditPro}>
                    {(businessName || compHouseNumber || compAddress || compCity || compPostCode || compCountry)
                        && [
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Business name:</div>
                                    <div class={style.value}>{businessName}</div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Companies House registration number:</div>
                                    <div class={style.value}>{compHouseNumber}</div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Company address:</div>
                                    <div class={style.value}>{compAddress}</div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.doubleItems}>
                                    <div class={style.singleItem}>
                                        <div class={style.key}>City:</div>
                                        <div class={style.value}>{compCity}</div>
                                    </div>
                                    <div class={style.singleItem}>
                                        <div class={style.key}>Post Code:</div>
                                        <div class={style.value}>{compPostCode}</div>
                                    </div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Country:</div>
                                    <div class={style.value}>{compCountry}</div>
                                </div>
                            </div>),
                        ]}
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Personal address:</div>
                            <div class={style.value}>{line1}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.doubleItems}>
                            <div class={style.singleItem}>
                                <div class={style.key}>City:</div>
                                <div class={style.value}>{city}</div>
                            </div>
                            <div class={style.singleItem}>
                                <div class={style.key}>Post Code:</div>
                                <div class={style.value}>{postCode}</div>
                            </div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Country:</div>
                            <div class={style.value}>{country}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Date of birth:</div>
                            <div class={style.value}>{changeDateISOFormat(dateOfBirth)}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service name:</div>
                            <div class={style.value}>{profession}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service category:</div>
                            <div class={style.value}>{category}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service sub-category:</div>
                            <div class={style.value}>{subCategory}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service description:</div>
                            <div class={style.value}>{professionDescription}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Rate:</div>
                            <div class={style.value}>£ {costPerMinute} / min</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Mobile:</div>
                            <div class={style.value}>{mobile}</div>
                        </div>
                    </div>
                </Card>

                <Card headerText="Bank account">
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Name:</div>
                            <div class={style.value}>{name} {lastName}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Entity:</div>
                            <div class={style.value}></div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Address:</div>
                            <div class={style.value}>{line1}, {city}, {postCode}, {country}</div>
                        </div>
                    </div>
                    <div class={style.cardInfoText}>
                        Your name, entity and address should match the details of your bank account. To change any of the info above, please submit new Pro application.
                    </div>

                    <div className="double-input-container" style={{dosplay: 'flex', justifyContent: 'space-between'}}>
                        <div className="input-container">
                            <label for="sortCode">Sort code</label>
                            <input type="text" name="sortCode" className="uk-input"/>

                            {/*this.validator.message('city', city, 'required', 'validation-tooltip', {required: 'Please enter city'})*/}
                        </div>
                        <div className="input-container">
                            <label for="accountNumber">Account number</label>
                            <input type="text" name="accountNumber" className="uk-input" />

                            {/*this.validator.message('postCode', postCode, 'required', 'validation-tooltip right', {required: 'Please enter post code'})*/}
                        </div>

                        
                    </div>

                    <div style={{textAlign: 'center'}}>
                        <button className='uk-button' onClick={() => {}}>
                            Submit
                        </button>
                    </div>
                </Card>

                <Card headerText="ID Verification">
                    <div class={style.cardInfoText}>
                        Please upload your ID to lift the £2,000 limit of your payouts. The ID should be either a UK passport or a UK driving licence in the name of Mykola Adeyev. 
                    </div>
                    <button className='uk-button' onClick={() => {}}>
                        Upload
                    </button>
                </Card>
            </div>
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