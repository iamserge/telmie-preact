import { h, Component } from 'preact';
import style from './style.scss';
import Card from "../card"

import ProDetailsTab from './tab-pro-details'
import GeneralTab from './tab-general'
import PreviewTab from './tab-preview'


const links = [{
    name: 'general',
    content: 'General',
},{
    name: 'pro',
    content: 'Pro details',
},{
    name: 'preview',
    content: 'Preview profile',
}]

export default class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            activeLink: links[0].name,
        }
    }
    
    onNavigateHandler = (e) => {
        this.setState({activeLink: e.target.getAttribute('name')})
    }
    
    renderPreviewTab = () => {
        return (
            null
        )
    }

    render({userData = {}}){
        let tabContent = null;

        switch (this.state.activeLink) {
            case 'general':
                tabContent = <GeneralTab userData={userData}
                                        editDetails={this.props.editDetails}
                                        uploadPhoto={this.props.uploadPhoto}/>;
                break;
            case 'pro':
                tabContent = <ProDetailsTab userData={userData}/>;
                break;
            case 'preview':
                tabContent = <PreviewTab/>;
                break;
          }

        return (
            <div class= {style.settingsPage}>
                <div class={style.sectionsContainer}>
                    <Card class={style.sectionsCard}>
                        <ul class={style.sectionsList}>
                            {
                                links.map(el => {
                                    return el.name == 'pro' ? (
                                        userData.pro != null && (<li onClick = {this.onNavigateHandler} 
                                                            key={el.name} 
                                                            name={el.name} 
                                                            class={this.state.activeLink === el.name ? style.activeLink : ''}>{el.content}</li>)
                                    ) : (
                                        <li onClick = {this.onNavigateHandler} 
                                            key={el.name} 
                                            name={el.name}
                                            class={this.state.activeLink === el.name ? style.activeLink : ''}>{el.content}</li>
                                    )
                                })
                            }
                        </ul>
                    </Card>
                </div>

                {tabContent}

            </div>
        )
    }
}