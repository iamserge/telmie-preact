import Prismic from 'prismic-javascript';
import { route } from 'preact-router';
import { RU, EN, langs } from "./consts";

function compareUrlLocale(props){
    const urlLocale = props.path.toString().split('/')[1];
    let _lang = '';

    return langs[props.locale].code === urlLocale ? props.locale : (
        Object.keys(langs).some(el => {
            return (langs[el].code === urlLocale) ? (_lang = el, true) : false
        }) ? 
            (props.changeLocale(_lang), _lang) : (props.changeLocale(EN), EN)
    )
}
export function getPage(props ={}, urlEng){
    const conditions = props.tag ? [
        Prismic.Predicates.at('document.type', props.type),
        Prismic.Predicates.at('document.tags', [props.tag])
    ] : Prismic.Predicates.at('document.type', props.type);

    const lang = compareUrlLocale(props);

    return props.prismicCtx && props.prismicCtx.api.query(
        conditions,
        { lang }
    ).then((response, err) => {
        if(response.results_size > 0){
            const page = response.results[0];
            props.changeLocaleLangs(page.alternate_languages);
			return page;
        } else {
            props.changeLocale();
            route(urlEng ? urlEng : `/${/\/(.+)/.exec(props.path.substring(1))[1]}`, true);
            return null;
        }
    }).catch(e => {
        console.log(e);
        return null;
    })
}

export function processPostThumbnailData(rawPost ={}){
    const { data={} } = rawPost;
    let newPostData = {};
    try {
        newPostData = {
            id: rawPost.uid,
            title: data.title[0].text,
            date: data.date,
            link: `/blog/${rawPost.uid}`,
            img: data.thumbnail.url,
        }
    }
    catch(e){
        console.log(e);
        newPostData = null;
    }
    if (typeof rawPost.tags != 'undefined' && rawPost.tags[0] && rawPost.tags[0] == 'featured') {
        newPostData.isFeatured = true;
    }
    return newPostData;
}

export function processRecentPosts(rawPosts){
    return rawPosts.map((rawPost)=> processPostThumbnailData(rawPost));
}

function compliteTextWithTags(tags, text){
    let nodes = [];
    (tags && tags.length) && tags.forEach(el => {
        switch (el.type){
            case "hyperlink":
                nodes.push(text.substring(0, el.start));
                nodes.push(<a href={el.data.url} target="_blank">{text.substring(el.start, el.end)}</a>);
                nodes.push(text.substring(el.end));
                break;
            case 'strong':
                nodes.push(text.substring(0, el.start));
                nodes.push(<strong>{text.substring(el.start, el.end)}</strong>);
                nodes.push(text.substring(el.end));
                break;
            default: 
                nodes.push(text);
        }
    });

    return nodes.length ? nodes : text;
}

function processContent(content, tags){
    return compliteTextWithTags(tags, content);
}
function processTagsInText(postData){
    return compliteTextWithTags(postData.spans, postData.text);
}

export function processPostText(postData){
    let serialiseText = (type, content, tags) => {
        switch (type) {
            case 'list-item':
                return (<li>{content}</li>);
            case 'heading2':
                return (<h2>{content}</h2>);
            case 'heading3':
                return (<h3>{content}</h3>);
            default:
                return (<p>{processContent(content, tags)}</p>);
        }
        },
        nodes = [];

    postData.primary.text.forEach((text)=>{
        nodes.push(serialiseText(text.type, text.text,text.spans))
    });
    
    return nodes;
}



export function processPostImage(postData ={}){
    let imageData = {
        url: postData.primary.image.url
    };
    if (postData.primary.caption.length > 0) {
        imageData.title = postData.primary.caption[0].text;
    }
    return imageData;
}

export function processPostQuote(postData){
    try{
        return {
            text: postData.primary.quote[0].text,
            author: postData.primary.author[0].text
        }
    }
    catch(e){
        console.log(e);
        return {
            text: '',
            author: '',
        }
    }
}
export function processAuthorInfo(postData){
    try{
        return {
            title: postData.primary.section_title[0].text,
            aName: postData.primary.author_name[0].text,
            aDescription: postData.primary.author_description[0].text,
            aAvatar: postData.primary.author_avatar.url,
        }
    }
    catch(e){
        console.log(e);
        return null;
    }
}
const processDate = (date, locale = "en-us") => {
    let dateObj = new Date(date);
    
    return dateObj.toLocaleString(locale, { month: "long", day: 'numeric', year: "numeric" });

}
export function processPostData(rawData ={}, locale){
    try{
        return {
            title: rawData.title[0].text,
            date: processDate(rawData.date, locale),
            body: rawData.body,
        }
    } catch(e){
        console.log(e);
        return {
            title: '',
            date: null,
            body: [],
        }
    }
}
const getExperts = (data) => {
    let side1 = [],
        side2 = [];
    try{
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
    } catch(e){
        console.log(e);
        return {side1: [], side2: []}
    }
}

const getServices = (data) => {
    try {
        return data.services.map((service) => ({
            link: service.link[0] ? service.link[0].text : '',
            earnBtnText: service.earning_btn_text,
            linkLearn: service.link_learning[0] ? service.link_learning[0].text : '',
            learnBtnText: service.learning_btn_text,
            background: service.image.url,
            serviceName: service.title1[0].text,
            description: service.description[0] && service.description[0].text,
        }));
    } catch(e){
        console.log(e);
        return [];
    }
    
};

