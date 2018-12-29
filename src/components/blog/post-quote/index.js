import { h } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { processPostQuote } from '../../../utils/prismic-middleware';

const PostQuote = ({content = {}}) => {
  const quoteData = processPostQuote(content);
  return (
    <div class={`${style.blogQuote} uk-container`}>
      <blockquote>{quoteData.text}</blockquote>
      {quoteData.author && <p class={style.blogAuthorName}>{quoteData.author}</p>}
    </div>
  )
}

export default PostQuote;