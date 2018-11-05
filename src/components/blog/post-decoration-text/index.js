import { h } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { processPostText } from '../../../utils/prismic-middleware';

const PostDecorationText = ({content = {}}) => {
  const postText = processPostText(content);
  return (
    <div class={`${style.blogText} ${style.blogTextMain} ${style.blogDecoration} uk-container`}>
      {postText.map((Element)=> element )}
    </div>
  )
}

export default PostDecorationText;