import { h, Component } from 'preact';
import style from './style.scss';
import { apiRoot } from '../../../api'


export default class ProVerticalInfo extends Component {
  
	render({person}) {

		return (
			<div className={style.imageContainer}>
				<div className={style.image}>
					{ (person.avatar != null) ? (
						<img class="hexmask" src={apiRoot + 'image/' + person.avatar.id} alt={person.name + ' ' + person.lastName} />
					) : (
						<img class="hexmask" src="/assets/nouserimage.jpg" alt={person.name + ' ' + person.lastName} />
					)}
				</div>
				<button  id={style.callPro} className="uk-button" onClick={this.props.showCallProPopup}>TEXT PRO</button>
				<button  id={style.callPro} className="uk-button" onClick={this.props.showCallProPopup}>CALL PRO</button>

				{this.props.isShortlisted ? (
					<span className={style.success}>
						<span class={style.txt}><span aria-hidden="true" class="fa fa-check"/> Shortlisted</span>
						<button id={style.callPro} disabled={this.props.shortlistLoading} class={`uk-button ${style.btn}`} onClick={() => {this.props.cnageShortlist(person.id, true)}}>Remove</button>
					</span>
				) : (
					<button  id={style.callPro} disabled={this.props.shortlistLoading} className="uk-button" onClick={() => {this.props.cnageShortlist(person.id)}}>Shortlist</button>
				)}

				{
					<div class={style.actionsInfo}> 
						{this.props.shortlistLoading ? <p class={style.loading}>Loading</p> : this.props.shortlistMessage }
					</div>
				}
			</div>
		)
	}
}
