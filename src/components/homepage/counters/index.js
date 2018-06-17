import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import YouTube from 'react-youtube';

export default class Counters extends Component {
	renderCounter(counter) {
		const counterData = counter.counter;
		return (
			<div>
					<span>{counterData[0].text}</span><br/> {counterData[1].text}
			</div>
		)
	}
	render() {
		return (
			<div className={style.counters}>
				{ this.props.counters.map(counter => this.renderCounter(counter))}
			</div>
		)
	}
}
