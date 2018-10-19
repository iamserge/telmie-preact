import { h } from 'preact';
import AutoPrintText from '../auto-print-text'
import style from './style.scss';

const InfoComponent = ({wordsToPrint = []}) => {

    return (
        <div class={`${style.infoContainer} uk-container`}>
            <div class={style.title}>
                Video-calls with <AutoPrintText words={wordsToPrint}/> experts
            </div>
            <div class={style.subTitle}>Telmie is the best way to find an expert that you can trust. <br/> Find. Contact. Engage. As simple as that.</div>

            <button class='red-btn'>Download app</button>
            {/*<button class='white-btn'>Sign up free</button>*/}
        </div>
	)
}

export default InfoComponent;