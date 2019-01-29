import { h } from 'preact';
import style from './style.scss';

import { apiRoot } from "../../../api/index";

const Call = (props) => {
    const { /*messages = [],*/ communicateModal = {} } = props;
    //const { unread } = communicateModal;

    const { person = {}, isIncoming, isOutcoming }  = communicateModal;
    const { name = '', lastName = '', pro } = person;
    const fullName = name + ' ' + lastName;

    const title = isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';

    return (<div class={style.callComponent}>
        {title}
        <div>{fullName}</div>
        { isIncoming ? <div>Your client</div> : <div>{pro && pro.profession}</div> }

        <div class={style.avatar}>
            { person && (person.avatar ? (
                <img src={apiRoot + 'image/' + person.avatar.id} alt={fullName} title={fullName} />
            ) : (
                <img src="/assets/nouserimage.jpg" alt={fullName} title={fullName}/>
            ))}
        </div>

        { !isIncoming && <div>
            You will pay <br/>
            £ {pro && pro.costPerMinute} per minute<br/>
            for this call <br/>
        </div> }

        { isIncoming ? [
            <div>Pick up</div>,
            <div>Decline</div>
        ] : <div>Decline</div> }

        

    </div>)
};

export default Call;