import { h } from 'preact';
import style from './style.scss';

const ContactForm = () => {

    return (
        <div class={style.contuctContainer}>
            <div class={style.header}>Contact us</div>
            <div class={style.subHeader}>Any questions? Drop us a line.</div>
            
            <div class={style.contactForm}>
                <input class='new-input' placeholder='Your name'/>
                <input class='new-input' placeholder='Your email'/>
                <input class='new-input' placeholder='Company'/>
                <input class='new-input' placeholder='Subject'/>
                <input class='new-input' placeholder='Your message'/>
                <button class='red-btn'>Submit</button>
            </div>
        </div>
	)
}

export default ContactForm;