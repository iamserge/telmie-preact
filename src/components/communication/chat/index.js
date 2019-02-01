import { h } from 'preact';
import style from './style.scss';

import Title from './Title'
import Msg from './Message'
import SendForm from './SendForm'
import { apiRoot } from "../../../api/index";

const Chat = (props) => {
    const {messages = [], communicateModal = {}, users = {}} = props;
    const { unread } = communicateModal;
    const unreadKeys = Object.keys(unread);
    
    const onChangePerson = (person) => () => props.setChatPerson(person);

    const renderUnreadItem = (el) => {
        const _id =  el.split('@')[0];
        const user = props.users[_id];
        const {avatar, name = '', lastName = ''} = user ? user : {};
        const fullName = name + ' ' + lastName;
    
        return (<li key={el} onClick={onChangePerson(user)}>

            <div class={style.avatar}>
                { avatar ? (
                    <img src={apiRoot + 'image/' + avatar.id} alt={fullName} title={fullName} />
                ) : (
                    <img src="/assets/nouserimage.jpg" alt={fullName} title={fullName}/>
                )}
            </div>
            <div class={style.msgCount}>{unread[el]}</div>
        </li>)
    }

    return (<div class={style.chatComponent}>
        { communicateModal.person && <Title person={communicateModal.person}/> }
        <div class={style.chatArea}>
            { unreadKeys.length !== 0 && <ul class={style.users}>
                {unreadKeys.map(el => renderUnreadItem(el))}
            </ul> }
            <ul class={style.messages}>
                {messages.map((el, i) => <Msg {...el} key={i}/>)}
            </ul>
        </div>
        { communicateModal.person && <SendForm onSend={props.onSend}/> }
    </div>)
};

export default Chat;