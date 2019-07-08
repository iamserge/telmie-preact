import { h } from 'preact';
import ServiceCard from '../service-card';
import { AE } from "../../../utils/consts";
import style from './style.scss';

const FeaturedServices = ({services = [], title, locale}) => {

    return (
        <div class={`${style.featuredServices} uk-container`}>
            <div class={`${style.header} ${locale===AE && 'arabic-text'}`}>{title}</div>
            <div class={style.services}>
            {services.map(service => (
                <ServiceCard key={service.serviceName} locale={locale} {...service}/>
            ))}
            </div>
        </div>
	)
}

export default FeaturedServices;