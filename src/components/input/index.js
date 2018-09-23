import { h, Component } from 'preact';
import style from './style.scss';

const Input = props => {
    const errorClass = props.error === true ? style.error : '';

    return (
        <div class={style.formInput}>
            {props.label && <label class={errorClass}>{props.label}</label>}
            <input
                type="text"
                disabled={props.disabled}
                style = {props.postTab ? {paddingRight: '100px'} : {}}
                placeholder = {props.placeholder}
                name={props.name}
                onChange={props.onChange}
                class={errorClass}
                value = {props.value}/>
            {props.postTab 
                && <div class={style.postTab}>{props.postTab}</div>}
        </div>
    )
};

export default Input;