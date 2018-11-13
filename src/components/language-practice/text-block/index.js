import { h } from 'preact';
import Video from '../../homepage/video';
import style from './style.scss';

const TextBlock = ({content}) => {

    return (
        <div class={content.right == true ? `${style.TextBlock} ${style.TextBlockRight} uk-container` : `${style.TextBlock} uk-container`}>
            <div class={style.howWorksText}>
                <div class={style.header}>{content.title}</div>
                <div class={style.text}>{content.text}</div>
            </div>
            <div class={style.howWorksVideo}>
              <img src={content.img} alt={content.title}/>
            </div>
        </div> 
	)
};

export default TextBlock;