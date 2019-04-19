import { h } from 'preact';
import style from './style.scss';

const BankItem = props =>  {
    const deleteBank = () => props.deleteBank(props.token);

    return (
        <div class={style.bankAcc}>

            <div class={style.bankName}>{props.name}</div>
            <div class={style.bankNumber}>**** {props.last4}</div>
            <div class={style.bankCountry}>{props.country} ({props.currency})</div>
            <div class={style.bankControls} onClick={deleteBank}>Delete</div>
        </div>
    )
}

export default BankItem;