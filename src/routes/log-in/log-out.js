import { h, Component } from 'preact';
import { logOff } from '../../actions/user';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import Redirect from '../../components/global/redirect';

class LogOut extends Component {

	render() {
        this.props.logOff();
        console.log('log-out')
		return (
			<Redirect to='/'/>
		);
	}
}

const mapStateToProps = (state) => ({
	
});

const mapDispatchToProps = dispatch => bindActionCreators({
	logOff,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LogOut);