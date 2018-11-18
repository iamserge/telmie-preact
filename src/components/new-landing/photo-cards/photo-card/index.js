import { h, Component } from 'preact';
import Hr from '../../../hr'
import style from './style.scss';

class PhotoCard extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.setState({ animation: false });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        let minutesBox = document.getElementById('navigationScroll');
        let minutesBoxPos = document.getElementById('navigationScroll').getBoundingClientRect();
        let scrollTop = window.pageYOffset;

        if ( scrollTop >= minutesBoxPos.top) {
            this.setState({ animation: true });
        }
    }

    render(){
        const {isStat, minutes = 0, name, img, serviceName, price, time, cardStyle = {}} = this.props;
        let minutesArr = [];
        for(let i = 0, max = 10; i < max; i++){
            minutesArr.push(Math.floor(minutes*i/max));
        }
        minutesArr.push(minutes);

        return isStat ? (
        <div class={`${style.photoCard} ${style.statCard}`} style={cardStyle}>
            <div class={style.minWrapper}>
    <div class={this.state.animation ? `${style.minutes} ${style.animated}` : `${style.minutes}`} id="navigationScroll">
            {minutesArr.map(el => (<div>{Number(el).toLocaleString()}</div>))}
    </div>
        </div>
        minutes
        <Hr color='white' width={40} margin={20} />
            <span class={style.signature}>Communicated via Telmie</span>
        </div>
    ) : (
        <div class={style.photoCard} style={cardStyle}>
            <img src={img}/>
            <div class={style.proDetails}>
    <div class={style.proName}>{name}</div>
        <div class={style.proService}>{serviceName}</div>
        <div class={style.charge}>£{price}/{time}</div>
        </div>
        </div>
    )
    }
}

export default PhotoCard;