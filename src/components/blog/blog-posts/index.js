import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';

const BlogPosts = ({blogPosts = []}) => {

  return (
    <div>
      <div class={style.blogPosts}>
        <div class={`${style.blogPostsTitle} uk-container`}>
          <h3>Other posts</h3>
        </div>
        <div class={style.blogPostsSlider}>
          {blogPosts.map(post => (
            <div class={style.blogPost} key={post.id} style={{
              background: `url('${post.img}') no-repeat center`,
              backgroundSize: "auto 100%"
            }}>
              
              <div class={style.blogPostDescription}>
                <p class={style.date}>{post.date}</p>
                {post.title}
                <Link href={post.link} class="red-btn">Full story</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogPosts;