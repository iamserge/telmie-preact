import { h, Component } from 'preact';
import { init } from 'ityped'
import style from './style.scss';

const _words = ["Sports Coach", "Immigration Adviser", "Dietary Guru", "Fashion Expert", "Growth Hacker", "Career Coach", "Wedding Planner", "GDPR Expert", "Business Adviser", "Language Speaker", "Startup Ninja", "Design Consultant", "Scale-up Hacker", "SEO Rock Star", "Pets Guru", "Marketing Ninja"];
class AutoPrintText extends Component {
    
    componentDidMount(){
        init(this.wordArea, { showCursor: false, typeSpeed:  150, backDelay:  1000, strings: _words });
    }

    componentDidUpdate(_, prevState){
        //(prevState.wordIndex !== this.state.wordIndex) && this.autoPrint(200);
    }

    render(){

        return (
            <div class={style.wordContainer}>
                <span class={style.word} ref={ref => this.wordArea = ref} />
            </div>
        )
    }
}

export default AutoPrintText;