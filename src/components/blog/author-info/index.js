import { h } from 'preact';
import { processAuthorInfo } from '../../../utils/prismic-middleware';

import style from './style.scss';

const AuthorInfo = ({content = {}}) => {
  const data = processAuthorInfo(content);
  return data && (
    <div class={`${style.blogAuthor} uk-container`}>
      <h3>{data.title}</h3>
      <div class={style.blogAuthorInner}>
        <div class={style.blogAuthorAvatar}>
          <img src={data.aAvatar} alt="" />
        </div>

        <div class={style.blogAuthorAbout}>
          <p class={style.blogAuthorInfo}>{data.aName}</p>
          {data.aDescription}
        </div>
      </div>
    </div>
    )
}

export default AuthorInfo;