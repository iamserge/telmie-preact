import { h } from 'preact';
import style from './style.scss';

import Title from './Title'
import Msg from './Message'
import SendForm from './SendForm'

const Chat = (props) => {
    const {messages = [], communicateModal = {}} = props;
    const { unread } = communicateModal;
    const unreadKeys = Object.keys(unread);
    
    const onChangePerson = (person) => () => props.setChatPerson(person);

    return (<div class={style.chatComponent}>
        { communicateModal.person && <Title person={communicateModal.person}/> }
        <div class={style.chatArea}>
            { unreadKeys.length !== 0 && <ul class={style.users}>
                {unreadKeys.map(el => (<li key={el} onClick={onChangePerson({ id: el.split('@')[0] })}>
                    {el.split('@')[0]} {unread[el]}
                </li>))}
            </ul> }
            <ul class={style.messages}>
                {messages.map((el, i) => <Msg {...el} key={i}/>)}
            </ul>
        </div>
        <SendForm onSend={props.onSend}/>
    </div>)
};

export default Chat;