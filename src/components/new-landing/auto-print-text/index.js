import { h, Component } from 'preact';
import style from './style.scss';

class AutoPrintText extends Component {
    constructor(props){
        super(props);

        this.state = {
            wordIndex: 0,
            currentWord: '',
        }
    }

    componentDidMount(){
        this.changeWordInterval = setInterval(this.changeWord, 3100);
        this.autoPrint(200);
    }

    componentWillUnmount(){
        clearInterval(this.changeWordInterval);
    }

    componentDidUpdate(_, prevState){
        (prevState.wordIndex !== this.state.wordIndex) && this.autoPrint(150);
    }

    autoPrint(speed){        
        const { words = [] } = this.props;
        const { wordIndex } = this.state;
        
        const word = words[wordIndex];

        for(let i = 0, len = word.length; i < len; i++){
            ((i, letter) => {
                setTimeout(() => {
                    this.setState(prev => ({currentWord: prev.currentWord + letter}))
                },i*speed);
            })(i+1, word[i])
            
          }
      }

    changeWord = () => {
        const { words = [] } = this.props;
        const len = words.length;
        len && (
            this.setState(prev => ({
                wordIndex: (prev.wordIndex === len - 1) ? 0 : prev.wordIndex + 1,
                currentWord: '',
            }))
        );
    }

    render(){
        const { words =[] } = this.props;
        const { wordIndex, currentWord } = this.state;

        return (
            <div class={style.wordContainer}>
                <span class={style.word}>
                    {currentWord}
                </span>
            </div>
        )
    }
}

export default AutoPrintText;