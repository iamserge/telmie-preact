import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Spinner from '../../global/spinner';
import TransactionItem from './transaction-item'
import BalanceItem from './balance-item'
import { routes } from '../../app'

export default class Transactions extends Component {

	render({balance, proBalance, total, results = []}) {

		return (
			<div className={style.transactions}>

				{ (this.props.withoutBalance) && (
					<h2>
						{ this.props.title }
						<Link href={routes.TRANSACTIONS}>View all</Link>
					</h2>
				)}


				<div className={style.inner}>
					{ (!this.props.withoutBalance && !this.props.loading) && <div class={style.balanceLine}>
						<BalanceItem balance={balance} text='Telmie credit'/>
						<BalanceItem balance={proBalance} text='Earnings'/>
					</div> }

					<div class={`${style.tableRow} ${style.tableHeader}`}>
						<div>Transaction</div>
						<div>Date</div>
						<div>Duration</div>
						<div>Balance</div>
					</div>
					{ this.props.loading && (
						<div className={style.spinnerContainer}><Spinner /></div>
					)}
					{ results.length > 0 && !this.props.loading  && results.map(transaction => (
						<TransactionItem key={ transaction.id } { ...transaction }/>
					))}
					{ results.length == 0 && !this.props.loading && (
						<div className={style.empty}>No recent transactions</div>
					)}

				</div>
			</div>
		)
	}
}
