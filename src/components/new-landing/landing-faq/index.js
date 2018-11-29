import { h, Component } from 'preact';
import Collapse from 'rc-collapse'
import { langPack } from "../../../utils/langPack";
import { EN } from "../../../utils/consts";

import 'rc-collapse/assets/index.css';
import style from './style.scss';

const tabs = (locale = EN) => ([{
    text: langPack[locale].GENERAL_QUESTIONS,
    value: 'general',
},{
    text: langPack[locale].CUSTOMERS_QUESTIONS,
    value: 'customers',
},{
    text: langPack[locale].EXPERTS_QUESTIONS,
    value: 'experts',
},{
    text: langPack[locale].PAYMENTS_QUESTIONS,
    value: 'payments',
}]);

const headerProps = (index, active) => ({
    showArrow: false,
    headerClass: `${style.collapseHeader} ${index == active ? style.opened : style.closed}`,
});

class LandingFAQ extends Component {
    constructor(props){
        super(props);

        this.state = {
            activeTab: tabs(props.locale)[0].value,
            activeQuest: '',
        }
    }

    shouldComponentUpdate(){

    }

    setActiveTab = (tab) =>  () => this.setState({ activeTab: tab, activeQuest: ''});
    setActiveQuest = (quest) => this.setState({ activeQuest: quest});

    renderHeder = (text) => ([
        <div class={`${style.toggle}`}>
            <div class={style.horizontal}></div>
            <div class={style.vertical}></div>
        </div>,
        text
    ]);

    renderQuestions = (arr = []) => {
        const {activeQuest} = this.state;
        return (
            <Collapse accordion={true} activeKey={activeQuest} onChange={this.setActiveQuest}>
                {arr.map(({question, answer}, index) => (
                    <Collapse.Panel key={index.toString()} 
                        header={this.renderHeder(question)} 
                        {...headerProps(index.toString(), activeQuest)}>
                        {answer}
                    </Collapse.Panel>
                ))}
            </Collapse>
        )
    }

    render(){
        const { activeTab } = this.state;
        const { nodeBeforeQuestions = '', mainQuestion } = this.props;
        const currentQuestions = this.props.faqs[`${activeTab}Questions`];

        return (
            <div class={`uk-container`} style={this.props.styles}>
                <div class={style.headerFAQ}>{this.props.headerFAQ || langPack[this.props.locale].FAQ}</div>
                {nodeBeforeQuestions && <div>{nodeBeforeQuestions}</div>}
                {mainQuestion && <div class={style.mainQuestionContainer}>
                    <div class={style.question}>{mainQuestion.question}</div>
                    <div class={style.answer}>{mainQuestion.answer}</div>
                </div>}
                <div class={style.landingFAQ}>
                    <div class={style.menuContainer}>
                        <ul class={style.faqMenu}>
                            {tabs(this.props.locale).map(({text,value}) => (
                                <li key={value} 
                                    class={activeTab===value ? style.active : '' } 
                                    onClick={this.setActiveTab(value)}> {text} </li>
                            ))}
                        </ul>
                    </div>

                    <div class={style.content}>
                        {this.renderQuestions(currentQuestions)}
                    </div>
                </div>
            </div>
        )
    }
}

export default LandingFAQ;