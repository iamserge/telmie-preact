import { h } from 'preact';
import style from './style.scss';
import btnCallEnd from '../../../assets/btnCallEnd.png'
import btnCallStart from '../../../assets/btnCallStart.png'
import btnCancel from '../../../assets/btnCancel.png'
import btnText from '../../../assets/btnText.png'

import { apiRoot } from "../../../api/index";
import { chatBtns, consts } from '../../../utils/consts'

const Btn = ({text, clickHandler}) => {
    let src;
    switch (text){
        case chatBtns.cancel:
            src = btnCancel;
            break;
        case chatBtns.decline:
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

const Call = ({ communicateModal = {}, rejectCall, changeType, closeModal }) => {
    const { person = {}, isIncoming, isOutcoming, isBusy }  = communicateModal;
    const { name = '', lastName = '', pro, avatar } = person;

    const fullName = name + ' ' + lastName;
    const title = isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';
    const descr = isIncoming ? 'Your client' : pro && pro.profession;
    const info = !isIncoming && `You will pay £${pro && pro.costPerMinute} per minute for this call`;

    const _changeType = (type) => () => changeType(type);

    const btns = isBusy ? [{
        txt: chatBtns.cancel,
        handler: closeModal,
    },{
        txt: chatBtns.textMe,
        handler: _changeType(consts.CHAT),
    }] 
        : isIncoming ? [{
            txt: chatBtns.decline,
            handler: rejectCall,
        }, {
            txt: chatBtns.pickUp,
            handler: () => console.log('Pick up')
        }] 
            : isOutcoming ? [{
                txt: chatBtns.decline,
                handler: rejectCall,
            }] 
                : [];

    return (<div class={style.callComponent}>
        <div>{title}</div>

        <div>
            <div class={style.name}>{fullName}</div>
            <div>{descr}</div>
        </div>
        
        <div class={style.avatar}>
            { avatar ? (
                <img src={apiRoot + 'image/' + avatar.id} alt={fullName} title={fullName} />
            ) : (
                <img src="/assets/nouserimage.jpg" alt={fullName} title={fullName}/>
            )}
        </div>

        { isBusy ? 
            <div>Sorry, I'm busy now. Please text me & I will respond ASAP.</div> 
                : 
            <div class={style.info}>{info}</div> }

        <div class={style.btnArea}>
            {btns.map(el => <Btn text={el.txt} key={el.txt} clickHandler={el.handler}/>)}
        </div>       

    </div>)
};

export default Call;