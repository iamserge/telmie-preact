import { h } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { processPostText } from '../../../utils/prismic-middleware';
import { AE } from "../../../utils/consts";

const PostText = ({content = {}, locale}) => {
  const postText = processPostText(content);
  return (
    <div class={`${style.blogText} uk-container ${locale===AE && 'arabic-text'}`}>
      {postText.map((Element)=> Element )}
    </div>
  )
}

export default PostText;