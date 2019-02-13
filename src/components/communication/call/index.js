import { h } from 'preact';
import style from './style.scss';
import { Btn, ControlBtn } from "../call-btn";

import { apiRoot } from "../../../api/index";
import { chatBtns } from '../../../utils/consts'


const Call = ({ 
    communicateModal = {}, rejectCall, pickUp, changeType, videoOptions, callControls, ...props
}) => {
    const { person = {}, isIncoming, isOutcoming, isBusy, isCalling, callInfo = {}, isSpeaking }  = communicateModal;
    const {error, info } = callInfo;

    const { name = '', lastName = '', pro, avatar } = person;


    const fullName = name + ' ' + lastName;
    const title = isSpeaking ? 'On call with' 
            : isCalling ? 'Connecting with'
                : isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';
    const descr = isIncoming ? 'Your client' : pro && pro.profession;
    const _info = error ? info : '';

    const btns = isIncoming ? [{
            txt: chatBtns.decline,
            handler: (e) => rejectCall(true),
        }, {
            txt: chatBtns.pickUp,
            handler: pickUp
        }] : [];


    const avatarEl = (
        <div class={style.avatar}> { avatar ? (
                <img src={apiRoot + 'image/' + avatar.id} alt={fullName} title={fullName} />
            ) : (
                <img src="/assets/nouserimage.jpg" alt={fullName} title={fullName}/>
            )}
        </div>);

    return (<div class={style.callComponent}>
        <div>{title}</div>

        <div>
            <div class={style.name}>{fullName}</div>
            <div>{descr}</div>
        </div>
        
        <div style={{position: 'relative'}}>
			{ !(isSpeaking) && avatarEl }
		</div>
        
        <div class={style.info}>{_info}</div>

        <div class={style.btnArea}>
            {props.isConnected ? 
                btns.map(el => <Btn text={el.txt} key={el.txt} clickHandler={el.handler}/>) : 'Connecting to server'}
        </div>

    </div>)
};

export default Call;