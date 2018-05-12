import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import Vimeo from 'react-vimeo';

export default class MoreInfo extends Component {

	render() {
		return (
			<div className="uk-container uk-container-small uk-container-inner" >
				<button class="uk-button" id={style.mainButton}>Download Telmie app</button>
			</div>
		)
	}
}
