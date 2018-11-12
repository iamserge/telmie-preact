import { h } from 'preact';
import Video from '../../homepage/video';
import style from './style.scss';

const TextBlock = ({text}) => {

    return (
        <div class={text[0].right == true ? `${style.TextBlock} ${style.TextBlockRight} uk-container` : `${style.TextBlock} uk-container`}>
            <div class={style.howWorksText}>
                <div class={style.header}>{text[0].title}</div>
                <div class={style.text}>{text[0].text}</div>
            </div>
            <div class={style.howWorksVideo}>
              {text[0].videoId ?
                <Video videoId = { text.videoID } />
                : <img src={text[0].img} alt={text[0].title}/>
              }
            </div>
        </div> 
	)
};

export default TextBlock;