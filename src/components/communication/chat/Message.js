import { h } from 'preact';
import style from './style.scss';

const Message = ({ text, isMy, senderName, timestamp }) => {

    return (<li class={`${style.msg} ${isMy && style.myMsg}`}>
        {text}
    </li>)
};

export default Message;