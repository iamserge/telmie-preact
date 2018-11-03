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