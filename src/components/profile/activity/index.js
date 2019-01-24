import { h, Component } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { Link, route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import { apiRoot } from '../../../api';
import { convertDate } from '../../../utils';
import { activityTypes } from "../../../utils/consts";
import { routes } from "../../app";


export default class Activity extends Component {
	state = {
		expanded: false
	}
	
	gotoHandler = (id) => () => this.props.client ? 
		route(routes.CLIENT_FOR_COMP + id) : route(routes.PRO_FOR_COMP + id);

	render({activity = {}}) {
		return (
			<div className={style.activity}>

				<div className={style.contact}  onClick={this.gotoHandler(activity.id)} >
					<div className={style.avatar}>
						{(activity.avatar != null) ? (
							<img src={apiRoot + 'image/' + activity.avatar.id} alt={activity.name + ' ' + activity.lastName} />
						) : (
							<img src="/assets/nouserimage.jpg" alt={activity.name + ' ' + activity.lastName} />
						)}
					</div>
					<div className={style.info}>
						<h3>{activity.name + ' ' + activity.lastName}</h3>
							{this.props.client && (
								<div>
									CLIENT
								</div>
							)}
							{!this.props.client && activity.pro != null && (
								<div>
									{activity.pro.profession}
								</div>
							)}
					</div>
				</div>
				<div className={style.date}> { convertDate(activity.activityDate) }</div>
				<div className={style.type}>
						<span>{ activityTypes[activity.activity] }</span>
				</div>
				{/*<div className={style.price}>
					{activity.amount != null ? (
						<span>
							£{activity.amount.toFixed(2)}
						</span>
					) : (
						<span>
							£0.00
						</span>
					)}
				</div>*/}
				<div className={style.count}>{activity.activityCount}</div>
				{ /*typeof activity.related != 'undefined' && (
					<div className={this.state.expanded ? style.relatedActivities + ' ' + style.expanded : style.relatedActivities }>
						<span className={style.relatedTitle} onClick={()=>{this.setState({expanded: !this.state.expanded})}}>
							{activity.related.length} more {activity.related.length == 1 ? 'call' : 'calls' } <span aria-hidden="true" class="fa fa-angle-down"></span>
						</span>
						<div className={style.container}>
							{ activity.related.map(related => (
							<div className={style.related}>
								<div className={style.relatedDate}> { convertDate(related.date) }</div>
								<div className={style.relatedDuration}>
									{related.duration != null ? (
										<span>
											{convertDuration(related.duration)}
										</span>
									) : (
										<span>00:00</span>
									)}
								</div>
								<div className={style.relatedPrice}>
									{related.amount != null ? (
										<span>
											£{related.amount.toFixed(2)}
										</span>
									) : (
										<span>
											£0.00
										</span>
									)}
								</div>
								<div className={style.relatedStatus}>
									{related.status}
								</div>
							</div>
						))}
						</div>
					</div>
				)*/}
			</div>
		)
	}
}