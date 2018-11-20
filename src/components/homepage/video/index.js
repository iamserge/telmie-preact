import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import Vimeo from 'react-vimeo';
const PlayButton = <button className={style.playButton}>
	<svg xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" space="preserve">
		<path d="M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M204,369.75v-229.5L357,255    L204,369.75z"/>
	</svg>
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
