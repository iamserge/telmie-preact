import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Switch from 'react-toggle-switch'

export default class SideBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			switched: props.sortBy
		}
		this.toggleSwitch = this.toggleSwitch.bind(this);
	}
	toggleSwitch(switchName){
		this.setState({
			switched: switchName
		});
		this.props.sortToggleSwitched(switchName);
	}
	render() {
		return (
			<div id={style.sideBar}>
				<h3>Arrange by:</h3>
				<div class="switchContainer">
					<Switch onClick={()=>this.toggleSwitch('rate')} on={this.state.switched == 'rate'}/>
					<span>Hourly rate</span>
				</div>
				<div class="switchContainer">
					<Switch onClick={()=>this.toggleSwitch('rating')} on={this.state.switched == 'rating'}/>
					<span>Rating</span>
				</div>
				<div class="switchContainer">
					<Switch onClick={()=>this.toggleSwitch('experience')} on={this.state.switched == 'experience'}/>
					<span>Experience</span>
				</div>
			</div>
		)
	}
}
