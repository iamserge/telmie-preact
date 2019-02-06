import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Activity from '../activity'
import Pagination from '../pagination'

export default class AllActivity extends Component {

	render({activity}) {
		return (
			<div className={style.activityList}>
				<div className={style.inner}>
					<div className={style.header}>
						<div className={style.contact}>Contact</div>
						<div class={style.type}>Type</div>
						<div className={style.date}>Date</div>
						<div class={style.count}>Count</div>
					</div>
					{ activity.length > 0 && activity.map(activity => (
						<Activity key={ activity.id } activity={ activity } client = {this.props.client}/>
					))}
					{ activity.length == 0 && !this.props.loading && (
						<div className={style.empty}>No recent activity</div>
					)}

					{ activity.length == 0 && this.props.loading && (
						<div className={style.spinnerContainer}>
							<Spinner />
						</div>
					)}

				</div>
					{ activity.length > 0 && (
						<Pagination
							list = { this.props.allActivity }
							changePage = { this.props.changePage }
							nextPage = { this.props.nextPage }
							previousPage = { this.props.previousPage }
							currentPage = { this.props.currentPage }
							max = {this.props.max}
							/>
					)}
			</div>
		)
	}
}
