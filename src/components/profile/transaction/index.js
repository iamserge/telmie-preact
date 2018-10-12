import { h, Component } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { Link, route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import { apiRoot } from '../../../api';
import { convertDate, convertDuration } from '../../../utils';
export default class Transaction extends Component {
	goToPro(id){
		route('/pro/' + id);
	}
	render({transaction}) {
		console.log('transaction: ',transaction);
		const { contact = {} }  = transaction;
		const { pro ={} } = contact;
		const { profession, category } = pro;
		return (
			<div className={style.transaction + ' ' + ( transaction.moneyCame > 0 && style.profit )}>
				<div className={style.contact}  onClick={()=>{this.goToPro(contact.id)}} >
					<div className={style.avatar}>
						{(contact.avatar != null) ? (
							<img src={apiRoot + 'image/' + contact.avatar.id} alt={contact.name + ' ' + contact.lastName} />
						) : (
							<img src="/assets/nouserimage.jpg" alt={contact.name + ' ' + contact.lastName} />
						)}
					</div>
					<div className={style.info}>
						<h3>{contact.name + ' ' + contact.lastName}</h3>

							{transaction.moneyCame > 0 ? (
								<div>
									CLIENT
								</div>
							): (
								<div>
									{profession} <span className={style.profession}>{category}</span>
								</div>
							)}
					</div>
				</div>
				<div className={style.date}> { convertDate(transaction.date) }</div>
				<div>
					{transaction.duration != null ? (
						<span>
							{convertDuration(transaction.duration)}
						</span>
					) : (
						<span>00:00</span>
					)}
				</div>
				<div className={style.money}>
					<span className={transaction.moneyCame > 0 ? style.in : style.out}>
						{ transaction.moneyCame > 0 ? (

								transaction.fee > 0 ? (
									<span>
								 		+&pound;{parseFloat(transaction.moneyCame - transaction.fee).toFixed(2)}
										<span className={style.fee}>&pound;{transaction.moneyCame.toFixed(2)} - &pound;{transaction.fee.toFixed(2)} Telmie fee</span>
									</span>
								) : (
									<span>
								 		+&pound;{transaction.moneyCame ? transaction.moneyCame.toFixed(2) : 0.00}
									</span>
								)


						) : (
							<span>
							 -&pound;{transaction.moneyGone ? transaction.moneyGone.toFixed(2) : 0.00}
							</span>
						)}

					</span>
				</div>

			</div>
		)
	}
}
