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

    changeHandler = e => {
        this.setState({ value: e.target.value });
    };

    keyHandler = e => {
        (e.keyCode == 13 && e.shiftKey == false) && (
            e.preventDefault(),
            this.sendHandler(_, e.target.value)
        )
    }

    sendHandler = (_, value) => {
        let val = value ? value : this.state.value;

        this.props.isConnected && (
            val && this.props.onSend(val),
            this.setState({ value: '' })
        )
    }

    render(){
        return (<div class={style.sendForm}>
            <textarea onKeyDown={this.keyHandler} onChange={this.changeHandler} value={this.state.value}/>
            <FontAwesome name="arrow-circle-right" size="3x" onClick={this.sendHandler}/>
        </div>)
    }
};

export default SendForm;