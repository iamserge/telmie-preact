import { h } from 'preact';
import style from './style.scss';
import AnimatedImage from '../animated-image'

const TextBlock = ({content = []}) => {

    return (
      <div>
      {content.map(text => (
        <div id={`info-section-${text.id}`} class={`${text.right == 1 && style.TextBlockRight} ${style.TextBlock} uk-container`}>
          <div class={style.howWorksText}>
            <div class={style.header}>{text.title}</div>
            <div class={style.text}>{text.text}</div>
          </div>
          <div class={style.image}>
            {text.animated == 1 ?
              <AnimatedImage content={text} />
              : <img src={text.img} height={text.img_height/2} width={text.img_width/2} alt={text.title}/>
            }
          </div>
        </div>
      ))}
      </div>
	)
};

export default TextBlock;