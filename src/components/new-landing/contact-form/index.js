import { h, Component } from 'preact';
import SimpleReactValidator from 'simple-react-validator';

import style from './style.scss';

export default class ContactForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: '',
            email: '',
            company: '',
            subject: '',
            message: '',
        }
        this.validator = new SimpleReactValidator();
    }

    sendHandler = () => {
        this.validator.allValid() ? (
            console.log("OK", this.state)
        ) : (
            this.validator.showMessages(),
			this.forceUpdate()
        );
    }

    onChangeHandler = (e) => {
        const {name, value} = e.target;
        console.log(name, value)
        this.setState({ [name]: value });
    }

    render(){
        const {name,email,company,subject,message} = this.state;
        return (
            <div class={style.contuctContainer}>
                <div class={style.header}>Contact us</div>
                <div class={style.subHeader}>Any questions? Drop us a line.</div>
                
                <div class={style.contactForm}>
                    <div className="input-container">
                        <input type="text" class='new-input' value={name} name="name" placeholder='Your name' onChange={this.onChangeHandler} />
                        {this.validator.message('name', name, 'required', 'validation-tooltip', {required: 'Please enter name'})}
                    </div>
                    <div className="input-container">
                        <input class='new-input' value={email} name="email" placeholder='Your email' onChange={this.onChangeHandler} />
                        {this.validator.message('email', email, 'required|email', 'validation-tooltip', {required: 'Please enter email', email: 'Please enter correct email'})}
                    </div>
                    <input class='new-input' value={company} name="company" placeholder='Company' onChange={this.onChangeHandler} />
                    <input class='new-input' value={subject} name="subject" placeholder='Subject' onChange={this.onChangeHandler} />
                    <div className="input-container">
                        <input class='new-input' value={message} name="message" placeholder='Your message' onChange={this.onChangeHandler} />
                        {this.validator.message('message', message, 'required', 'validation-tooltip', {required: 'Please enter message'})}
                    </div>

                    <button class='red-btn' onClick={this.sendHandler}>
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}