import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Activity from '../activity'


export default class ActivityList extends Component {

	render({recentActivity = [], link}) {
		return (
			<div className={style.activityList}>
				<h2>
					{ this.props.title }
					<Link href={link}>View all</Link>
					{/*NO SUCH ROUTE*/}
				</h2>
				<div className={style.inner}>
					<div className={style.header}>
						<div class={style.contact}>Contact</div>
						<div class={style.date}>Date</div>
						<div class={style.type}>Type</div>
						<div class={style.count}>Count</div>
					</div>
					{ recentActivity.length > 0 && recentActivity.map(activity => (
						<Activity key={ activity.id } activity={ activity }  client = {this.props.client}/>
					))}
					{ recentActivity.length == 0 && (
						<div className={style.empty}>No recent activity</div>
					)}
				</div>
			</div>
		)
	}
}
