import { h } from 'preact';
import Video from '../../homepage/video';
import ReactGA from 'react-ga';
import style from './style.scss';

const HowWorksDetails = ({content={} }) => {
    const { btnText, btnLink } = content;
    const downloadApp = () => ReactGA.outboundLink({
        label: 'Clicked Download App'
    }, () => btnLink && window.open(btnLink));

    return (
        <div class={`${style.howWorksContainer} uk-container`}>
            <div class={style.howWorksText}>
                <div class={style.header}>{content.title}</div>
                <div style={{marginBottom: 40}}>{content.text}</div>
                {btnLink && btnText && 
                    <button class='red-btn' onClick={downloadApp}>{btnText}</button>}
            </div>
            <div class={style.howWorksVideo}>
                <Video videoId = { content.videoID } />
            </div>
        </div> 
	)
}

export default HowWorksDetails;