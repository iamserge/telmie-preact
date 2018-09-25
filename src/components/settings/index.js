import { h, Component } from 'preact';
import style from './style.scss';
import Card from "./card"
import ImageUploader from 'react-images-upload';

import { apiRoot } from '../../api';
import { changeDateISOFormat } from '../../utils/index'

export default class Settings extends Component {

    onDrop = (picture) => {
		this.props.uploadPhoto(this.props.userData.userAuth, picture[0]);
	}

    render(){
        const {userData = {}} = this.props;
        const {name, lastName, email, dateOfBirth, location, avatar } = userData;
        const {city} = JSON.parse(location);

        return (
            <div class= {style.settingsPage}>
                <div class={style.sectionsContainer}>
                    <Card class={style.sectionsCard}>
                        <ul class={style.sectionsList}>
                            <li>General</li>
                            <li>Pro details</li>
                            <li>Preview profile</li>
                        </ul>
                    </Card>
                </div>

                <div class={style.contentContainer}>
                    <Card class= {style.userInfoCard}>

                        <div className={style.userAvatar}>
                            <div className={style.image}>
                                { (avatar != null) ? (
                                    <img src={apiRoot + 'image/' + avatar.id} alt={name + ' ' + lastName} />
                                ) : (
                                    <img src="/assets/nouserimage.jpg" alt={name + ' ' + lastName} />
                                )}
                            </div>
                            <div className={style.upload}>
                                <ImageUploader
                                    withIcon={false}
                                    buttonText='Upload new'
                                    fileContainerStyle = {{padding: 0, margin: 0, boxShadow: 'none'}}
                                    onChange={this.onDrop}
                                    buttonClassName={style.uploadButton}
                                    imgExtension={['.jpg', '.png', '.gif']}
                                    maxFileSize={5242880}
                                />
                            </div>
                        </div>
                        
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
                    </Card>
                </div>
            </div>
        )
    }
}