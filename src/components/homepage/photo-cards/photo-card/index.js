import { h, Component } from 'preact';
import Hr from '../../../hr'
import style from './style.scss';

const PhotoCard = props => {
    const {isStat, minutes = 0, name, img, serviceName, price, time} = props;

    return isStat ? (
        <div class={`${style.photoCard} ${style.statCard}`}>
            <div class={style.minutes}>{Number(minutes).toLocaleString()}</div>
            minutes
            <Hr color='white' width={40} margin={20} />
            <span class={style.signature}>Communicated via Telmie</span>
		</div>
	) : (
        <div class={style.photoCard}>
			<img src={img}/>
            <div class={style.proDetails}>
                <div class={style.proName}>{name}</div>
                <div class={style.proService}>{serviceName}</div>
                <div class={style.charge}>£{price}/{time}</div>
            </div>
		</div>
    )
}

export default PhotoCard;