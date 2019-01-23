import { h } from 'preact';
import Hr from '../../../hr'
import TrackVisibility from 'react-on-screen';
import { AE } from "../../../../utils/consts";

import style from './style.scss';

const StatCard = (props) => {
    const {minutes = 0, cardStyle = {}} = props;
    let minutesArr = [];
    for(let i = 0, max = 10; i < max; i++){
        minutesArr.push(Math.floor(minutes*i/max));
    }
    minutesArr.push(minutes);
    return (
        <div class={`${style.photoCard} ${style.statCard} ${props.locale===AE && 'arabic-text'}`} style={cardStyle}>
            <div class={style.minWrapper}>
                <div class={`${style.minutes} ${props.isVisible && style.animateMinutes}`}>
                    {minutesArr.map(el => (<div>{Number(el).toLocaleString()}</div>))}
                </div>
            </div>
            minutes
            <Hr color='white' width={40} margin={20} />
            <span class={style.signature}>Communicated via Telmie</span>
		</div>
    )
}

const PhotoCard = props => {
    const {isStat, name, img, serviceName, price, time, cardStyle = {}, locale} = props;
    
    return isStat ? (
        <TrackVisibility once>
            <StatCard {...props}/>
        </TrackVisibility>
	) : (
        <div class={style.photoCard} style={cardStyle}>
			<img src={img}/>
            <div class={`${style.proDetails} ${locale===AE && 'arabic-text'}`}>
                <div class={style.proName}>{name}</div>
                <div class={style.proService}>{serviceName}</div>
                <div class={style.charge}>£{price}/{time}</div>
            </div>
		</div>
    )
}

export default PhotoCard;