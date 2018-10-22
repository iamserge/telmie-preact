import { h } from 'preact';
import style from './style.scss';

const ServiceCard = ({background, serviceName}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "auto 100%"}
    return (
        <div style={cardStyle} class={style.serviceCard}>
            <div class={style.serviceName}>{serviceName}</div>
        </div>
	)
}

export default ServiceCard;