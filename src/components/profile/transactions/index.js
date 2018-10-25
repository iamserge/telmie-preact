import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Transaction from '../transaction'
import { routes } from '../../app'

export default class Transactions extends Component {

	render({transactions, loading}) {
		let { results = [] } = transactions;
		if (typeof this.props.limit != 'undefined') {
			results = results.slice(0, this.props.limit);
		}

		return (
			<div className={style.transactions}>

					{ (typeof this.props.limit != 'undefined') && (
						<h2>
							{ this.props.title }
							<Link href={routes.TRANSACTIONS}>View all</Link>
						</h2>
					)}


				<div className={style.inner}>
					<div className={style.header}>
						<div className={style.contact}>Contact</div>
						<div className={style.date}>Date</div>
						<div>Duration</div>
						<div>Money In</div>
						<div>Money Out</div>
					</div>
					{ loading && (
						<div className={style.spinnerContainer}><Spinner /></div>
					)}
					{ results.length > 0 && !loading  && results.map(transaction => (
						<Transaction key={ transaction.id } transaction={ transaction }/>
					))}
					{ results.length == 0 && !loading && (
						<div className={style.empty}>No recent transactions</div>
					)}

				</div>
			</div>
		)
	}
}
