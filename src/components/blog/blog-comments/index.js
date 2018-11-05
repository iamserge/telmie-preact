import { h } from 'preact';
import style from './style.scss';

const BlogComments = ({blogComments = []}) => {

  return (
    <div>
      <div class={style.blogContainer}>
        <div class={`${style.blogComments} uk-container`}>
          <h3>{blogComments.length} Comments</h3>

          {blogComments.map(comment => (

            <div class={style.blogComment}>
              <div class={style.blogAuthorInner}>
                <div class={style.blogAuthorAvatar}>
                  <img src={comment.avatar} alt={comment.name} />
                </div>
                <div class={style.blogAuthorAbout}>
                  <div class={style.blogAuthorInfo}>
                    <div class={style.blogAuthorName}>
                      <span class={style.name}>{comment.nanme}</span>
                      <span class={style.date}>{comment.date}</span>
                    </div>
                    <button class={style.blogCommentReply}>Reply</button>
                  </div>
                  {comment.message}
                </div>
              </div>

{/*              <div class={style.blogComment}>
                <div class={style.blogAuthorInner}>
                  <div class={style.blogAuthorAvatar}>
                    <img src="/assets/experts/expert1.png" alt="" />
                  </div>
                  <div class={style.blogAuthorAbout}>
                    <div class={style.blogAuthorInfo}>
                      <div class={style.blogAuthorName}>
                        <span class={style.name}>JOHANNA DOE</span>
                        <span class={style.date}>21.05.2018</span>
                      </div>
                      <button class={style.blogCommentReply}>Reply</button>
                    </div>
                    Vivamus ornare, leo eget pharetra euismod, nisl elit aliquam
                    velit, eu luctus odio nulla ac libero. Cras sagittis eget lacus in
                    aliquam. Phasellus magna turpis, elementum at ligula non, blandit
                    porta sapien. Suspendisse congue diam nec ipsum sagittis rutrum.
                  </div>
                </div>
              </div>*/}

            </div>
          ))}
        </div>

        <div class={style.blogCommentAdd}>
          <h3>Add Comment</h3>
          <form action="">
            <div class={style.blogAuthorInner}>
              <div class={style.blogAuthorAvatar}>
                <img src="/assets/experts/expert2.png" alt="" />
              </div>
              <div class={style.blogCommentType}>
                <textarea rows="12" />
              </div>
            </div>
            <div class={style.blogCommentAddButton}>
              <button class="red-btn">Post comment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BlogComments;