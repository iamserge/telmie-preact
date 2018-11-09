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

export function processRecentPosts(rawPosts){
    let newPosts = [];
    rawPosts.forEach((rawPost)=>{
        const data = rawPost.data;
        let postData = processPostThumbnailData(rawPost);
        newPosts.push(postData)
    })    
    return newPosts;
}

export function processPostText(postData){
    let serialiseText = (type, content, tags) => {

/*
        if(tags.length>0){
          tags.forEach((tag)=>{
            let str = content.slice(tag.start, tag.end),
                str_start = content.slice(0,tag.start),
                str_end = content.slice(tag.end),
                str_new;


            if(tag.type === 'strong'){
              let el = 'b'
              str_new = document.createElement(el).innerHTML = str;
             // console.log(str_new)
              content.replace( str, str_new )
            }else if(tag.type === 'hyperlink'){
                let el = 'a',
                str_new = document.createElement(el);
                str_new.innerHTML = str;
                str_new.setAttribute('href', tag.data.url);
               // content = str_start.replace( /str/g, str_new )
               // console.log(str_new)
                content = `${str_start}${str_new}${str_end}`
            }
          });
        }
*/

        switch (type) {
            case 'list-item':
                return (<li>{content}</li>);
            case 'heading2':
                return (<h2>{content}</h2>);
            case 'heading3':
                return (<h3>{content}</h3>);
            default:
                return (<p>{content}</p>);
        }
        },
        nodes = [];

    postData.primary.text.forEach((text)=>{
        nodes.push(serialiseText(text.type, text.text,text.spans))
    });
    
    return nodes;
}

export function processPostImage(postData){
    let imageData = {
        url: postData.primary.image.url
    };
    if (postData.primary.caption.length > 0) {
        imageData.title = postData.primary.caption[0].text;
    }
    return imageData;
}


export function processPostQuote(postData){
    let quoteData = {
        text: postData.primary.quote[0].text,
        author: postData.primary.author[0].text
    };
    
    return quoteData;
}
const processDate = (date) => {
    const locale = "en-us";
    let dateObj = new Date(date);
    
    return dateObj.toLocaleString(locale, { month: "long", day: 'numeric', year: "numeric" });

}
export function processPostData(rawData){
    let postData = {};
    postData.title = rawData.title[0].text;
    postData.date = processDate(rawData.date);
    postData.body = rawData.body;

    return postData;
}
const getExperts = (data) => {
    let side1 = [],
        side2 = [];
        
    data.featured_experts.forEach((expert, index)=>{
        let expertData = {
            id: parseInt(expert.id[0].text),
            name: expert.name[0].text,
            img: expert.photo.url,
            serviceName: expert.proffesion[0].text,
            price: expert.price[0].text,
            time: 'min',
        }
        if (expert.photo.dimensions.height < 600) {
            expertData.isSmall = true;
        }
        if (index <= 1) {
            side1.push(expertData);
        } else {
            side2.push(expertData);
        }
    });
    side2.splice(1, 0 , {
        id: 4,
        isSmall: true,
        isStat: true,
        minutes: data.amount_of_minutes,
    })
    side2 = [[side2[0], side2[1]],[side2[2], side2[3]]]
    return  {
        side1, side2
    }
}

const getServices = (data) => {
    let services = [];
        
    data.services.forEach((service, index)=>{
        let serviceData = {
            background: service.image.url,
            serviceName: service.title1[0].text,
        }
        services.push(serviceData);
    });

    return  services;
}

const getFAQs = (faqData) => {
    let allFaqs = {},
        getFAQ = (name) => {
            let faqs = [];
            faqData[name].forEach((faq)=>{
                faqs.push({
                    question: faq.question[0].text,
                    answer: faq.answer[0].text
                })
            })
            return faqs;
        }

        
    

    allFaqs.generalQuestions = getFAQ('general_faqs');
    allFaqs.customersQuestions = getFAQ('customer_faqs');
    allFaqs.expertsQuestions = getFAQ('experts_faqs');
    allFaqs.paymentsQuestions = getFAQ('payments_faqs');

    return allFaqs;
}

export function processHomepageData(data){
    let processedData = {};

    processedData.mainSection = {
        title: data.title[0].text,
        subTitle: data.sub_title[0].text,
        typedWords: data.typed_words[0].text
    }

    processedData.experts = getExperts(data);

    processedData.howItWorks = {
        title: data.how_it_works_title[0].text,
        text: data.how_it_works[0].text,
        videoID: data.how_it_works_video.video_id
    }


    processedData.services = getServices(data);

    processedData.app = {
        title: data.app_title[0].text,
        text: data.app_text[0].text
    }

    processedData.faqs = getFAQs(data);

    processedData.becomePro = {
        title: data.earn_more_title[0].text,
        text: data.earn_more_text[0].text
    }
    return processedData;
}