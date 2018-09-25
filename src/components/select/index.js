import { h, Component } from 'preact';
import style from './style.scss';

const Select = (props) => {
    const errorClass = props.error === true ? style.error : '';
    
    return (
        <div class={style.formSelect}>
            {props.label && <label class={errorClass}>{props.label}</label>}
            <select name={props.name}
                disabled={props.disabled}
                class={errorClass}
                onChange={props.onChange}
                value = {props.value}>
                {
                    props.data && props.data.length !== 0 && ( props.data.map(el => {
                        return props.isArrayData ? 
                            (<option value={el} key={el}>{el}</option>) 
                            : (<option value={el.value} key={el.value}>{el.name}</option>)
                    }))
                }
            </select>
        </div>
    )
};

export default Select;