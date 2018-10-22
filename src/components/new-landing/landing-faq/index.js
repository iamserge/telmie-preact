import { h, Component } from 'preact';
import Collapse from 'rc-collapse'

import 'rc-collapse/assets/index.css';
import style from './style.scss';

const tabs = [{
    text: 'General Questions',
    value: 'general',
},{
    text: 'Customers',
    value: 'customers',
},{
    text: 'Experts',
    value: 'experts',
},{
    text: 'Payments',
    value: 'payments',
}];

const headerProps = {
    showArrow: false,
    headerClass: style.collapseHeader,
}

class LandingFAQ extends Component {
    constructor(props){
        super(props);

        this.state = {
            activeTab: tabs[0].value,
            activeQuest: '',
        }
    }

    shouldComponentUpdate(){

    }

    setActiveTab = (tab) =>  () => this.setState({ activeTab: tab, activeQuest: ''});
    setActiveQuest = (quest) => this.setState({ activeQuest: quest});

    renderHeder = (text) => ([<img src='/assets/new-landing-page/group28.png' alt='' class={style.hIcon}/>, text])

    renderQuestions = (arr = []) => {
        const {activeQuest} = this.state;
        return (
            <Collapse accordion={true} activeKey={activeQuest} onChange={this.setActiveQuest}>
                {arr.map(({question, answer}, index) => (
                    <Collapse.Panel key={index} header={this.renderHeder(question)} {...headerProps}>
                        {answer}
                    </Collapse.Panel>
                ))}
            </Collapse>
        )
    }

    render(){
        const { activeTab } = this.state;
        const currentQuestions = this.props[`${activeTab}Questions`];

        return (
            <div class={`uk-container`} style={this.props.styles}>
                <div class={style.headerFAQ}>FAQ</div>
                <div class={style.landingFAQ}>
                    <div class={style.menuContainer}>
                        <ul class={style.faqMenu}>
                            {tabs.map(({text,value}) => (
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