import { h } from 'preact';
import AutoPrintText from '../auto-print-text'
import style from './style.scss';

const InfoComponent = ({wordsToPrint = [], appLink = ''}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`${style.infoContainer} uk-container-big`}>
            <div class={style.title}>
                Video calls with <AutoPrintText words={wordsToPrint}/> experts
            </div>
            <div class={style.subTitle}>Telmie is the easiest way to talk to an expert that you can trust.</div>

            <button class='red-btn' onClick={downloadApp}>Download app</button>
            {/*<button class='white-btn'>Sign up free</button>*/}
        </div>
	)
}

export default InfoComponent;