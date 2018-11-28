import { h, Component, render } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import ContactForm from '../../components/new-landing/contact-form'

import { sendContactData, clearContactData } from '../../actions/user';

class ContactPage extends Component {
	
	componentDidMount(){
		window.scrollTo(0, 0);
	}
    
	render(){
		const {sendContactMessageInfo = {}, locale} = this.props;
		return (
			<div >				
				<ContactForm sendData={this.props.sendContactData} 
					locale = {locale}
					info={sendContactMessageInfo} 
					clearContactData={this.props.clearContactData}/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	sendContactMessageInfo: state.sendContactMessage,
	locale: state.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	sendContactData,
	clearContactData,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactPage);
