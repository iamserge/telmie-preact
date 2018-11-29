import { h, Component } from 'preact';
import SimpleReactValidator from 'simple-react-validator';
import Spinner from '../../global/spinner';
import { langPack } from "../../../utils/langPack";
import { EN } from "../../../utils/consts";

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
    componentWillUnmount(){
        this.props.clearContactData && this.props.clearContactData();
    }

    render(){
        const {name,email,company,subject,body, load} = this.state;
        const {info = {}, locale=EN} = this.props;
        const {errorMsg = '', isSent = false} = info;
        
        return (
            <div class={style.contuctContainer}>
                <div class={style.header}>{langPack[locale].CONTACT_US.title}</div>
                <div class={style.subHeader}>{langPack[locale].CONTACT_US.subTitle}</div>
                
                    {!load || errorMsg ? (
                        <div class={style.contactForm}>
                            <div className="input-container">
                                <input type="text" class='new-input' value={name} name="name" placeholder={langPack[locale].CONTACT_US.name} onChange={this.onChangeHandler}/>
                                {this.validator.message('name', name, 'required', 'validation-tooltip', {required: 'Please enter name'})}
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={email} name="email" placeholder={langPack[locale].CONTACT_US.email} onChange={this.onChangeHandler}/>
                                {this.validator.message('email', email, 'required|email', 'validation-tooltip', {required: 'Please enter email', email: 'Please enter correct email'})}
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={company} name="company" placeholder={langPack[locale].CONTACT_US.company} onChange={this.onChangeHandler}/>
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={subject} name="subject" placeholder={langPack[locale].CONTACT_US.subject} onChange={this.onChangeHandler}/>
                                {this.validator.message('subject', subject, 'required', 'validation-tooltip', {required: 'Please enter subject'})}
                            </div>
                            <div className="input-container">
                                <input class='new-input' value={body} name="body" placeholder={langPack[locale].CONTACT_US.message} onChange={this.onChangeHandler}/>
                                {this.validator.message('body', body, 'required', 'validation-tooltip', {required: 'Please enter message'})}
                            </div>

                            <div class={style.formControl}>
                                {errorMsg && <div class={style.errorMsg}>{errorMsg}</div>}
                                {isSent && <div class={style.errorMsg}>{langPack[locale].CONTACT_US.success}</div>}
                                <button class='red-btn' onClick={this.sendHandler}>
                                    {langPack[locale].CONTACT_US.submitBtn}
                                </button>
                            </div>
                        </div>
                        ) : <Spinner/> }
            </div>
        )
    }
}