import { h, Component } from 'preact';
import style from './style.scss';

const Card = props =>  {

    return (
        <div class={`${style.cardContainder} ${props.class ? props.class : ''}`}>
            {props.children}
        </div>
    )
}

export default Card;