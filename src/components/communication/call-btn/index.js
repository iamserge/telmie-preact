import { h } from 'preact';
import FontAwesome from 'react-fontawesome';

import style from './style.scss';
import btnCallEnd from '../../../assets/btnCallEnd.png'
import btnCallStart from '../../../assets/btnCallStart.png'
import btnCancel from '../../../assets/btnCancel.png'
import btnText from '../../../assets/btnText.png'

import btnControlVideo from '../../../assets/btnControlVideo.png'
import btnControlSpeaker from '../../../assets/btnControlSpeaker.png'
import btnControlMute from '../../../assets/btnControlMute.png'

import { chatBtns } from '../../../utils/consts'

export const Btn = ({text, clickHandler}) => {
    let src;
    switch (text){
        case chatBtns.cancel:
            src = btnCancel;
            break;
        case chatBtns.decline:
        case chatBtns.finish:
            src = btnCallEnd;
            break;
        case chatBtns.pickUp:
            src = btnCallStart;
            break;
        case chatBtns.textMe:
            src = btnText;
            break;
    }

    return (<div class={style.btn}>
        <img class={style.btnImg} src={src} onClick={clickHandler}/>
        <div class={style.btnText} onClick={clickHandler}>{text}</div>
    </div>)
}

export const ControlBtn = ({type, clickHandler, isTurnOff, isFullScreen}) => {
    let el;
    switch (type){
        case chatBtns.control.mute:
            el = <img src={btnControlMute}/>;
            break;
        case chatBtns.control.speaker:
            el = <img src={btnControlSpeaker}/>;
            break;
        case chatBtns.control.video:
            el = <img src={btnControlVideo}/>;
            break;
        case chatBtns.control.fullScreen:
            el = isFullScreen ? 
                <FontAwesome name="compress" size="3x" /> 
                : <FontAwesome name="expand" size="3x" />
            break;
    }

    return el && (<div class={style.controlBtn} onClick={clickHandler}>
        {el}
        { isTurnOff && <div class={style.lineThrough}/>}
    </div>)
}