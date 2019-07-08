import { h, Component } from 'preact';
import style from './style.scss';

class SimpleSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		}
    }
    
    performSearch = (e, value) => {
        this.props.onSearch(value || this.state.value);
    };

    changeHandler = e => this.setState({ value: e.target.value });

    keyHandler = e => {
        (e.keyCode == 13) && (
            e.preventDefault(),
            this.setState({ value: e.target.value }),
            this.performSearch(_, e.target.value)
        )
    }

	render() {
		return (
            <form class={`${style.searchContainer} ${this.props.isHome && style.homeContainer}`}>
                <input type="text" placeholder={this.props.placeholder} value={this.state.value}
                    onKeyDown={this.keyHandler} onChange={this.changeHandler} />
                <span class={style.searchIcon} onClick={this.performSearch} >
					<span class="icon-magnifying-glass"/>
				</span>
            </form>
		);
	}
}

export default SimpleSearch;
