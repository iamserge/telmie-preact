import { h, Component } from 'preact';
import style from './style.scss';

const Input = props => {
    
    return (
        <div class={style.formInput}>
            {props.label && <label>{props.label}</label>}
            <input
                type="text"
                style = {props.postTab ? {paddingRight: '100px'} : {}}
                placeholder = {props.placeholder}
                name={props.name}
                onChange={props.onChange}
                value = {props.value}/>
            {props.postTab 
                && <div class={style.postTab}>{props.postTab}</div>}
        </div>
    )
};

export default Input;