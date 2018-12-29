import { h, Component } from 'preact';
import style from './style.scss';
import ProVerticalInfo from './pro-vertical-info';
import ProTopInfo from './pro-top-info';
import PriceInfo from './price-info';
import { route } from 'preact-router';
import YouTube from 'react-youtube';
import Collapse from 'rc-collapse'
import 'rc-collapse/assets/index.css';

export default class Pro extends Component {
  constructor(props){
		super(props);
		this.state = {
			showCallProPopup: false
		}
	}
	showCallProPopup = () => {
		this.setState({
			showCallProPopup: true
		})
	}
	render({person}) {
		const { pro = {} } = person;

		return (
			<div class={style.person}>
				<ProVerticalInfo {...this.props} showCallProPopup={this.showCallProPopup}/>

				<div className={style.info}>
					<ProTopInfo person={person} pro={pro}/>

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

				<PriceInfo pro={pro}/>

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
