import { h } from 'preact';
import style from './style.scss';

const CreditCard = props =>  {
    const deleteCard = () => props.deleteCard(props.token);

    return (
        <div class={style.creditCard}>

            <div class={style.cardType}>{props.cardType}</div>
            <div class={style.cardNumber}>**** {props.last4}</div>
            <div class={style.cardControls}>
                <div onClick={props.addCard}>Add</div>
                <div onClick={deleteCard}>Delete</div>
            </div>
        </div>
    )
}

export default CreditCard;