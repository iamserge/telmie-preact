import { h } from 'preact';
import style from './style.scss';

const TextBlock = ({content = []}) => {

    return (
      <div>
      {content.map(text => (
        <div id={`info-section-${text.id}`} class={`${text.right == 1 && style.TextBlockRight} ${style.TextBlock} uk-container`}>
          <div class={style.howWorksText}>
            <div class={style.header}>{text.title}</div>
            <div class={style.text}>{text.text}</div>
          </div>
          <div class={style.howWorksVideo}>
            <img src={text.img} alt={text.title}/>
          </div>
        </div>
      ))}
      </div>
	)
};

export default TextBlock;