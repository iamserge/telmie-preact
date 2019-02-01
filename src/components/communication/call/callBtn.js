import { h } from 'preact';
import style from './style.scss';
import btnCallEnd from '../../../assets/btnCallEnd.png'
import btnCallStart from '../../../assets/btnCallStart.png'
import btnCancel from '../../../assets/btnCancel.png'
import btnText from '../../../assets/btnText.png'

import { chatBtns } from '../../../utils/consts'

const Btn = ({text, clickHandler}) => {
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
        <img src={src} onClick={clickHandler}/>
        <div class={style.btnText} onClick={clickHandler}>{text}</div>
    </div>)
}

export default Btn;