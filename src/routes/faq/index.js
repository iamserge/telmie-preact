import { h, Component } from 'preact';
import LandingFAQ from '../../components/new-landing/landing-faq'

//import style from './style.scss';
import {landingFAQ} from './mock-data'

class FAQ extends Component {
	componentDidMount(){
		window.scrollTo(0, 0);
	}
	
	render(){
		return (<div class='uk-container uk-container-small' style={{paddingTop: 50}}>
			<LandingFAQ faqs={landingFAQ} />
		</div>)	
	}
}

export default FAQ;