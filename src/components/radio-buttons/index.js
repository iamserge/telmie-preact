import { h, Component } from 'preact';
import style from './style.scss';

const RadioButtons = (props) => {
    const onChange = (e) => props.onChange(e.target.value);

    const generateId = el => `${el.value}_${props.name}`;

    return (
        <form onChange={onChange}>
            <div class={style.radioGroup}>
                {
                    props.data && props.data.map(el => ([
                        <input type="radio" id={generateId(el)} 
                            disabled={props.disabled}
                            name={props.name} 
                            value={el.value} 
                            checked={el.value === props.value}/>,
                        <label for={generateId(el)}>{el.name}</label>
                    ]))
                }
            </div>
        </form>
    )
};

export default RadioButtons;