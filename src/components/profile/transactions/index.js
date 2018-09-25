import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import Transaction from '../transaction'
import { routes } from '../../app'

export default class Transactions extends Component {

	render({transactions}) {
		if (typeof this.props.limit != 'undefined') {
			transactions = transactions.slice(0, this.props.limit);
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
					{ this.props.loading && (
						<div className={style.spinnerContainer}><Spinner /></div>
					)}
					{ transactions.length > 0 && !this.props.loading  && transactions.map(transaction => (
						<Transaction key={ transaction.id } transaction={ transaction }/>
					))}
					{ transactions.length == 0 && !this.props.loading && (
						<div className={style.empty}>No recent transactions</div>
					)}

				</div>
			</div>
		)
	}
}
