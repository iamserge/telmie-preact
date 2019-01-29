import { h } from 'preact';
import style from './style.scss';
import btnCallEnd from '../../../assets/btnCallEnd.png'
import btnCallStart from '../../../assets/btnCallStart.png'

import { apiRoot } from "../../../api/index";

const Btn = ({text, clickHandler}) => {
    const src = (text == 'Pick up') ? btnCallStart : btnCallEnd;

    return (<div class={style.btn}>
        <img src={src} onClick={clickHandler}/>
        <div class={style.btnText} onClick={clickHandler}>{text}</div>
    </div>)
}

const Call = ({ communicateModal = {} }) => {
    const { person = {}, isIncoming, isOutcoming }  = communicateModal;
    const { name = '', lastName = '', pro, avatar } = person;

    const fullName = name + ' ' + lastName;
    const title = isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';
    const descr = isIncoming ? 'Your client' : pro && pro.profession;
    const info = !isIncoming && `You will pay £${pro && pro.costPerMinute} per minute for this call`;

    const btns = isIncoming ? [{
        txt: 'Decline',
        handler: () => console.log('Decline')
    }, {
        txt: 'Pick up',
        handler: () => console.log('Pick up')
    }] 
        : isOutcoming ? [{
            txt: 'Decline',
            handler: () => console.log('Decline')
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

        <div class={style.info}>{info}</div>

        <div class={style.btnArea}>
            {btns.map(el => <Btn text={el.txt} key={el.txt} clickHandler={el.handler}/>)}
        </div>       

    </div>)
};

export default Call;