import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import YouTube from 'react-youtube';
import Spinner from '../../global/spinner';

const youtubeProps = {
	height: '157',
  width: '280',
  playerVars: {
    autoplay: 0,
		controls: 0,
		loop: 0
  }

}
export default class FeaturedPro extends Component {
	constructor(props){
		super(props);
		this.state = {
			videoControl: {},
			videoStarted: false
		}
		this.onReady = this.onReady.bind(this);
		this.playVideo = this.playVideo.bind(this);
		this.stopVideo = this.stopVideo.bind(this);
	}
	playVideo(){

		this.setState({
			videoStarted: true
		});
		this.props.videoStarted(this.stopVideo);
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.stopVideo) {

		//	this.stopVideo();
		}
	}
	stopVideo(){
		if (typeof this.state.videoControl.stopVideo != 'undefined') {
			this.state.videoControl.stopVideo();
			this.setState({
				videoStarted: false
			})
		}
	}
	onReady(event){
		this.setState({
			videoControl: event.target
		})
	}
	render() {
		const proInfo = this.props.pro
		return (
			<div className={style.pro}>
				{typeof this.state.videoControl.playVideo == 'undefined' && (
					<div className={style.spinnerContainer}>
						<Spinner />
					</div>
				)}
				<YouTube
	        videoId={proInfo.videoId}
	        opts={youtubeProps}
					onPlay = {this.playVideo}
	        onReady={(event)=>{this.onReady(event)}}
	      />
				<Link href={"/pro/" + proInfo.userId}>
					<h3>{proInfo.name},</h3>
					<h4>{proInfo.profession}</h4>
				</Link>
			</div>
		)
	}
}
