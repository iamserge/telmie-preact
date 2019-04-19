import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Switch from 'react-toggle-switch'
import Radio from '../../radio'

export default class SideBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			switched: props.sortBy
		}
	}
	toggleSwitch = (e) => {
		const {value} = e.target;
		this.setState({ switched: value });
		this.props.sortToggleSwitched(value);
	}
	render() {
		const { items = [], disabled } = this.props;
		return (
			<div id={style.sideBar} style={this.props.style || {}}>
				<h3>Arrange by:</h3>

				<Radio name='sortType'
					value={this.state.switched} 
					onChange = {this.toggleSwitch}
					disabled={disabled}
					data = {items}/>
			</div>
		)
	}
}
