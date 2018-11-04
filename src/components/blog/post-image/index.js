import { h } from 'preact';
import style from './style.scss';
import { processPostImage } from '../../../utils/prismic-middleware';

const PostImage = ({content = {}}) => {
  const imageData = processPostImage(content);
  return (
    <div
      class={style.blogImage}
      title={imageData.title}
      style={{
        background: `url('${imageData.url}') no-repeat center`,
        backgroundSize: "auto 100%"
      }}
    />
  )
}

export default PostImage;