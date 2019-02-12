import { h } from 'preact';
import style from './style.scss';

import Title from './Title'
import Msg from './Message'
import SendForm from './SendForm'
import { apiRoot } from "../../../api/index";

const Chat = (props) => {
    const { communicateModal = {}, users = {}, isConnected} = props;
    const { unread } = communicateModal;
    const unreadKeys = Object.keys(unread);
    
    const onChangePerson = (person) => () => props.chooseChatPerson(person);

    const renderUnreadItem = (el) => {
        const _id =  el.split('@')[0];
        const user = users[_id];
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
            <div class={style.authorName}>{fullName}</div>
        </li>)
    }

    return (<div class={style.chatComponent}>
        { !isConnected && <div class={style.connectingDiv}>
            <div class={style.ldsDefault}>
                <div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
                <div>Connecting</div>
            </div>
        </div>}
        
        { unreadKeys.length !== 0 && <ul class={style.users}>
            {unreadKeys.map(el => renderUnreadItem(el))}
        </ul> }
    </div>)
};

export default Chat;