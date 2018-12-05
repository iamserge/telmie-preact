import { h, Component } from 'preact';
import style from './style.scss';

class AutoPrintText extends Component {
    constructor(props){
        super(props);

        this.state = {
            txt: '',
        }
    }

    txtType = (period) => {
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    tick = () => {
        let i = this.loopNum % this.props.words.length,
            fullTxt = this.props.words[i];
    
        this.isDeleting ? 
            this.setState(prev => ({txt : fullTxt.substring(0, prev.txt.length - 1)}))
            : this.setState(prev => ({txt : fullTxt.substring(0, prev.txt.length + 1)}));
        
        let delta = 200 - Math.random() * 100;    
        this.isDeleting && (delta /= 2);
    
        if (!this.isDeleting && this.state.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.state.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 100;
        }
    
        this.timeout = setTimeout(() => this.tick(), delta);
    };
    
    componentDidMount(){
        this.txtType(1500);
    }

    componentWillUnmount(){
        clearTimeout(this.timeout);
    }

    componentDidUpdate(_, prevState){
        //(prevState.wordIndex !== this.state.wordIndex) && this.autoPrint(200);
    }

    render(){

        return (
            <div class={style.wordContainer}>
                <span class={style.word}>{this.state.txt}</span>
            </div>
        )
    }
}

export default AutoPrintText;