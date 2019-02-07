import { h, Component } from 'preact';
import style from './style.scss';
import { consts } from '../../../utils/consts'

export default class PriceInfo extends Component {
  
	openCall = () => {
		this.props.createCall(this.props.person.id);
		this.props.openComModal(consts.CALL, this.props.person, true);
	};

	renderProPart = (person) => [
		<button id={style.callPro} class={`uk-button ${style.userControlBtn}`} onClick={this.openCall}>CALL PRO</button>,
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
