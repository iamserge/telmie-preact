import { h } from 'preact';
import { processBlogBtn } from "../../../utils/prismic-middleware";
import { route } from 'preact-router';

const Button = ({content}) => {
    const { text, link, isExternal } = processBlogBtn(content);
    
    const onClick = () => link && (isExternal ? window.open(link) : route(link));

    return text && <div style={{textAlign: 'center', padding: 5}}>
            <button class='red-btn' onClick={onClick}>{text}</button>
        </div>
}

export default Button;