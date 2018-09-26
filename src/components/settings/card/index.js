import { h, Component } from 'preact';
import style from './style.scss';

const Card = props =>  {

    return (
        <div class={`${style.cardContainder}`}>

            {props.headerText && <div class = {style.cardHeader}>
                {props.headerText}
                {props.headerBtnText 
                    && <div class={style.headerBtn} onClick={props.onHeadetBtnClick}>
                        {props.headerBtnText}
                    </div>}
            </div>}

            <div class={`${props.class ? props.class : ''}`}>
                {props.children}
            </div>
        </div>
    )
}

export default Card;