import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import YouTube from 'react-youtube';

export default class HomeTitle extends Component {

	render() {
		return (
			<div  className="uk-container uk-container-small uk-container-inner" >
				<div className={style.mainTitle}>
					<h2>{this.props.main_title}</h2>
					<h3>{this.props["main_sub-title"]}</h3>
				</div>
			</div>
		)
	}
}
