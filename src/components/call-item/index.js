import { h, Component } from 'preact';
import style from './style.scss';
import { convertDate, convertDuration } from "../../utils/index";

const CallItem = ({call}) =>  {

    return (
        <div class={style.callItem}>
            <div>{convertDate(call.startDate)}</div>
            <div>{convertDuration(call.duration)}</div>
            <div>{call.amount || 0}£</div>
            <div>{call.status}</div>
        </div>
    )
}

export default CallItem;