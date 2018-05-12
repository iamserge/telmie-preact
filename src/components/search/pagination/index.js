import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Switch from 'react-toggle-switch'

export default class Pagination extends Component {
	constructor(props){
		super(props);
	}

	toggleSwitch(switchName){
		this.setState({
			switched: switchName
		})
	}


	render() {
		return (
			<div id={style.pagination}>
				<a href="#" id={style.previous} className={this.props.page == 1 && style.disabled} onClick = {()=> {this.props.pageChange(this.props.page - 1)}}>Previous</a>
				<a href="#" id={style.next} className={this.props.noNext && style.disabled} onClick = {()=> {this.props.pageChange(this.props.page + 1)}}>Next</a>

			</div>
		)
	}
}
