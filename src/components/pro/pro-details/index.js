import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import ReactStars from 'react-stars';
import { apiRoot } from '../../../api'
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import YouTube from 'react-youtube';
import Collapse from 'rc-collapse'
import 'rc-collapse/assets/index.css';
import {routes} from '../../app'

export default class Pro extends Component {
  constructor(props){
		super(props);
		this.state = {
			showCallProPopup: false
		}
	}
	showCallProPopup(){
		this.setState({
			showCallProPopup: true
		})
	}
	render({person}) {
		const { pro = {} } = person;

		return (
			<div class={style.person}>
				<div className={style.imageContainer}>
					<div className={style.image}>
						{ (person.avatar != null) ? (
							<img class="hexmask" src={apiRoot + 'image/' + person.avatar.id} alt={person.name + ' ' + person.lastName} />
						) : (
							<img class="hexmask" src="/assets/nouserimage.jpg" alt={person.name + ' ' + person.lastName} />
						)}
					</div>
					<button  id={style.callPro} className="uk-button" onClick={()=>{this.setState({showCallProPopup: true})}}>TEXT PRO</button>
					<button  id={style.callPro} className="uk-button" onClick={()=>{this.setState({showCallProPopup: true})}}>CALL PRO</button>

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

				<div className={style.info}>
					<div className={style.nameAndTitle}>
						<span className={style.proRoundel}>PRO</span>
						<h2>{person.name} {person.lastName}</h2>
						<h3>{pro.profession}</h3>
					</div>
					<div className={style.prof}>
						<Link href={routes.SEARCH_FOR_COMP + pro.category} >{pro.category}</Link>
						<FontAwesome name="angle-right"/>
						<Link href={routes.SEARCH_FOR_COMP + pro.subCategory} >{pro.subCategory}</Link>
					</div>

					<Collapse accordion={false} defaultActiveKey = "info" className={style.description}>
						<Collapse.Panel header={'Info'} key='info'>
							{pro.professionDescription}
							{pro.video && pro.video.length > 0 && (
								<div class={style.videoContainer}>
									<YouTube videoId={ pro.video } />
								</div>
							)}
						</Collapse.Panel>

						<Collapse.Panel header={'Chat'} key='chat'>
							Chat
						</Collapse.Panel>

						<Collapse.Panel header={'Call history'} key='call-history'>
							Call history
						</Collapse.Panel>
					</Collapse>
				</div>

				<div className={style.priceContainer}>
					<div className={style.price}>
						&pound;{pro.costPerMinute} /<span>min</span>
					</div>
					<div className={style.raiting}>
						<span>
							{(pro.review != null) ? pro.review.count : 0} sessions
						</span>
						<ReactStars
						  count={5}
						  value={(pro.review != null) ? pro.review.rating : 0}
							edit={false}
							size={25} />
					</div>
				</div>			
				{ this.state.showCallProPopup && (
					<div>
						<div className="modal" onClick={()=>{this.setState({showCallProPopup: false})}}>
							<a class="uk-modal-close uk-close"></a>
						</div>
						<div className="modalInner">
							<span className={style.note}>Please, download the <a target="_blank" href="https://itunes.apple.com/us/app/telmie/id1345950689">Telmie App</a> on your Apple device to call the Pro. In the near future it will be possible to call directly from the website. Thank you!</span>
							<a href="https://itunes.apple.com/us/app/telmie/id1345950689" target="_blank"><img style="width:150px;height:51px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxohVpmd3NAgCI4gViHb91fWNHeZqSDNlztqhaJs_ea5B791nnxw" /></a>
						</div>
					</div>
				)}
				
			</div>
		)
	}
}
