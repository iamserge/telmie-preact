import { h } from 'preact';
import LandingFAQ from '../../components/new-landing/landing-faq'

//import style from './style.scss';
import {landingFAQ} from './mock-data'

const FAQ = (props) => {
    
	return (<div class='uk-container uk-container-small' style={{paddingTop: 50}}>
		<LandingFAQ faqs={landingFAQ} />
	</div>)	
}

export default FAQ;