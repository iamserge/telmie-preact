import { h } from 'preact';
import style from './style.scss';

const BestComment = () => {

  return (
    <div class={`${style.blogAuthor} uk-container`}>
      <h3>About the Author</h3>
      <div class={style.blogAuthorInner}>
        <div class={style.blogAuthorAvatar}>
          <img src="/assets/experts/expert2.png" alt="" />
        </div>

        <div class={style.blogAuthorAbout}>
          <p class={style.blogAuthorInfo}>JOHANNA DOE</p>
          Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam velit, eu
          luctus odio nulla ac libero. Cras sagittis eget lacus in aliquam.
          Phasellus magna turpis, elementum at ligula non, blandit porta sapien.
          Suspendisse congue diam nec ipsum sagittis rutrum.
        </div>
      </div>
    </div>
    )
}

export default BestComment;