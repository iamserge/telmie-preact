import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Pro from '../pro';

export default class ProsList extends Component {
	render({pros}) {
		return (
			<div id={style.prosList} className={this.props.full && style.full}>
				{ pros.map(pro => (
					<Pro key={ pro.id } person={ pro }/>
				))}
			</div>
		)
	}
}
