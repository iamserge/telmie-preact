import { h, Component } from 'preact';
import style from './style.scss';
import ToggleItem from "../../toggle-item";
import Card from '../../card'
import Spinner from '../../global/spinner';

const AccauntSettings = (props) => {
    const { emailNotifications } = props.userData;
    


    return ( <Card cardClass={style.accSettingsCard}>
        {props.isLoading ? 
            <Spinner/> 
            : [
                <ToggleItem onToggle={props.switchEmailNotif} isSwitched={emailNotifications}>Important via email</ToggleItem>
            ]
        }
    </Card>)
} 

export default AccauntSettings;