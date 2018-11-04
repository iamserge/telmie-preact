import { h } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { processPostText } from '../../../utils/prismic-middleware';

const PostText = ({content = {}}) => {
  const postText = processPostText(content);
  return (
    <div class={`${style.blogText} uk-container`}>
      {postText.map((Element)=> Element )}
    </div>
  )
}

export default PostText;