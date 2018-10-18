import { h, Component } from 'preact';
import style from './style.scss';

class AutoPrintText extends Component {
    constructor(props){
        super(props);

        this.state = {
            wordIndex: 0,
            currentWord: '',
            currentWordState: '',          
        }
    }

    componentDidMount(){
        this.changeWordInterval = setInterval(this.changeWord, 3000);
    }

    componentWillUnmount(){
        clearInterval(this.changeWordInterval);
    }

    componentDidUpdate(_, prevState){
        
    }

    changeWord = () => {
        const { words = [] } = this.props;
        const len = words.length;
        len && (
            this.setState(prev => ({
                wordIndex: (prev.wordIndex === len - 1) ? 0 : prev.wordIndex + 1,
            }))
        );
    }

    render(){
        const { words =[] } = this.props;
        const { wordIndex } = this.state;

        return (
            <span class={style.word}>
                {words[wordIndex]}
            </span>
        )
    }
}

export default AutoPrintText;