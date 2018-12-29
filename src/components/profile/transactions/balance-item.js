import { h } from 'preact';
import style from './style.scss';

const BalanceItem = ({balance = '', text}) => {
    const balanceArr = balance.toString().split('.');
    return (
        <div class={style.balanceItem}>
            <div class={style.balanceAmount}>
                <span style={{fontSize: '36px'}}>£{balanceArr[0]}</span>
                .{balanceArr[1] ? balanceArr[1].padEnd(2, "0") : '0'.padEnd(2, "0")}
            </div>
            <div class={style.balanceText}>{text}</div>
        </div>
    )
}

export default BalanceItem;