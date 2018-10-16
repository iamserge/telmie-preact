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

    generalTab = () => (
        <Collapse accordion={true} activeKey={this.state.activeQuest} onChange={this.setActiveQuest}>
            <Collapse.Panel key='1' header="hello" {...headerProps}>this is panel content</Collapse.Panel>
            <Collapse.Panel key='2' header="title2" {...headerProps}>this is panel content2 or other</Collapse.Panel>
            <Collapse.Panel key='3' header="title3" {...headerProps}>this is panel content2 or other</Collapse.Panel>
        </Collapse>
    );

    customersTab = () => {
        return <div>Customers Tab</div>
    }

    expertsTab = () => {
        return <div>Experts Tab</div>
    }

    paymentsTab = () => {
        return <div>Payments Tab</div>
    }

    render(){
        const { activeTab } = this.state;
        const methodName = `${activeTab}Tab`
        return (
            <div class={`uk-container uk-container-small uk-container-inner ${style.landingFAQ}`}>
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
                    {this[methodName]()}
                    {/*<Collapse accordion={true}>
                        <Collapse.Panel showArrow={false} header="hello" headerClass="my-header-class">this is panel content</Collapse.Panel>
                        <Collapse.Panel header="title2">this is panel content2 or other</Collapse.Panel>
                    </Collapse>*/}
                </div>
                
                
            </div>
        )
    }
}

export default LandingFAQ;