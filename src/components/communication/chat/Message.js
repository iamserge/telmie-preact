import { h } from 'preact';
import style from './style.scss';

const Message = ({text, ...msg}) => {
    const isMy = msg.isMy;

    return (<li class={`${style.msg} ${isMy && style.myMsg}`}>
        {text}
    </li>)
};

export default Message;