const getFAQs = (faqData) => {
    let allFaqs = {},
        getFAQ = (name) => {
            try {
                return faqData[name].map((faq) => ({
                    question: faq.question[0].text,
                    answer: processTagsInText(faq.answer[0]),
                }))
            } catch(e){
                console.log(e);
                return [];
            }
        }

    allFaqs.generalQuestions = getFAQ('general_faqs');
    allFaqs.customersQuestions = getFAQ('customer_faqs');
    allFaqs.expertsQuestions = getFAQ('experts_faqs');
    allFaqs.paymentsQuestions = getFAQ('payments_faqs');

    return (allFaqs.generalQuestions.length === 0 
        && allFaqs.customersQuestions.length === 0 
        && allFaqs.expertsQuestions.length === 0 
        && allFaqs.paymentsQuestions.length === 0 ) ? null : allFaqs;
}

export function processHomepageData(data = {}){
    let processedData = {};

    try{
        processedData.mainSection = {
            title: data.title[0].text,
            subTitle: data.sub_title[0].text,
            typedWords: data.typed_words[0].text
        };
    } catch(e){
        console.log(e);
        processedData.mainSection = null;
    }

    processedData.experts = getExperts(data);

    try{
        processedData.howItWorks = {
            title: data.how_it_works_title[0].text,
            text: data.how_it_works[0].text,
            videoID: data.how_it_works_video.video_id
        };
    } catch(e){
        console.log(e);
        processedData.howItWorks = null;
    }
    
    try {
        processedData.servicesTitle = data.featured_services_title[0].text;
    }
    catch (e){
        console.log(e);
        processedData.servicesTitle = '';
    }
    
    processedData.services = getServices(data);

    try{
        processedData.app = {
            title: data.app_title[0].text,
            text: data.app_text[0] ? data.app_text[0].text : '',
            img: data.app_image.url,
        };
    } catch(e){
        console.log(e);
        processedData.app = null;
    }
    

    processedData.faqs = getFAQs(data);

    try{
        processedData.becomePro = {
            title: data.earn_more_title[0].text,
            text: data.earn_more_text[0].text
        };
    } catch(e){
        console.log(e);
        processedData.becomePro = null;
    }

    return processedData;
}

const getSteps = (data) => {
    try{
        return data.work_steps.map((step) => ({
            id: step.id[0].text,
            title: step.step_title[0].text,
            text: step.step_text[0].text,
            icon: step.step_icon.url,
          }));
    } catch(e){
        console.log(e);
        return [];
    }
    
};

const getReasons = (data) => {
    try{
        return data.reasons.map((reason) => ({
            icon: reason.reason_icon.url,
            title: reason.reason_title[0].text,
            text: reason.reason_text[0].text,
          }));
    } catch(e){
        console.log(e);
        return [];
    }
};

const getReviews = (data) => {
    try{
        return data.reviews.map((review) => ({
            avatar: review.avatar.url,
            name: review.name[0].text,
            title: review.review_title[0].text,
            text: review.review_text[0].text,
          }));
    } catch(e){
        console.log(e);
        return [];
    }
};

const getInfo = (data) => {
    try{
        return data.info_section.map((infotext) => ({
            id: infotext.section_id,
            img: infotext.section_image.url,
            img_height: infotext.section_image.dimensions.height,
            img_width: infotext.section_image.dimensions.width,
            title: infotext.section_title[0].text,
            text: infotext.section_text[0].text,
            right: infotext.is_right_position,
            animated: infotext.is_animated
          }));
    } catch(e){
        console.log(e);
        return [];
    }
};

export function processTextPageData(data){
    let processedData = {};

    processedData = { ...data };

    try{
        processedData.becomePro = {
            img: data.earn_money_image.url,
            title: data.earn_money_title[0].text,
            emphasized: data.emphasize_title_part[0].text,
            text: data.earn_money_text[0].text
        };
    } catch(e){
        console.log(e);
        processedData.becomePro = {
            img: '',
            title: '',
            emphasized: '',
            text: '',
        };
    }
    

    processedData.info = getInfo(data);
    processedData.steps = getSteps(data);
    processedData.reasons = getReasons(data);
    //processedData.reviews = getReviews(data);

    try{
        processedData.titles = {
            how_works_title: data.how_works_title[0].text,
            choose_us_title: data.choose_us_title[0].text
          };
    } catch(e){
        console.log(e);
        processedData.titles = {
            how_works_title: '',
            choose_us_title: '',
          };
    }
    
    try{
        processedData.app = {
            title: data.app_title[0] ? data.app_title[0].text : '',
            text: data.app_text[0] ? data.app_text[0].text : '',
            img: data.app_image.url,
        };
    } catch(e){
        console.log(e);
        processedData.app = {
            title: '',
            text: '',
            img: '',
        };
    }
    

    return processedData;
}
export function processReviewsData(data){
    return getReviews(data);
}

export function processFAQPageData(data){
    let processedData = {};

    processedData.faqs = getFAQs(data);

    try{
        processedData.mainQuestion = {
            question: data.telmie_question[0].text,
            answer: processTagsInText(data.telmie_answer[0]),
        };
    } catch(e){
        console.log(e);
    }

    return processedData;
}

export function processGlobalMessage(data){
    let mes = '';
    try{
        mes = processTagsInText(data.message[0])
    } catch(e){
        console.log(e);
        return '';
    }
    return mes;
}