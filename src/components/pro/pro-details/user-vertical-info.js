import { h, Component } from 'preact';
import style from './style.scss';
import { apiRoot } from '../../../api'
import { consts } from '../../../utils/consts'


export default class UserVerticalInfo extends Component {
	openChat = () => this.props.openComModal(consts.CHAT, this.props.person);
	openCall = () => {
		this.props.createCall(this.props.person.id);
		this.props.openComModal(consts.CALL, this.props.person, true);
	};

	renderProPart = () => [
		<button  id={style.callPro} className="uk-button" onClick={this.openCall}>CALL PRO</button>,
		this.props.isShortlisted ? (
			<span className={style.success}>
				<span class={style.txt}><span aria-hidden="true" class="fa fa-check"/> Shortlisted</span>
				<button id={style.callPro} disabled={this.props.shortlistLoading} class={`uk-button ${style.btn}`} onClick={() => {this.props.cnageShortlist(person.id, true)}}>Remove</button>
			</span>
		) : (
			<button  id={style.callPro} disabled={this.props.shortlistLoading} className="uk-button" onClick={() => {this.props.cnageShortlist(person.id)}}>Shortlist</button>
		),
		<div class={style.actionsInfo}> 
			{this.props.shortlistLoading ? <p class={style.loading}>Loading</p> : this.props.shortlistMessage }
		</div>
	]
  
	render({person, isPro}) {

		return (
			<div className={style.imageContainer}>
				<div className={style.image}>
					{ (person.avatar != null) ? (
						<img class="hexmask" src={apiRoot + 'image/' + person.avatar.id} alt={person.name + ' ' + person.lastName} />
					) : (
						<img class="hexmask" src="/assets/nouserimage.jpg" alt={person.name + ' ' + person.lastName} />
					)}
				</div>
				<button  id={style.callPro} className="uk-button" onClick={this.openChat}>TEXT { isPro ? 'PRO' : 'Client'}</button>
				
				{ isPro && this.renderProPart() }

			</div>
		)
	}
}
