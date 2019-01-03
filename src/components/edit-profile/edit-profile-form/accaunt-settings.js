import { h, Component } from 'preact';
import style from './style.scss';
import ToggleItem from "../../toggle-item";
import Card from '../../card'
import Hr from '../../hr'
import Spinner from '../../global/spinner';

const AccauntSettings = (props) => {
    const { userData } = props;
    const { pro = {} } = userData;


    return ( <Card cardClass={style.accSettingsCard}>
        {props.isLoading ? 
            <Spinner/> 
            : [
                <ToggleItem onToggle={props.switchEmailNotif} isSwitched={userData.emailNotifications}>Important via email</ToggleItem>,
                Object.keys(pro).length !== 0 && [
                    <Hr margin = {10} color={'rgba(0, 0, 0, 0.3'}/>,
                    <ToggleItem onToggle={props.switchWorkingPro} isSwitched={pro.workPro}>Working as Pro</ToggleItem>,
                ]
            ]
        }
    </Card>)
} 

export default AccauntSettings;