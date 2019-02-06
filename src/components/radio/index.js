import { h, Component } from 'preact';
import style from './style.scss';

const Radio = (props) => {
    const labelClass = props.labelClass ? props.labelClass : style.label;
    return (
        <div class={style.formRadio}>
            {props.label 
                && <label class={labelClass}>{props.label}</label>}



            <div class={ style.radioGroup }>
                {
                    props.data && props.data.length !== 0 && ( props.data.map(el => {
                        return (
                            <label class={`${style.container} ${props.disabled && style.disabledContainer}`} key={el.value}>
                                {el.name}
                                <input type="radio" 
                                    name= {props.name} 
                                    disabled={props.disabled}
                                    value={el.value}
                                    checked={el.value === props.value}
                                    onChange={props.onChange}/>
                                <span class = { style.checkmark }></span>
                            </label>
                        )
                    }))
                }
            </div>
        </div>
    )
};

export default Radio;