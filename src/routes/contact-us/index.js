import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import ContactForm from '../../components/new-landing/contact-form'

import { sendContactData, clearContactData } from '../../actions/user';

const ContactPage = props => {
	
    const {sendContactMessageInfo = {}} = props;

    return (
		<div >				
			<ContactForm sendData={props.sendContactData} 
				info={sendContactMessageInfo} 
				clearContactData={props.clearContactData}/>
        </div>
    );
	
}

const mapStateToProps = (state) => ({
	sendContactMessageInfo: state.sendContactMessage
});

const mapDispatchToProps = dispatch => bindActionCreators({
	sendContactData,
	clearContactData,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactPage);
