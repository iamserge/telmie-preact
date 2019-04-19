import { h, Component } from 'preact';
import style from './style.scss';
import Pagination from '../../profile/pagination';
import CallItem from '../../../components/call-item';

import { consts } from '../../../utils/consts'

const CallHistory = ({callHistory, ...props}) =>  {

    return (
        <div>
			<div class={style.callsHeader}>
				<div>Date</div>
				<div>Duration</div>
				<div>Amount</div>
				<div>Type</div>
			</div>
			{ 
				callHistory.length > 0 ?
					callHistory.map(call => <CallItem key={ call.id } call = { call } />) 
					: <div style={{textAlign: 'center'}}>No recent calls</div>
			}
			<Pagination
				list = { props.list }
				changePage = { props.changePage }
				nextPage = { props.nextPage }
				previousPage = { props.previousPage }
				currentPage = { props.currentPage }
				max = {consts.PAGE_SIZE}/>
		</div>
    )
}

export default CallHistory;