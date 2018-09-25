import { h, Component } from 'preact';
import style from './style.scss';

import Switch from 'react-toggle-switch'


const ToggleItem = props =>  {

    return (
        <div class={`${style.toggleItem}`}>
            {props.children}
            <Switch onClick={props.onToggle} on={props.isSwitched}/>
        </div>
    )
}

export default ToggleItem;