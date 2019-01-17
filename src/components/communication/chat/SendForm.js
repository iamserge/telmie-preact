import { h, Component } from 'preact';
import FontAwesome from 'react-fontawesome';
import style from './style.scss';

class SendForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
        }
    }

    changeHandler = e => this.setState({ value: e.target.value });

    sendHandler = () => {
        this.props.onSend(this.state.value);
        this.setState({ value: '' });
    }

    render(){
        return (<div class={style.sendForm}>
            <textarea onChange={this.changeHandler} value={this.state.value}/>
            <FontAwesome name="arrow-circle-right" size="3x" onClick={this.sendHandler}/>
        </div>)
    }
};

export default SendForm;