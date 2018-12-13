import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Activity from '../activity'
import { routes } from '../../app'


export default class ActivityList extends Component {

	render({recentActivity}) {
		return (
			<div className={style.activityList}>
				<h2>
					{ this.props.title }
					<Link href={routes.MY_PROS}>View all</Link>
					{/*NO SUCH ROUTE*/}
				</h2>
				<div className={style.inner}>
					<div className={style.header}>
						<div className={style.contact}>Contact</div>
						<div className={style.date}>Date</div>
						<div>Duration</div>
						<div>Price</div>
						<div>Status</div>
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
