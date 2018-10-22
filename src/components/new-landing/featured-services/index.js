import { h } from 'preact';
import ServiceCard from '../service-card'
import style from './style.scss';

const FeaturedServices = ({serviceCards = []}) => {

    return (
        <div class={`${style.featuredServices} uk-container`}>
            <div class={style.header}>Featured Services</div>
            <div class={style.services}>
            {serviceCards.map(card => (
                <ServiceCard key={card.serviceName} {...card}/>
            ))}
            </div>
        </div>
	)
}

export default FeaturedServices;