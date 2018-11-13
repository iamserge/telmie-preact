import { h } from 'preact';
import ServiceCard from '../service-card'
import style from './style.scss';

const FeaturedServices = ({services = [], appLink}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`${style.featuredServices} uk-container`}>
            <div class={style.header}>Featured Services</div>
            <div class={style.services}>
            {services.map(service => (
                <ServiceCard key={service.serviceName} {...service} downloadApp={downloadApp}/>
            ))}
            </div>
        </div>
	)
}

export default FeaturedServices;