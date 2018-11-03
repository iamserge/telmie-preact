export function processPostThumbnailData(rawPost){
    const data = rawPost.data;
    let newPostData = {
        id: rawPost.uid,
        title: data.title[0].text,
        date: data.date,
        link: `/blog/${rawPost.uid}`,
        img: data.thumbnail.url,
    }
    if (typeof rawPost.tags != 'undefined' && rawPost.tags[0] && rawPost.tags[0] == 'featured') {
        newPostData.isFeatured = true;
    }
    return newPostData;
}

export function processHomepagePosts(rawPosts){
    let newPosts = [];
    rawPosts.forEach((rawPost)=>{
        const data = rawPost.data;
        let postData = {
            title: data.title[0].text,
            date: data.date,
            link: `/blog/${rawPost.uid}`,
            img: data.thumbnail.url,
        }
        if (data.featured == 'Featured') {
            postData.isFeatured = true;
        }
        newPosts.push(postData)
    })    
    return newPosts;
}
  
  