import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import EditProfileForm from '../../components/edit-profile/edit-profile-form';
import style from './style.scss';
import { resetPassword } from '../../actions/user';
import Spinner from '../../components/global/spinner';

import { route } from 'preact-router';
import Redirect from '../../components/global/redirect';

class EditProfile extends Component {
	constructor(props){
		super(props);
		this.state = {
			email: ""
		}
		this.onChange = this.onChange.bind(this);
		this.reset = this.reset.bind(this);
	}
	componentDidMount(){

	}
	componentWillReceiveProps(nextProps) {

	}

	onChange(e){
		console.log(e);
		this.setState({
			email: e.target.value
		});

	}
	reset(){
		this.props.resetPassword(this.state.email)
	}
	render() {
		return (
			<div className="uk-container uk-container-small" id="forgotPassword" >
				<h1>Forgot password?</h1>
				<p>
					We heard you’ve forgotten your password.
					Not to worry - new generated pass will be send to your e-mail.
				</p>
				{ this.props.resetFailure && (
					<div className="message failure">Sorry, account with this email does not exists</div>
				)}
				{ this.props.resetSuccess && (
					<div className="message success">Password is reset. Please check your email</div>
				)}
				<div className="inputContainer">
					<input type="text" className="uk-input" name="email" value={this.state.email}  placeholder="email" onChange = {(e)=>{this.onChange(e)}}/>
					<button className="uk-button" onClick={ this.reset }>Reset</button>
				</div>

			</div>

		);

	}
}

const mapStateToProps = (state) => ({
	resetSuccess: state.resetSuccess,
	resetFailure: state.resetFailure
});

const mapDispatchToProps = dispatch => bindActionCreators({
	resetPassword
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfile);
