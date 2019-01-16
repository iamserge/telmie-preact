import { h } from 'preact';
import style from './style.scss';

import Title from './Title'
import Msg from './Message'
import SendForm from './SendForm'

const Chat = (props) => {
    const {messages = [], communicateModal = {}} = props;

    return (<div class={style.chatComponent}>
        <Title person={communicateModal.person}/>
        <div class={style.chatArea}>
            <ul class={style.chatArea}>
                {messages.map((el, i) => <Msg {...el} key={i}/>)}
            </ul>
        </div>
        <SendForm onSend={props.onSend}/>
    </div>)
};

export default Chat;