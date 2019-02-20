import { h, Component } from 'preact';
import Radio from '../../radio'
import { accountTypeArr } from "../../../utils/proPending";
import style from './style.scss';

const GeneralInfo = ({ accountType, userData={}, onChangeHandler, isPending}) => {
    const {name, lastName, email, pro } = userData;

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
            wrapperClass={style.radioWapper}
            value={accountType} 
            label='I am:' 
            disabled={pro || isPending}
            onChange = {onChangeHandler}
            data = {accountTypeArr}/>
    </div>)
}

export default GeneralInfo;