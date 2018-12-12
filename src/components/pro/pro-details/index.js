import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import ReactStars from 'react-stars';
import { apiRoot } from '../../../api'
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import YouTube from 'react-youtube';
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
		let youtubeOptions = {
			width: '1200',
			height: '600'
		}
		if (window.innerWidth < 880) {
		 	youtubeOptions = {
				width: '100%',
				height: '300px'
			}
		}
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
					<button  id={style.callPro} className="uk-button" onClick={()=>{this.setState({showCallProPopup: true})}}>CALL PRO</button>

					{person.inShortlistForCurrent ? (
						<span className={style.success}><span aria-hidden="true" class="fa fa-check"></span> Shortlisted</span>
					) : (
						<button  id={style.callPro} className="uk-button" onClick={() => {this.props.addToShortlist(person.id)}}>Shortlist</button>
					)}

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
					<p className="description">
						{pro.professionDescription}
					</p>
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
				{pro.video && pro.video.length > 0 && (
					<div className={style.videoContainer}>
						<YouTube videoId={ pro.video } opts = {youtubeOptions} />
					</div>
				)}
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
