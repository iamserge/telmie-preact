import { h } from 'preact';
import style from './style.scss';
import { Btn, ControlBtn } from "./callBtn";

import { apiRoot } from "../../../api/index";
import { chatBtns, consts } from '../../../utils/consts'
import { secToMS } from '../../../utils/index'


const Call = ({ 
    communicateModal = {}, rejectCall, pickUp, changeType, videoOptions, callControls, ...props
}) => {
    const { person = {}, isIncoming, isOutcoming, isBusy, isCalling, callInfo = {}, isSpeaking }  = communicateModal;
    const {error, info } = callInfo;

    const { name = '', lastName = '', pro, avatar } = person;
    let cTime;
    const { costPerMinute : cpm = 0 } = pro || {};


    const fullName = name + ' ' + lastName;
    const title = isSpeaking ? 'On call with' 
            : isCalling ? 'Connecting with'
                : isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';
    const descr = isIncoming ? 'Your client' : pro && pro.profession;
    const _info = error ? info : 
        (isSpeaking && isOutcoming) ? (
            cTime = secToMS(props.seconds),
            `£${cpm}/min - ${!!cTime.m ? cTime.m + ':' : ''}${cTime.s} - £${cTime.s > 0 ? cpm * cTime.m + cpm : cpm * cTime.m}` 
        ) :
            (isBusy && !isCalling) ? 
                "Sorry, I'm busy now. Please text me & I will respond ASAP." 
                : !isIncoming && `You will pay £${cpm} per minute for this call`;

    const _changeType = (type) => () => changeType(type);

    const btns = (isBusy || error) ? [{
        txt: chatBtns.cancel,
        handler: props.closeModal,
    },{
        txt: chatBtns.textMe,
        handler: _changeType(consts.CHAT),
    }] 
        : isIncoming ? [{
            txt: chatBtns.decline,
            handler: rejectCall,
        }, {
            txt: chatBtns.pickUp,
            handler: pickUp
        }] 
            : isOutcoming ? [{
                txt: chatBtns.decline,
                handler: rejectCall,
            }] 
                : [];


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

            <video class={style.callerStream}
                style={{display: (isCalling || isSpeaking) ? 'block' : 'none' }}
                ref={el => props.getVideoOutput(el)}
                autoPlay
                muted={videoOptions.muteSpeaker}/>
            <video class={style.calleeStream}
                style={{display: (isSpeaking) ? 'block' : 'none' }}
                ref={el => props.getVideoInput(el)}
                autoPlay
                muted/>
        </div>
        
        <div class={style.info}>{_info}</div>

        {<div class={style.controls}>
            <ControlBtn type={chatBtns.control.video} clickHandler={callControls.video} isTurnOff={videoOptions.video}/>
            <ControlBtn type={chatBtns.control.mute} clickHandler={callControls.mute} isTurnOff={videoOptions.mute}/>
            <ControlBtn type={chatBtns.control.speaker} clickHandler={callControls.muteSpeaker} isTurnOff={videoOptions.muteSpeaker}/>
        </div> }

        {
            isSpeaking ? [
                <div style={{textAlign: 'center'}}></div>,
                <div class={style.btnArea}>
                    <Btn text={chatBtns.finish} clickHandler={props.finishCall}/>
                </div>
            ] 
                :
            <div class={style.btnArea}>
                {props.isConnected ? 
                    btns.map(el => <Btn text={el.txt} key={el.txt} clickHandler={el.handler}/>) : 'Connecting to server'}
            </div> 
        }
    </div>)
};

export default Call;