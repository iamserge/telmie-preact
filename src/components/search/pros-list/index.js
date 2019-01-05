import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Pro from '../pro';

export default class ProsList extends Component {
	render({pros = {}}) {
		const { results = [] } = pros;
		return (
			<div id={style.prosList} className={this.props.full && style.full}>
				{ results.map(pro => (
					<Pro key={ pro.id } person={ pro }/>
				))}
			</div>
		)
	}
}
