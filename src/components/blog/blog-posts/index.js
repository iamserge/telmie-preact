import { h } from 'preact';
import style from './style.scss';

const BlogPosts = ({blogPosts = []}) => {

  return (
    <div>
      <div class={style.blogPosts}>
        <div class={`${style.blogPostsTitle} uk-container`}>
          <h3>Other posts</h3>
        </div>
        <div class={style.blogPostsSlider}>
          {blogPosts.map(post => (
            <div class={style.blogPost} key={post.id}>
              <img src={post.img} alt="" />
              <div class={style.blogPostDescription}>
                <p class={style.date}>{post.date}</p>
                {post.title}
                <button class="red-btn">Full story</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogPosts;