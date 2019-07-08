import { h, Component } from 'preact';
import style from './style.scss';

export default class PriceInfo extends Component {

	renderProPart = (person) => [
		this.props.isShortlisted ? (
			<span className={style.success}>
				<span class={style.txt}><span aria-hidden="true" class="fa fa-check"/> Shortlisted</span>
				<button disabled={this.props.shortlistLoading} class={`uk-button ${style.btn} ${style.userControlBtn}`} 
					onClick={() => {this.props.cnageShortlist(person.id, true)}}>Remove</button>
			</span>
		) : (
			<button disabled={this.props.shortlistLoading} class={`uk-button ${style.userControlBtn}`} 
				onClick={() => {this.props.cnageShortlist(person.id)}}>Shortlist</button>
		),
		<div class={style.actionsInfo}> 
			{this.props.shortlistLoading ? <p class={style.loading}>Loading</p> : this.props.shortlistMessage }
		</div>
	]

	render({pro, isPro}) {

		return (
			<div className={style.priceContainer}>
				<div className={style.price}>
					&pound;{pro.costPerMinute} /<span>min</span>
				</div>

				{ isPro && this.renderProPart(this.props.person) }
			</div>
		)
	}
}
