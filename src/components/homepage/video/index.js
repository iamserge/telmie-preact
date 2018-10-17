import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import Vimeo from 'react-vimeo';
const PlayButton = <button className={style.playButton}>
	<h2>
		How it works
		<div className={style.subTitle}>Play video</div>
	</h2>
	<img src="/assets/icn_play.svg" width="140" height="140" />
</button>;

export default class Video extends Component {
	onLoaded(obj) {
		console.log(obj);
	}
	render() {
		return (
			<Vimeo videoId={ this.props.videoId } playButton={PlayButton} onLoaded = { this.onLoaded}/>
		)
	}
}
