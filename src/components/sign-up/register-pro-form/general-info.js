import { h, Component } from 'preact';
import Radio from '../../radio'
import { accountTypeArr } from "../../../utils/proPending";
import style from './style.scss';

const GeneralInfo = ({ accountType, userData={}, onChangeHandler}) => {
    const {name, lastName, email} = userData;

    return (<div class = {style.generalInfo}>
        <div>
            <div class = { style.key }>Name:</div>
            <div class = { style.value }>{ name } { lastName }</div>
        </div>

        <div>
            <div class = { style.key }>Email:</div>
            <div class = { style.value }>{email}</div>
        </div>

        <Radio name='accountType'
            value={accountType} 
            label='I am:' 
            disabled={true}
            onChange = {onChangeHandler}
            data = {accountTypeArr}/>
        <em style={{display: "block", textAlign: "center", color: "gray"}}>Registration as a Company is coming soon.</em>
    </div>)
}

export default GeneralInfo;