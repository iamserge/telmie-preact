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
		const {sendContactMessageInfo = {}} = this.props;
		return (
			<div >				
				<ContactForm sendData={this.props.sendContactData} 
					info={sendContactMessageInfo} 
					clearContactData={this.props.clearContactData}/>
			</div>
		);
	}
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
