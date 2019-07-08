import { h } from 'preact';
import { convertDate } from "../../../utils/index";
import style from './style.scss';

const TransactionItem = ({title = '', date, flowBalance, operation, amount}) => {
    const titleArr = title.split(',');
    const balance = flowBalance > 0 ? `£${flowBalance}` : `-£${flowBalance*(-1)}`;
    return (
        <div class={`${style.tableRow} ${style.transactionItem}`}>
            <div>{titleArr[0]}</div>
            <div>{convertDate(date)}</div>
            <div>{titleArr[1]}</div>
            <div class={style.balanceCell}>
                <div>{operation}£{amount}</div>
                <div>{balance}</div>
            </div>
        </div>
    )
}

export default TransactionItem;