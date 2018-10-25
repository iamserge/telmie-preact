import { h, Component } from 'preact';
import SimpleReactValidator from 'simple-react-validator';
import Spinner from '../../global/spinner';

import style from './style.scss';

export default class ContactForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: '',
            email: '',
            company: '',
            subject: '',
            body: '',
        }
        this.validator = new SimpleReactValidator();
    }

    sendHandler = () => {
        this.validator.allValid() ? (
            this.props.sendData(this.state),
            this.setState({load: true})
        ) : (
            this.validator.showMessages(),
			this.forceUpdate()
        );
    }

    onChangeHandler = (e) => {
        const {name, value} = e.target;
        this.setState({ [name]: value });
    }

    componentWillReceiveProps(nextProps){
        const {info ={}} = nextProps;
        const {errorMsg = '', isSent = false} = info;
        (isSent && this.state.load) && this.setState({
            name: '',
            email: '',
            company: '',
            subject: '',
            body: '',
            load: false,
        });
    }

    render(){
        const {name,email,company,subject,body, load} = this.state;
        const {info = {}} = this.props;
        const {errorMsg = '', isSent = false} = info;
        
        return (
            <div class={style.contuctContainer}>
                <div class={style.header}>Contact us</div>
                <div class={style.subHeader}>Any questions? Drop us a line.</div>
                
                    {!load || errorMsg ? (
                        <div class={style.contactForm}>
                            <div className="input-container">
                                <input type="text" class='new-input' value={name} name="name" placeholder='Your name' onChange={this.onChangeHandler}/>
                                {this.validator.message('name', name, 'required', 'validation-tooltip', {required: 'Please enter name'})}
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={email} name="email" placeholder='Your email' onChange={this.onChangeHandler}/>
                                {this.validator.message('email', email, 'required|email', 'validation-tooltip', {required: 'Please enter email', email: 'Please enter correct email'})}
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={company} name="company" placeholder='Company' onChange={this.onChangeHandler}/>
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={subject} name="subject" placeholder='Subject' onChange={this.onChangeHandler}/>
                                {this.validator.message('subject', subject, 'required', 'validation-tooltip', {required: 'Please enter subject'})}
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={body} name="body" placeholder='Your message' onChange={this.onChangeHandler}/>
                                {this.validator.message('body', body, 'required', 'validation-tooltip', {required: 'Please enter message'})}
                            </div>

                            <div class={style.formControl}>
                                {errorMsg && <div class={style.errorMsg}>{errorMsg}</div>}
                                <button class='red-btn' onClick={this.sendHandler}>
                                    Submit
                                </button>
                            </div>
                        </div>
                        ) : <Spinner/> }
            </div>
        )
    }
}