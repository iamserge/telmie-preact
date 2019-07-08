import { h } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { processPostQuote } from '../../../utils/prismic-middleware';
import { AE } from "../../../utils/consts";

const PostQuote = ({content = {}, locale}) => {
  const quoteData = processPostQuote(content);
  return (
    <div class={`${style.blogQuote} uk-container ${locale===AE && 'arabic-text'}`}>
      <blockquote>{quoteData.text}</blockquote>
      {quoteData.author && <p class={style.blogAuthorName}>{quoteData.author}</p>}
    </div>
  )
}

export default PostQuote;