import { h } from 'preact';
import Video from '../../homepage/video';
import style from './style.scss';

const HowWorksDetails = ({videoId, appLink = ''}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`${style.howWorksContainer} uk-container`}>
            <div class={style.howWorksText}>
                <div class={style.header}>How it works</div>
                <div style={{marginBottom: 40}}>Telmie is a social app that connects experts with advice-seekers quickly and easily over video. It's the fastest, easiest and most trusted way of finding whatever advice you require.</div>
                <button class='red-btn' onClick={downloadApp}>Download app</button>
            </div>
            <div class={style.howWorksVideo}>
                <Video videoId = { videoId } />
            </div>
        </div> 
	)
}

export default HowWorksDetails;